"""Algorithm to automatically update the database."""

import json
from pathlib import Path
from datetime import datetime

BASE_ENTRIES = {
    "name": "",  # Project name
    "lang": [""],  # All main programing languages (most relevant first)
    "tech": [""],  # All used frameworks (most relevant first)
    "descr": "",  # Basic project description
    "repo": "",  # Link to the repository
    "post": "",  # Link to the post
    "date": "",  # Date of the project finalization in ISO format YYYY.MM.DD
}
PROJECTS_DB_PATH = Path().resolve().parent / "docs" / "projects_db.json"


def check_db_entries():
    """Checking all fields exists at each entry in the database.

    This script follows the next steps in this order:
    1. Loads the whole database as a python dictionary.
    2. Checks for each entry if it has all the default keys.
    3. Adds any missing default keys and values to any entry that requires them.
    4. Overwrites the original database.
    """
    with open(PROJECTS_DB_PATH, "r", encoding="utf-8") as db:
        entries = json.load(db)

    for entry in entries:
        for key, val in BASE_ENTRIES.items():
            if key not in entry:
                entry[key] = val

    with open(PROJECTS_DB_PATH, "w", encoding="utf-8") as db:
        json.dump(entries, db, indent=2)


def sort_db():
    """Sorting of the database based on the date (newer first)."""
    with open(PROJECTS_DB_PATH, "r", encoding="utf-8") as db:
        entries = json.load(db)

    # All entries have their date in ISO format.
    entries = sorted(
        entries,
        key=lambda x: (
            datetime.strptime(x["date"], "%Y.%m.%d") if x["date"] else datetime.min
        ),
        reverse=True,
    )

    with open(PROJECTS_DB_PATH, "w", encoding="utf-8") as db:
        json.dump(entries, db, indent=2)


if __name__ == "__main__":
    check_db_entries()
    sort_db()
