# D-SI Units

| Repository | Role | PyPI |
| --- | --- | --- |
| [GitLab (PTB)](https://gitlab1.ptb.de/digitaldynamicmeasurement/dcc-and-dsi/dsiUnits) | Maintainer | [![PyPI Version](https://img.shields.io/pypi/v/dsiUnits)](https://pypi.org/project/dsiUnits/) |

`dsiUnits` is a python library with the goal of working with digital SI units, focused on the rules stated at the [BIPM brochure](https://www.bipm.org/en/publications/si-brochure/).
This defines the cases of:

- Initializing a unit base on a given raw string.
- Allow mathematical operation over the units to obtain a new unit.
- Allow SIRP and LaTex representation of any unit.
- Simplify any complex unit to the tree conformed by the SI base units.

!!! note
    This project is directly related with the [_Digital Calibration Certificate_ (DCC)](https://wiki.dcc.ptb.de/)
