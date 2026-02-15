# PyBackport: Backporting from newer Python releases

| GitHub Repo | Main Language |  Status |
| --- | --- | --- |
| [PyBackport](https://github.com/Jtachan/PyBackport) | Python | <span style="color: blue">Maintained</span> |

![tests_badge](https://github.com/Jtachan/PyBackport/actions/workflows/CI.yml/badge.svg)
[![PyPI Version](https://img.shields.io/pypi/v/PyBackport)](https://pypi.org/project/PyBackport/)
[![Python Version: 3.8+](https://img.shields.io/badge/python-3.8+-blue)](https://www.python.org/downloads/) 
[![MIT License](https://img.shields.io/github/license/Jtachan/PyBackport)](https://github.com/Jtachan/PyBackport/blob/master/LICENSE)
[![PyPI monthly downloads](https://img.shields.io/pypi/dm/PyBackport)](https://pypi.org/project/PyBackport/) 
[![Docs](https://img.shields.io/badge/Read_the_docs-blue)](https://Jtachan.github.io/PyBackport/)
[![GH stars](https://img.shields.io/github/stars/Jtachan/PyBackport)](https://github.com/Jtachan/PyBackport/) 

The goal of `PyBackport` is to enable the use of new classes and functionalities from newer into older python releases.
While the use of newer python releases is always recommended, there are software releases which constrains are to support old python releases.
These software-tools would, for example, absented of using `str.removeprefix()` if they offer support to python previous than 3.9.

With this purpose, any class imported from `PyBackport` corresponds to:

- The original built-in object if it exists in the current python installation.
- The backported class if the method/object is missing in the current python installation.

![GIF animation displaying how functionalities of `IntEnum` and `StrEnum` are backported to python 3.9](../assets/pr-gif/py_back.gif)

!!! Note
    This is my first ever owned Open Source software.
    I created it with the idea of it being also supported by the community, but its scope is quite small right now.
    It might never reach many people, but I still find places where it comes in handy to install my first OS project.

## Motivation

At the time I started this project, I was working on multiple projects that required support to Python 3.8+.
I knew about [`StrEnums`](https://docs.python.org/3/library/enum.html#enum.StrEnum) and how they could be beneficial for these projects, but they are supported only at Python 3.11.

Due to this limitation, I was looking for a small solution without using [`aenum`](https://pypi.org/project/aenum/).
So I coded a small package (without further requirements) which backports some functionalities to previous Python releases.

I coded some backports for both modules `enum` and `bultins` (only `str` and `dict`).
Right now I don't have any further need in expanding the package, but it is not abandoned.
I will continue developing the package only in the case some specific backport is required.

## Project's behavior

`PyBackport` imports only if required the backported classes.
In other words, if someone would import `StrEnum` from the library with Python 3.11 or a higher release, the original code of `StrEnum` (directly from the python modules) is imported.
This behavior is in place because I know that **not everything can be backported**, assuming that my testings cover all the cases avoiding introducing any bug.

As a joke, I like to call this behavior as **cherry-importing**; a mix among _importing_ and _cherry-picking_.

### Cherry-importing

To select when to import something is quite straight forward using [`sys.version_info`](https://docs.python.org/3/library/sys.html#sys.version_info) and comparing it with a tuple `(3, N)`, where **N** is the desired python release.

```python
import sys

if sys.version_info < (3, 11):
    print("The release is previous than 3.11")
else:
    print("The release is 3.11 or higher.")
```

This works due to tuple comparison, which follows a strict ruleset:

- The items of each tuple are compared ony by one.
- No matter the length of both tuples, only as many items as the existing in the shortest tuple are compared.
- The comparison stops at the first `False` check or if all the checks are `True`.

These are some examples of the previous ruleset:
````pycon
>>> (3, 9, 11, 'final') < (3, 11)
True
>>> (3, 10) < (3, 11)
True
>>> (4, 'x') < (3, 11)
False
>>> ("string", 0) < (3, 11)
TypeError: '<' not supported between instances of 'str' and 'int'
````

## Backports

### Enums

The biggest difference to backport was not that `StrEnum` was integrated, but rather that many enums were invoking the member's value for calls and string representations.
This affected other enum types, like `IntEnum`, by now inheriting from `ReprEnum`, a new class which would set only the `__repr__` call to enum.

```python
class ReprEnum(enum.Enum):
    """Updates 'repr', leaving 'str' and 'format' to the builtin class.

    Backported from py3.11.
    """

    def __str__(self) -> str:
        """String through the builtin class."""
        return self.value.__str__()

    def __format__(self, format_spec: str) -> str:
        """Format through the builtin class."""
        return self.value.__format__(format_spec)
```

### Builtins

Backporting builtins is somewhat controversial in Python, as it requires to:

- Shadow an existing name variable.
- Inherit from `builtins` (like `dict`) rather than from `collections` (like `UserDict`).

But they offer another layer of abstraction into the code for using them:
When using a special class, like enumerations, they need to be imported no mater the Python release.
This is not the case for builtins, requiring to call a wrapper over these instances.

```pycon
# Assuming python 3.8, where `dict` does not support the `|` (or)  operand
>>> from py_back.builtins import dict
>>> d1 = {"key_0": 1}
>>> d1 |= {"key_1": 2}  # Dicts initialized without the constructor don't have backported functionalities
Traceback (most recent call last):
    ...
TypeError: unsupported operand type(s) for |=: 'dict' and 'dict'
>>> d1 = dict(d1)
>>> d1 |= {"key_1": 2}
>>> d1
{'key_0': 1, 'key_1': 2}
```