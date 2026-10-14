# Vietnam administrative-unit dataset

`vietnam-admin-units.json` is the Vietnamese-only simplified dataset from
[ThangLeQuoc/vietnamese-provinces-database](https://github.com/ThangLeQuoc/vietnamese-provinces-database),
licensed under MIT. It contains 34 province/city units and 3,321 commune-level
units and was generated on 20 September 2026, reflecting the repository's
then-current administrative data.

The app bundles this snapshot locally so address selection does not depend on
an external service at runtime. Before production use, the data owner should
verify it against the competent authority's master list and define an update
process for future boundary or name changes.
