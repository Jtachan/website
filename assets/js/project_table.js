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

let _allProjects = null;
let _filterLang = '';
let _searchQuery = '';
let _sortKey = null;
let _sortDir = null;
const SORT_CYCLE = [null, 'desc', 'asc'];
let _currentPage = 1;
let _pageSize = 5;

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

    searchInput.value = _searchQuery;

    searchInput.addEventListener('input', () => {
        _currentPage = 1;
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
        _currentPage = 1;
        _filterLang = langSelect.value;
        _rebuildTable(container);
    });

    langLabel.appendChild(langSelect);
    bar.appendChild(langLabel);
    container.insertBefore(bar, container.firstChild);
}

function _ensurePagination(container) {
    if (container.querySelector('.pt-pagination')) return;

    const bar = document.createElement('div');
    bar.className = 'pt-pagination';
    bar.style.cssText = 'display:flex;gap:12px;align-items:center;margin-top:12px;flex-wrap:wrap;';

    // ── Page-size selector ──────────────────────────────────────────────────
    const sizeLabel = document.createElement('label');
    sizeLabel.style.cssText = 'display:flex;align-items:center;gap:6px;';
    sizeLabel.textContent = 'Show: ';

    const sizeSelect = document.createElement('select');
    sizeSelect.style.padding = '4px 8px';
    [5, 10, 15].forEach(n => {
        const opt = document.createElement('option');
        opt.value = n;
        opt.textContent = n;
        if (n === _pageSize) opt.selected = true;
        sizeSelect.appendChild(opt);
    });
    sizeSelect.addEventListener('change', () => {
        _pageSize = parseInt(sizeSelect.value, 10);
        _currentPage = 1;
        _rebuildTable(container);
    });

    sizeLabel.appendChild(sizeSelect);
    bar.appendChild(sizeLabel);

    // ── Navigation buttons ──────────────────────────────────────────────────
    const makeBtn = (label) => {
        const btn = document.createElement('button');
        btn.textContent = label;
        btn.style.cssText = 'padding:4px 8px;cursor:pointer;';
        return btn;
    };

    const btnFirst = makeBtn('<<');
    const btnPrev = makeBtn('<');
    const btnNext = makeBtn('>');
    const btnLast = makeBtn('>>');

    // Page-info span ("Page 1 of 4")
    const pageInfo = document.createElement('span');
    pageInfo.className = 'pt-page-info';

    btnFirst.addEventListener('click', () => {
        _currentPage = 1;
        _rebuildTable(container);
    });
    btnPrev.addEventListener('click', () => {
        _currentPage--;
        _rebuildTable(container);
    });
    btnNext.addEventListener('click', () => {
        _currentPage++;
        _rebuildTable(container);
    });
    btnLast.addEventListener('click', () => {
        const total = _getFilteredSorted().length;
        _currentPage = Math.max(1, Math.ceil(total / _pageSize));
        _rebuildTable(container);
    });

    bar.appendChild(btnFirst);
    bar.appendChild(btnPrev);
    bar.appendChild(pageInfo);
    bar.appendChild(btnNext);
    bar.appendChild(btnLast);

    container.appendChild(bar);
}


function _rebuildTable(container) {
    const old = container.querySelector('table');
    if (old) old.remove();

    const projects = _getFilteredSorted();
    const totalProjects = projects.length;
    const totalPages = Math.max(1, Math.ceil(totalProjects / _pageSize));
    _currentPage = Math.min(Math.max(1, _currentPage), totalPages); // clamp

    const pageStart = (_currentPage - 1) * _pageSize;
    const paginated = projects.slice(pageStart, pageStart + _pageSize);

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
                _currentPage = 1;
                if (_sortKey !== col.key) {
                    _sortKey = col.key;
                    _sortDir = 'desc';
                } else {
                    // Same column: advance the cycle
                    _sortDir = SORT_CYCLE[(SORT_CYCLE.indexOf(_sortDir) + 1) % SORT_CYCLE.length];
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

    if (paginated.length === 0) {
        const tr = document.createElement('tr');
        const td = document.createElement('td');
        td.colSpan = columnConfig.length;
        td.textContent = 'No projects match the current filters.';
        td.style.cssText = 'text-align:center;font-style:italic;';
        tr.appendChild(td);
        tbody.appendChild(tr);
    } else {
        paginated.forEach(project => {
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

    const bar = container.querySelector('.pt-pagination');
    const pageInfo = container.querySelector('.pt-page-info');
    if (bar && pageInfo) {
        pageInfo.textContent = `Page ${_currentPage} of ${totalPages}`;

        const buttons = bar.querySelectorAll('button');
        const [btnFirst, btnPrev, btnNext, btnLast] = buttons;
        btnFirst.disabled = _currentPage <= 1;
        btnPrev.disabled = _currentPage <= 1;
        btnNext.disabled = _currentPage >= totalPages;
        btnLast.disabled = _currentPage >= totalPages;
    }
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

    _ensureControls(container);
    _ensurePagination(container);
    _rebuildTable(container);
}

document$.subscribe(function () {
    loadTable();
});