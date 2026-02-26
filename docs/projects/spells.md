# DnD Spells Interactive Table

<table>
    <tr><th>GitHub Repo</th><th>Main Language</th><th>Status</th></tr>
    <tr>
        <td><a href="https://github.com/Jtachan/DnD-5.5-Spells-ES">DnD Spells (ES)</a></td>
        <td align="center">
            <img src="https://raw.githubusercontent.com/Jtachan/assets/refs/heads/main/code-icons/javascript.svg" alt="JS" title="JavaScript" width="30">
        </td>
        <td><span style="color: cyan">Maintained</span></td>
    </tr>
</table>

This project wasn't my first project where I needed to create an HTML with simple CSS, 
but it was my first project where I chose to code in JavaScript.

My plan was to create a JSON database to be displayed at an HTML.
For that purpose, I took the strategy to ask AI to teach me one by one all the requirements I was looking for.
With that purpose, I created a table that allows:

- Selecting a specific version among two databases.
- Apply filters over the displayed data.
- Allow searching by name in real time.
- Selection of the units either in imperial or in the metric system.
- Present a simple UI, allowing to click over an item to display a new window with all expanded information.
- Not collect any information whatsoever from whomever uses it.

![Animation displaying the table, searching in real time and opening a spell](../assets/pr-gif/spells.gif)

!!! hint
    [Try the table](https://jtachan.github.io/DnD-5.5-Spells-ES/)

!!! note
    At the page, all attributions of every spell released at the SRD (_System Reference Document_) are given to _Wizards of the Coast_ under the terms of CC-BY-4.0.
    Any spell not released at the SRD was modified to not break the copyright license.

## Motivation

We all have our hobbies. One of mine is to play DnD (_Dungeons and Dragons_).
However, I was not able to find a free and fast tool that would allow players to quickly search DnD spells in real time.
There are many software tools, but they are either not fast, not free, loaded with adds or not in Spanish (my mother tongue).

Thus, I set my mind to create something:

- 100% free without collecting data
- Quick and clear to use
- Available from everywhere

## Project road

### Defining database

The structure of the database was one of the main pillars for the project.
Creating a bad structure would resolve into expending a lot of time and effort at late stages of the project.

For that reason, I focused on finding all the general and important fields that people usually look at when reading a spell:

- **Basic fields**: Spell name, classes that can learn it, school of magic, components and spell level.
- **Numeric fields**: Reach when casting the spell, how long it remains, how long it takes to cast.
- **Useful 'flag' fields**: Can it be cast as a ritual? Does it require concentration?
- **Hidden information** (at the description): If the target needs to be visible, if the spell needs an attack throw.

Those named fields are general for all spells, no matter its effects.
Some other spells could use of extra information like '_damage_', but I decided to leave all this non-general information as the description of the spell.

### Extracting data from the original text

### Imperial and metric systems

### User support

### Logic for the table
