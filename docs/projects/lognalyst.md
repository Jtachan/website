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

Here the bases of the whole project are defined.
Reading any log file means the definition of a structure to collect the data.

Every log is usually defined by three main items:

- A **timestamp** displaying the date and time the log was recorded.
- A **log level** informing what type of message is displayed (info, debug, error, etc.).
- A **message** containing extra information for the developer.

Another first need is the communication to parse the path to the log file.
This need is not the main goal of this point, for that reason a simple parser with a single argument is set in place.

### 2. Get the statistics

With a sturdy structure, the statistics to calculate from the file is how many logs from each level are communicated.
This is a quite simple objective that allows learning how to work with **mappings**.

### 3. Apply filters over the data

The next feature is to apply filters over the data.
The filters (each one over each element of the structure) should be applied all together affecting also at the final statistics.

The filters need to be defined through the CLI call, defining now the need for a better argument parser.
Thus, even though the goal here is the logic for the filters, the first step is to learn and implement the correct use of [`clap`](https://docs.rs/clap/latest/clap/).

### 4. Concurrency I/O

At this point, the new feature is to use concurrency to read multiple files at the same time.
While it is true the tool might be simple enough for the need of concurrency, the situation is a great opportunity to implement it and learn its use.

Another important feature is how to export the results into a new type of log file.

### 5. Crates and PyPI release

At last, the project is to be released into [crates.io](https://crates.io/) and [PyPI](https://pypi.org/).
The reason is not only to have a deployment into Crates, but also to understand how Rust code can be used as a Python tool just like, for example, [`ruff`](https://github.com/astral-sh/ruff) does.

### 6. Further development

At this point, the tool is actually finished.
However, further development could also be implemented if required.
Some points for further development are:

- Multiple log file format support for I/O.
