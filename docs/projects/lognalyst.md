# lognalyst: A log file analyzer

<div style="display: flex; justify-content: center">
<table>
    <tr>{{ get_table_headers("project") }}</tr>
    <tr>{{ load_project_table_data("lognalyst") }}</tr>
</table>
</div>

`lognalyst` is a project mostly for **learning purposes** as a first-contact with Rust.
Its name comes from 'log' (as the file) and 'analyst'.

## Motivation

The idea of a log file analyzer was the most complete idea that I came up for improving my Rust skills, as it contains the following fields:

- Definition of a crate with multiple modules (for code organisation).
- Handling enums, datetimes, life times, and traits.
- Definition of CLI parser.
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
