# PyBackport: Backporting from newer Python releases

| GitHub Repo                                         | Main Language |
|-----------------------------------------------------|---------------|
| [PyBackport](https://github.com/Jtachan/PyBackport) | Python        | 

!!! Todo
    Add GIF displaying that the pkg works

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

The biggest difference to backport was not that `StrEnum` was integrated, but rather that many enums were invoking the member's value for calls and string representations

### Built-ins