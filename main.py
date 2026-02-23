"""Entry point for mkdocs-macros-plugin."""

import json
from datetime import datetime

NOF_ITEMS = 5
KEY_HEADER_MAPPING = {
    "name": "Name",
    "descr": "Description",
    "last_commit": "Last Commit (YYYY.MM.DD)",
}


def define_env(env):
    """Hook function to define extra environment variables."""
    with open("docs/projects_db.json", "r", encoding="utf-8") as file:
        data = json.load(file)
    env.variables["projects"] = sorted(
        data,
        key=lambda x: datetime.strptime(x["last_commit"], "%Y.%m.%d"),
        reverse=True,
    )[:NOF_ITEMS]

    @env.macro
    def load_table_row(item: dict) -> str:
        """Loading a table row in HTML format"""
        row_data = "".join(f"<td>{item[key]}</td>" for key in KEY_HEADER_MAPPING)
        return "<tr>" + row_data + "</tr>"

    @env.macro
    def get_table_headers() -> str:
        """Returning all headers of the table."""
        return "".join(f"<th>{head}</th>" for head in KEY_HEADER_MAPPING.values())
