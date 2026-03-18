const columnConfig = [
    {key: 'name', header: 'Name', sortable: true},
    {key: 'lang', header: 'Languages', sortable: false},
    {key: 'tech', header: 'Frameworks', sortable: false},
    {key: 'created', header: 'Creation date', sortable: true},
    {key: 'last_commit', header: 'Last update', sortable: true},
    {key: 'descr', header: 'Description', sortable: false},
];

function getLangIcon(lang) {
    if (lang.constructor.name === 'Array') {
        const langIconsArray = [];
        lang.slice(0, 3).forEach(langName => {
            langIconsArray.push(getLangIcon(langName));
        });
        if (lang.length >= 4) {
            const ellipsis = document.createTextNode('…');
            langIconsArray.push(ellipsis);
        }
        return langIconsArray;
    }
    if (lang === '') {
        return document.createTextNode('');
    }

    const iconPath =
        `https://raw.githubusercontent.com/Jtachan/assets/refs/heads/main/code-icons/${lang.toLowerCase()}.svg`;

    const img = document.createElement('img');
    img.src = iconPath;
    img.alt = lang;
    img.title = lang;
    img.className = 'icon';
    img.onerror = () => {
        img.replaceWith(document.createTextNode(lang));
    };

    return img;
}

let _allProjects = null; // cached dataset — loaded only once
let _filterLang = '';   // active language filter value
let _searchQuery = '';   // active search string
let _sortKey = null; // column key currently sorted, or null
let _sortDir = null; // 'asc' | 'desc' | null
const SORT_CYCLE = [null, 'asc', 'desc'];

async function _loadData() {
    if (_allProjects !== null) return; // already in memory
    const response = await fetch('../projects_db.json');
    if (!response.ok) throw new Error(`Could not load projects_db.json (HTTP ${response.status})`);
    _allProjects = await response.json();
}

function _getFilteredSorted() {
    const q = _searchQuery.toLowerCase();

    return _allProjects
        .filter(p => {
            // Language filter
            if (_filterLang) {
                if (!Array.isArray(p.lang) || !p.lang.includes(_filterLang)) return false;
            }
            // Search filter (name or description, case-insensitive)
            if (q) {
                const inName = (p.name || '').toLowerCase().includes(q);
                const inDescr = (p.descr || '').toLowerCase().includes(q);
                if (!inName && !inDescr) return false;
            }
            return true;
        })
        .sort((a, b) => {
            if (!_sortKey || !_sortDir) return 0;

            let valA, valB;

            if (_sortKey === 'created' || _sortKey === 'last_commit') {
                // Convert "YYYY.MM.DD" → comparable integer; missing dates sort last
                const toInt = s => {
                    if (!s) return -Infinity;
                    const n = parseInt(s.replace(/\./g, ''), 10);
                    return isNaN(n) ? -Infinity : n;
                };
                valA = toInt(a[_sortKey]);
                valB = toInt(b[_sortKey]);
            } else {
                // Alphabetical (name)
                valA = (a[_sortKey] || '').toLowerCase();
                valB = (b[_sortKey] || '').toLowerCase();
            }

            if (valA < valB) return _sortDir === 'asc' ? -1 : 1;
            if (valA > valB) return _sortDir === 'asc' ? 1 : -1;
            return 0;
        });
}

