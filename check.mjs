// Checks the car maps a pull request adds or changes, with Overspray's own
// map reader (its regions.js, checked out next to this repo as ./overspray).
// node check.mjs <base ref>  → fails when a map can't be read; says, without
// failing, when a map no longer lines up with the one it replaces.
import { execFileSync } from 'node:child_process';
import { readFileSync, appendFileSync } from 'node:fs';
const { parseRegionMap, mapFit } = await import('./overspray/js/regions.js');

const base = process.argv[2] || 'origin/main';
const git = (...a) => execFileSync('git', a, { encoding: 'utf8', maxBuffer: 64 << 20, stdio: ['ignore', 'pipe', 'ignore'] });
const changed = git('diff', '--name-only', '--diff-filter=AMR', `${base}...HEAD`).split('\n').filter(Boolean);
const out = [];
let bad = 0;
for (const f of changed) {
  if (!/^cars\/[a-z0-9_-]+\.json$/.test(f)) {
    if (f.startsWith('cars/') && !f.startsWith('cars/.')) { out.push(`❌ ${f}: name it after the iRacing car folder, e.g. cars/porsche992rgt3.json`); bad++; }
    continue;
  }
  try {
    const text = readFileSync(f, 'utf8');
    if (text.length > 10 * 1024 * 1024) throw new Error('over 10 MB');
    const raw = JSON.parse(text), map = parseRegionMap(raw);
    // panel names: lowercase letters, digits and _ only (left_door); Overspray saves them that way
    const badNames = (raw.regions || []).filter(r => !r.kind && !/^[a-z0-9]+(_[a-z0-9]+)*$/.test(r.name || '')).map(r => `"${r.name}"`);
    if (badNames.length) throw new Error(`panel names need lowercase letters, numbers and _ only (left_door): ${badNames.slice(0, 10).join(', ')}${badNames.length > 10 ? ` and ${badNames.length - 10} more` : ''}`);
    let note = `${map.regions.length} panels, ${(map.links || []).length} links`;
    let old = null;
    try { old = parseRegionMap(JSON.parse(git('show', `${base}:${f}`))); } catch { /* a new car */ }
    if (!old) note += ', new car';
    else {
      const fit = mapFit ? mapFit(old, map) : null; // older Overspray: no fit check
      if (fit !== null && fit < 0.9) note += `, ⚠️ only ${Math.round(fit * 100)}% of panels line up with the map it replaces: the template may have changed`;
    }
    out.push(`✅ ${f}: ${note}`);
  } catch (err) { out.push(`❌ ${f}: ${err.message}`); bad++; }
}
const text = out.length ? out.join('\n') : 'No car maps changed.';
console.log(text);
if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, text.replace(/\n/g, '\n\n') + '\n');
process.exit(bad ? 1 : 0);
