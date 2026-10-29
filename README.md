# Overspray maps

Ready-made panel maps for [Overspray](https://github.com/ModestoHagney/overspray), the iRacing livery editor: panel names, twins, centrelines and edge links, so nobody has to map the same car twice.

## Use a map
In Overspray: Map › **Browse maps…**, then pick the car. Load the car's template too; Overspray warns you if the map doesn't match it.

## Share a map
In Overspray: Map › **Share map…**. It saves `<car>.json` and opens this repo's upload page. Drop the file there and press **Propose changes**. GitHub turns it into a pull request, and once it's checked it's in the library for everyone.

- One map per car, in `cars/`, named after the car's iRacing paints folder (e.g. `cars/porsche992rgt3.json`).
- A map for a car that's already here replaces it. The old one stays in the history.
- Maps hold no template pixels: only outlines traced from the template, names and links.

## Exclusion zones
Where a league's broadcast decals go, so drivers keep their paint clear of them. In Overspray: View › **Exclusion zone**, then pick the league.

- One file per car, in `zones/<league>/`, named after the car's iRacing paints folder (e.g. `zones/test/stockcars2-arcachevy25.json`).
- `zones/test/` is a sample for trying it out.

## Licence
Maps are shared under [CC BY-SA 4.0](LICENSE): anyone may use and change them, as long as they credit Overspray maps and share changed maps under the same licence. Maps sent here are shared under the same terms.
