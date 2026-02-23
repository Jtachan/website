"""Entry point for mkdocs-macros-plugin."""

import json

NOF_ITEMS = 5


def define_env(env):
    """Hook function to define extra environment variables."""

    # Loading the first N items from the projects database
    with open("docs/projects_db.json", "r", encoding="utf-8") as file:
        data = json.load(file)

    env.variables["items"] = data[:NOF_ITEMS]