function _ensureControls(container) {
    if (container.querySelector('.pt-controls')) return;

    const bar = document.createElement('div');
    bar.className = 'pt-controls';
    bar.style.cssText = 'display:flex;gap:16px;flex-wrap:wrap;align-items:center;margin-bottom:12px;';

    const searchLabel = document.createElement('label');
    searchLabel.style.cssText = 'display:flex;align-items:center;gap:6px;';
    searchLabel.textContent = 'Search: ';

    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Name or description…';
    searchInput.style.padding = '4px 8px';

    // Restore previous search value when the user navigates back
    searchInput.value = _searchQuery;

    searchInput.addEventListener('input', () => {
        _searchQuery = searchInput.value.trim();
        _rebuildTable(container);
    });

    searchLabel.appendChild(searchInput);
    bar.appendChild(searchLabel);

    const langLabel = document.createElement('label');
    langLabel.style.cssText = 'display:flex;align-items:center;gap:6px;';
    langLabel.textContent = 'Language filter: ';

    const langSelect = document.createElement('select');
    langSelect.style.padding = '4px 8px';

    const blankOpt = document.createElement('option');
    blankOpt.value = '';
    blankOpt.textContent = '';
    langSelect.appendChild(blankOpt);

    const langs = new Set();
    _allProjects.forEach(p => {
        if (Array.isArray(p.lang)) p.lang.forEach(l => {
            if (l) langs.add(l);
        });
    });
    Array.from(langs).sort().forEach(lang => {
        const opt = document.createElement('option');
        opt.value = lang;
        opt.textContent = lang;
        langSelect.appendChild(opt);
    });

    langSelect.value = _filterLang;
    langSelect.addEventListener('change', () => {
        _filterLang = langSelect.value;
        _rebuildTable(container);
    });

    langLabel.appendChild(langSelect);
    bar.appendChild(langLabel);
    container.insertBefore(bar, container.firstChild);
}

function _rebuildTable(container) {
    const old = container.querySelector('table');
    if (old) old.remove();

    const projects = _getFilteredSorted();

    const table = document.createElement('table');

    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');

    columnConfig.forEach(col => {
        const th = document.createElement('th');

        let indicator = '';
        if (col.sortable && _sortKey === col.key) {
            indicator = _sortDir === 'asc' ? ' ▲' : ' ▼';
        }
        th.textContent = col.header + indicator;

        if (col.sortable) {
            th.style.cursor = 'pointer';
            th.title = 'Click to sort';
            th.addEventListener('click', () => {
                if (_sortKey !== col.key) {
                    // New column: start at ascending
                    _sortKey = col.key;
                    _sortDir = 'asc';
                } else {
                    // Same column: advance the cycle
                    const next = SORT_CYCLE[(SORT_CYCLE.indexOf(_sortDir) + 1) % SORT_CYCLE.length];
                    _sortDir = next;
                    if (!_sortDir) _sortKey = null;
                }
                _rebuildTable(container);
            });
        }

        headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');

    if (projects.length === 0) {
        const tr = document.createElement('tr');
        const td = document.createElement('td');
        td.colSpan = columnConfig.length;
        td.textContent = 'No projects match the current filters.';
        td.style.cssText = 'text-align:center;font-style:italic;';
        tr.appendChild(td);
        tbody.appendChild(tr);
    } else {
        projects.forEach(project => {
            const row = document.createElement('tr');

            // Clicking a row navigates to its md-file-name
            if (project['md-file-name']) {
                row.style.cursor = 'pointer';
                row.addEventListener('click', () => {
                    window.location.href = project['md-file-name'];
                });
            }

            columnConfig.forEach(col => {
                const cell = document.createElement('td');
                cell.style.verticalAlign = 'middle';

                if (col.key === 'lang' || col.key === 'tech') {
                    // getLangIcon() with the full array returns an array of nodes
                    const nodes = getLangIcon(project[col.key] || []);
                    nodes.forEach(node => cell.appendChild(node));
                } else {
                    cell.textContent = project[col.key] ?? '';
                }

                row.appendChild(cell);
            });

            tbody.appendChild(row);
        });
    }

    table.appendChild(tbody);
    container.appendChild(table);
}

async function loadTable() {
    const container = document.getElementById('project-table');
    if (!container) return;

    try {
        await _loadData(); // no-op if data is already cached
    } catch (err) {
        console.error('Error loading projects:', err);
        container.textContent = `Error loading project data: ${err.message}`;
        return;
    }

    _ensureControls(container); // idempotent — only built on first visit
    _rebuildTable(container);   // always rebuild the table (filters/sort may differ)
}

document$.subscribe(function () {
    loadTable();
});