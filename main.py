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
STATUS_COLOR_MAP = {"maintained": "deepskyblue", "finished": "green", "ongoing": "red"}


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
        for project in data:
            if project["name"] == pr_name:
                data_name = f"<a href={project['repo']}>{project['name']}</a>"
                data_lang = f"<img src='{get_lang_icon_path(project['lang'][0])}' class='icon'>"
                data_status = (
                    f"<span style='color: {STATUS_COLOR_MAP[project['status']]}'>{project['status'].title()}</span>"
                )
                return "".join(f"<td>{d}</td>" for d in (data_name, data_lang, data_status))
        return ""

    @env.macro
    def get_table_headers(mode: str) -> str:
        """Returning all headers of the table."""
        headers_map = {"simple": SIMPLIFIED_HEADER_KEYS, "project": PROJECT_TABLE_HEADER_KEYS}
        return "".join(f"<th>{KEY_HEADER_MAPPING[head]}</th>" for head in headers_map[mode])


def get_lang_icon_path(lang: str) -> str:
    return f"https://raw.githubusercontent.com/Jtachan/assets/refs/heads/main/code-icons/{lang.lower()}.svg"

