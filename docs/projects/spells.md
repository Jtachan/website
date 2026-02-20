# DnD Spells Interactive Table

| GitHub Repo | Main Language | Status |
| --- | --- | --- |
| [DnD Spells (ES)](https://github.com/Jtachan/DnD-5.5-Spells-ES) | JS, CSS | <span style="color: blue">Maintained</span> |


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

> [Try the table](https://jtachan.github.io/DnD-5.5-Spells-ES/)

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

I knew this was something achievable with a _JavaScript_ (JS) script and basic CSS, although at this point I had never coded anything really in JS.
That was my second motivation: I could learn something new.

The only problem with the tool is that almost all data of each spell was obtained through AI:
I sent the LLM client a picture or a text of the spell and ask to extract the data in a very specific structure.
However, we all know that AI hallucinates quite a lot and that introduced errors in the data.

Even though I carefully checked as many spells as possible, I know I cannot find all the possible errors.
That is the reason why I also integrated a **'report issue' button**, which allows to anyone to write me a mail specifying the error they found. 
