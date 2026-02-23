const columnConfig = [
    {key: 'name', header: 'Name'},
    {key: 'lang', header: 'Languages'},
    {key: 'tech', header: 'Frameworks'},
    {key: 'descr', header: 'Description'},
]

function getLangIcon(lang) {
    if (lang.constructor.name === "Array") {
        let langIconsArray = [];
        lang.slice(0, 3).forEach(langName => {
            langIconsArray.push(getLangIcon(langName));
        })
        if (lang.length >= 4) {
            langIconsArray.push(document.createTextNode('...'));
        }
        return langIconsArray;
    }

    // Only strings come to this point forward.
    if (lang === "") {
        return document.createTextNode("");
    }

    const iconPath = `../assets/code-icons/${lang.toLowerCase()}.svg`;

    const img = document.createElement('img');
    img.src = iconPath;
    img.alt = lang;
    img.title = lang;
    img.className = "icon";

    // If image fails to load → fallback to text
    img.onerror = () => {
        img.replaceWith(document.createTextNode(lang));
    };

    return img;
}

function loadTable() {
    const container = document.getElementById('project-table');
    if (!container) return;

    container.innerHTML = '';
    fetch('../projects_db.json')
        .then(response => response.json())
        .then(data => {
            // Create empty table: Headers + rows
            const table = document.createElement('table');
            const thead = document.createElement('thead');
            const headerRow = document.createElement('tr');

            columnConfig.forEach(col => {
                const th = document.createElement('th')
                th.textContent = col.header;
                headerRow.appendChild(th);
            });

            thead.appendChild(headerRow);
            table.appendChild(thead);

            // Create the body of the table:
            const tbody = document.createElement('tbody');
            data.forEach(projectData => {
                const row = document.createElement('tr');
                columnConfig.forEach(col => {
                    const cell = document.createElement('td');
                    cell.style.verticalAlign = 'middle';
                    if (col.key === 'lang' || col.key === 'tech') {
                        const langContent = getLangIcon(projectData[col.key]);
                        langContent.forEach(langNode => {
                            cell.appendChild(langNode);
                        });
                    } else {
                        cell.textContent = projectData[col.key];
                    }
                    row.appendChild(cell);
                })

                tbody.appendChild(row);
            });

            table.appendChild(tbody);
            container.appendChild(table);
        })
        .catch(error => {
            console.error('Error loading projects:', error);
            container.textContent = error;
        });
}

document$.subscribe(function () {
    loadTable();
});