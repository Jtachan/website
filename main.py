"""Entry point for mkdocs-macros-plugin."""

import json
from datetime import datetime

NOF_ITEMS = 5
KEY_HEADER_MAPPING = {
    "name": "Name",
    "lang": "Main Language",
    "descr": "Description",
    "repo": "GitHub Repo",
    "last_commit": "Last Commit (ISO)",
    "status": "Status"
}
SIMPLIFIED_HEADER_KEYS = ("name", "descr", "last_commit")
PROJECT_TABLE_HEADER_KEYS = ("repo", "lang", "status")


def define_env(env):
    """Hook function to define extra environment variables."""
    with open("docs/projects_db.json", "r", encoding="utf-8") as file:
        data = json.load(file)
    env.variables["projects"] = sorted(
        data,
        key=lambda x: datetime.strptime(x["last_commit"], "%Y.%m.%d"),
        reverse=True,
    )

    @env.macro
    def load_simple_table_row(item: dict) -> str:
        """Loading a table row in HTML format"""
        return "".join(f"<td>{item[key]}</td>" for key in SIMPLIFIED_HEADER_KEYS)

    @env.macro
    def load_project_table_data(pr_name: str) -> str:
        return ""

    @env.macro
    def get_table_headers(mode: str) -> str:
        """Returning all headers of the table."""
        headers = SIMPLIFIED_HEADER_KEYS if mode == "simple" else PROJECT_TABLE_HEADER_KEYS
        return "".join(f"<th>{KEY_HEADER_MAPPING[head]}</th>" for head in headers)

