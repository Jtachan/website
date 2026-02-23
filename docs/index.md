# Welcome to my website!

Hey, I'm Jaime Gonzalez, **@Jtachan** on GitHub and other platforms.
I work as an algorithm engineer, but on my free time I develop OpenSource code to explore new challenges and keep learning.

<div align="center">
    <img alt="GitHub Stats" src="https://raw.githubusercontent.com/Jtachan/Jtachan/refs/heads/main/profile/gh_stats.svg"/>
    <img alt="Most used languages: Python, Rust, C++, Javascript, HTML" src="https://raw.githubusercontent.com/Jtachan/Jtachan/refs/heads/main/profile/top_langs.svg"/>
</div>

These are the last 5 personal projects where I have commited and pushed changes (not considering this website).

| Name |  Description | Last commit (YYYY.MM.DD) |
| :--- |  :--- | :--- |
{% for item in items[:5] -%}
| {{ item.name }} | {{ item.descr }} | {{ item.last_commit }} |
{% endfor %}

!!! Note
    See the [**index table**](proj_index.md) to visualize all my personal projects.
