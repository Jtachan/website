"""Algorithm to automatically update the database."""

import json
from pathlib import Path
from datetime import datetime
import requests

BASE_ENTRIES = {
    "name": "",  # Project name
    "lang": [""],  # All main programing languages (most relevant first)
    "tech": [""],  # All used frameworks (most relevant first)
    "descr": "",  # Basic project description
    "repo": "",  # Link to the repository
    "post": "",  # Link to the post
    "date": "",  # Start date of the project finalization in ISO format YYYY.MM.DD
    "update": "",  # ISO date of the last commit at 'main'/'master'
    "status": "",  # Either ongoing, maintained or finished
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

        repo_provided = entry["repo"] != ""
        last_update_fetched = entry["status"] == "finished" and entry["update"] != ""
        if repo_provided and not last_update_fetched:
            entry["update"] = get_repo_dates(entry["repo"])

    with open(PROJECTS_DB_PATH, "w", encoding="utf-8") as db:
        json.dump(entries, db, indent=2)


def get_repo_dates(repo_link: str) -> tuple[str, str]:
    """Provides the dates of the newest (last) commit.

    The code uses the GitHub REST API, which has a limit of 60 requests per hour.
    For that reason, the oldest (first) commit is actually not fetched (as it would require to
    fetch all commits and that would make more than 60 requests).

    Still, the code would be to fetch all commits, convert them to JSON and access
    the last element.
    """
    repo_name = repo_link.rsplit("/", maxsplit=1)[-1]
    commits_api = f"https://api.github.com/repos/Jtachan/{repo_name}/commits"

    last_response = requests.get(commits_api, params={"per_page": 1})
    raw_date = last_response.json()[0]["commit"]["committer"]["date"]

    newest_update_date = datetime.strptime(raw_date, "%Y-%m-%dT%H:%M:%SZ")
    return newest_update_date.strftime("%Y.%m.%d")


def sort_db(sort_by_update: bool = False):
    """Sorting of the database based on the date (newer first)."""
    with open(PROJECTS_DB_PATH, "r", encoding="utf-8") as db:
        entries = json.load(db)

    key = "update" if sort_by_update else "date"
    # All entries have their date in ISO format.
    entries = sorted(
        entries,
        key=lambda x: datetime.strptime(x[key], "%Y.%m.%d"),
        reverse=True,
    )

    with open(PROJECTS_DB_PATH, "w", encoding="utf-8") as db:
        json.dump(entries, db, indent=2)


if __name__ == "__main__":
    check_db_entries()
    sort_db(True)
