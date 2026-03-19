# lognalyst: A log file analyzer

<div style="display: flex; justify-content: center">
<table>
    <tr>{{ get_table_headers("project") }}</tr>
    <tr>{{ load_project_table_data("lognalyst") }}</tr>
</table>
</div>

`lognalyst` is a project mostly for learning purposes.
Its name comes from 'log' (as the file) and 'analyst'.

## Motivation

The idea of a log file analyzer was the most complete idea that I came up for improving my Rust skills, as it contains the following fields:

- Definition of a crate with multiple modules (for code organisation).
- Handling enums, datetimes, life times, and traits.
- Definition of CLI parser.
- Data filtering through string matches, regex, types and timestamps.
- Multithreading for reading multiple files at the same time.
- Exporting results into new files.
- Testing different modules.

## Project road

The plan to develop the tool was to create small pull requests, each one with a milestone and presenting a working state of the software.

### 1. Read the LOG file data

### 2. Get the statistics

### 3. Apply filters over the data

### 4. Multithread I/O

At this point, the new feature is to use multi-threading to read multiple files at the same time.

`REPORT IN PROGRESS`

### 5. Crates and PyPI release

At last, the project is to be released into [crates.io](https://crates.io/) and [PyPI](https://pypi.org/).
The reason is not only to have a deployment into Crates, but also to understand how Rust code can be used as a Python tool just like, for example, [`ruff`](https://github.com/astral-sh/ruff) does.
