# Physicalisch-Technische Bundesanstalt

While working at [PTB](https://www.ptb.de/cms/) I collaborated on multiple Open-Source projects, all of them related with the [DCC (Digital Calibration Certificate) project](https://wiki.dcc.ptb.de/).

## Dcc-Json Toolkit

| Repository | Role | Release |
| --- | --- | --- |
| [GitLab (PTB)](https://gitlab1.ptb.de/digitaldynamicmeasurement/dcc-and-dsi/dcc-json-toolkit) | Creator | [![PyPI Release](https://img.shields.io/pypi/v/dcc-json-toolkit?logo=python&logoColor=white&label=PyPI)](https://pypi.org/project/dcc-json-toolkit/) |

The goal of `dcc-json-toolkit` is to present a set of tools that will prevail to be used with any new XSD release.
By scanning the used schema version, what the package offers is:

- Caching locally any released dcc.xsd file, together with all its required imports.
- Validation of any DCC file, printing all the possible issues it has.
- Bidirectional conversion XML-JSON for DCC files.

## DCC Quantities

| Repository | Role | Release |
| --- | --- | --- |
| [GitLab (PTB)](https://gitlab1.ptb.de/digitaldynamicmeasurement/dcc-and-dsi/dccQuantities) | Owner | [![PyPI Release](https://img.shields.io/pypi/v/dccQuantities?logo=python&logoColor=white&label=PyPI)](https://pypi.org/project/dccQuantities/) |

`dccQuantities` is a project oriented to all developers or researchers that require to work with a DCC table.
The key features that the library provides are:

- **DCC XML Parsing & Serialization**: Allowing to read tables from XML files and to export any new created or modified data.
- **Uncertainty & Unit Awareness**: Ensure uncertainty propagation using [`metas_unclib`](https://github.com/wollmich/metas-unclib-python-wrapper), as well as the correct unit propagation using [`dsiUnits`](#d-si-units).
- **Object‑Oriented Arithmetic**: Allowing any math operation among Quantities (table data).

## D-SI Units

| Repository | Role | Release |
| --- | --- | --- |
| [GitLab (PTB)](https://gitlab1.ptb.de/digitaldynamicmeasurement/dcc-and-dsi/dsiUnits) | Maintainer | [![PyPI Version](https://img.shields.io/pypi/v/dsiUnits?logo=python&logoColor=white&label=PyPI)](https://pypi.org/project/dsiUnits/) |

`dsiUnits` is a python library with the goal of working with digital SI units, focused on the rules stated at the [BIPM brochure](https://www.bipm.org/en/publications/si-brochure/).
This defines the cases of:

- Initializing a unit base on a given raw string.
- Allow mathematical operation over the units to obtain a new unit.
- Allow SIRP and LaTex representation of any unit.
- Simplify any complex unit to the tree conformed by the SI base units.

## Example DCCs

| Repository | Role | Tech |
| --- | --- | --- |
| [GitLab (PTB)](https://gitlab1.ptb.de/digitaldynamicmeasurement/docs/example-dccs) | Creator | ![JavaScript](https://img.shields.io/badge/JavaScript-yellow?style=flat-square&logo=javascript&logoColor=black) ![HTML5](https://img.shields.io/badge/HTML5-orange?style=flat-square&logo=html5&logoColor=white) ![CSS](https://img.shields.io/badge/CSS3-navy?style=flat-square&logo=css&logoColor=white) |

One previous persistent issue was that the example/open-source DCCs were complicated to be found.
The first goal of the project was to present an interface which would hold all DCCs with open-source license.

The best way to comprehend the status and behaviour of the database is to see the deployed GitLab-pages and interact with it:<br>
[https://gitlab-pages.ptb.de/digitaldynamicmeasurement/docs/example-dccs/](https://gitlab-pages.ptb.de/digitaldynamicmeasurement/docs/example-dccs/)
