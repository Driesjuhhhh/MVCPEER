const tableDiv = document.getElementById("table");
const select = document.getElementById("ploegenSelect");
const button = document.getElementById("button");
const rankingButton = document.getElementById("rankingButton");
const resultsHeading = document.getElementById("resultsHeading");
let activeView = 'matches';
let demoMode = false;
const demoButton = document.getElementById('demoButton');
const demoNotice = document.getElementById('demoNotice');

function refreshView() {
    return activeView === 'ranking' ? getStandingsFunction() : getMatchesFunction();
}

demoButton?.addEventListener('click', () => {
    demoMode = !demoMode;
    demoButton.setAttribute('aria-pressed', String(demoMode));
    demoButton.textContent = demoMode ? 'Terug naar echte data ↗' : 'Bekijk demo ↗';
    demoNotice.hidden = !demoMode;
    return refreshView();
});

function setView(view, ploeg) {
    activeView = view;
    resultsHeading.textContent = `${view === 'ranking' ? 'Ranking' : 'Wedstrijden'} – ${ploeg.naam}`;
    for (const [control, selected] of [[button, view === 'matches'], [rankingButton, view === 'ranking']]) {
        control.setAttribute('aria-pressed', String(selected));
    }
}

// Seizoen 2026–2027, gecontroleerd op https://www.volleyscores.be/direct/L-0923.
// Een reeks kan meerdere clubploegen bevatten: bekerploegen hebben een eigen teamId.
const ploegen = [
    { naam: 'Promo 1', id: 'LDP1' },
    { naam: 'Promo 3', id: 'LDP3-C' },
    { naam: 'U19', id: 'LMU19N2R1' },
    { naam: 'U17A', id: 'LMU17N1R1-D' },
    { naam: 'U17C', id: 'LMU17N2R1-B' },
    { naam: 'U17B', id: 'LMU17N2R1-C' },
    { naam: 'U15', id: 'LMU15N2R1-B' },
    { naam: 'U13A', id: 'LMU13N2R1-A' },
    { naam: 'U13C', id: 'LMU13N2R1-D' },
    { naam: 'U13B', id: 'LMU13N2R1-C' },
    { naam: 'U11 3-3', id: 'LMU113-3N1R1-A' },
    { naam: 'U11 2-2', id: 'LU112-2N2R1-C' },
    { naam: 'Promo 1 Beker', id: 'BVLPD-F', teamId: '108676' },
    { naam: 'Promo 3 Beker', id: 'BVLPD-F', teamId: '108677' }
];

function ploegKey(ploeg) {
    return ploeg.teamId ? `${ploeg.id}:${ploeg.teamId}` : ploeg.id;
}

function isSelectedTeam(match, side, ploeg) {
    return ploeg.teamId
        ? String(match[`match_${side}_team_id`]) === ploeg.teamId
        : match[`stnr_${side}`] === clubNumber;
}

function filterMatches(matches, ploeg) {
    return matches.filter(match => match.Reeks === ploeg.id &&
        (isSelectedTeam(match, 'home', ploeg) || isSelectedTeam(match, 'visitors', ploeg)));
}

button.addEventListener("click", getMatchesFunction);
rankingButton.addEventListener("click", getStandingsFunction);
select.addEventListener("change", refreshView);

document.addEventListener("DOMContentLoaded", function() {
    select.innerHTML = ploegen.map(ploeg =>
        `<option value="${ploegKey(ploeg)}">${ploeg.naam}</option>`).join("\n");
    select.selectedIndex = 0;
    getMatchesFunction();
});

// Set the credentials
const clubNumber = "L-0923";
const provinceId = 4;


class VolleyAdmin2 {
    static API_URL = "https://www.volleyadmin2.be/services";

    // Possible methods
    static API_METHOD_STANDINGS = "rangschikking";
    static API_METHOD_MATCHES = "wedstrijden";
    static API_METHOD_TEAMS = "series";

    // Possible variables
    static CLUB_NUMBER = "stamnummer";
    static PROVINCE_ID = "province_id";
    static SERIES_ID = "reeks";

    /**
     * Do call
     *
     * @param {string} method
     * @param {object} parameters
     * @returns {Promise<object>}
     * @throws {Error}
     */
    async doCall(method, parameters = {}) {
        // Check if fetch is available
        if (typeof fetch !== "function") {
            throw new Error(
                "This method requires the fetch API, which is not available in this environment."
            );
        }

        parameters.format = "json";

        const queryParams = Object.entries(parameters)
            .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
            .join("&");

        // Define endPoint
        const endPoint = `${VolleyAdmin2.API_URL}/${method}_xml.php?${queryParams}`;

        try {
            // Fetch data
            const response = await fetch(endPoint, {
                method: "GET",
                timeout: 10000,
            });

            // Handle response errors
            if (!response.ok) {
                throw new Error(
                    `Request failed with status: ${response.status}`
                );
            }

            // Parse response as JSON
            const responseData = await response.json();
            return responseData;
        } catch (error) {
            throw new Error(
                `An error occurred while fetching data: ${error.message}`
            );
        }
    }

    /**
     * Check parameters
     *
     * @param {object} parameters
     * @returns {object}
     * @throws {Error}
     */
    checkParameters(parameters) {
        const result = {};

        // We loop all parameters to find their real key (= dutch key which the API uses)
        for (const [key, value] of Object.entries(parameters)) {
            if (value === null) {
                continue;
            }

            if (
                ![
                    VolleyAdmin2.CLUB_NUMBER,
                    VolleyAdmin2.PROVINCE_ID,
                    VolleyAdmin2.SERIES_ID,
                ].includes(key)
            ) {
                throw new Error(`The key "${key}" is invalid.`);
            }

            result[key] = value;
        }

        return result;
    }

    /**
     * Get matches
     *
     * @param {string} seriesId
     * @param {number} provinceId
     * @param {string} clubNumber
     * @returns {Promise<object>}
     * @throws {Error}
     */
    async getMatches(seriesId = null, provinceId = null, clubNumber = null) {
        return this.doCall(
            VolleyAdmin2.API_METHOD_MATCHES,
            this.checkParameters({
                [VolleyAdmin2.SERIES_ID]: seriesId,
                [VolleyAdmin2.PROVINCE_ID]: provinceId,
                [VolleyAdmin2.CLUB_NUMBER]: clubNumber,
            })
        );
    }

    /**
     * Get series
     *
     * @param {number} provinceId - Fill in if you want to filter for province.
     * @returns {Promise<object>}
     * @throws {Error}
     */
    async getSeries(provinceId = null) {
        return this.doCall(
            VolleyAdmin2.API_METHOD_TEAMS,
            this.checkParameters({
                [VolleyAdmin2.PROVINCE_ID]: provinceId,
            })
        );
    }

    /**
     * Get standings
     *
     * @param {string} seriesId
     * @param {number} provinceId
     * @returns {Promise<object>}
     * @throws {Error}
     */
    async getStandings(seriesId = null, provinceId = null) {
        return this.doCall(
            VolleyAdmin2.API_METHOD_STANDINGS,
            this.checkParameters({
                [VolleyAdmin2.SERIES_ID]: seriesId,
                [VolleyAdmin2.PROVINCE_ID]: provinceId,
            })
        );
    }
}

// Instantiate the VolleyAdmin2 class
const volleyAdmin = new VolleyAdmin2();

// Example: Get matches
let latestRequest = 0;

function getMatchesFunction() {
    const ploeg = ploegen.find(item => ploegKey(item) === select.value);
    if (!ploeg) return;
    const request = ++latestRequest;
    setView('matches', ploeg);
    tableDiv.textContent = "Wedstrijden laden…";
    return (demoMode ? Promise.resolve(createDemoData(ploeg).matches) :
        volleyAdmin.getMatches(ploeg.id, provinceId, clubNumber))
        .then((response) => {
            if (request !== latestRequest) return;
            if (!Array.isArray(response)) throw new Error("Ongeldig antwoord van VolleyAdmin2");
            const matches = filterMatches(response, ploeg);
            if (matches.length === 0) {
                tableDiv.textContent = "Geen wedstrijden gevonden voor deze ploeg.";
                return;
            }
            renderMatches(matches, ploeg);
        })
        .catch((error) => {
            if (request !== latestRequest) return;
            tableDiv.textContent = "Wedstrijden konden niet worden geladen. Probeer opnieuw.";
            console.error("Error:", error.message);
        });
}

// Example: Get series
function getSeriesFunction() {
    volleyAdmin
        .getSeries(provinceId)
        .then((series) => {
            // console.log('Series:', series);
        })
        .catch((error) => {
            // table.innerHTML = `<p>Error<p>`;
            // console.error('Error:', error.message);
        });
}

function renderStandings(standings) {
    const table = document.createElement('table');
    table.className = 'ranking-table';
    const head = table.createTHead();
    const header = head.insertRow();
    header.className = 'ranking-header';
    const columns = [
        ['Positie', 'Volgorde'], ['Ploeg', 'Ploegnaam'], ['Gespeeld', 'AantalWedstrijden'],
        ['Gewonnen', 'AantalWedstrijdenGewonnen'], ['Verloren', 'AantalWedstrijdenVerloren'],
        ['Sets voor', 'AantalSetsGewonnen'], ['Sets tegen', 'AantalSetsVerloren'], ['Punten', 'AantalPunten']
    ];
    for (const [label] of columns) {
        const cell = document.createElement('th');
        cell.scope = 'col';
        cell.className = 'ranking-label';
        cell.textContent = label;
        header.appendChild(cell);
    }
    const body = table.createTBody();
    // Behoud de officiële volgorde en nummer de rijen eenvoudig vanaf 1.
    for (const [index, standing] of standings.entries()) {
        const row = body.insertRow();
        const isPeer = /^MVC Peer(?:\s|$)/i.test(standing.Ploegnaam || '');
        row.className = isPeer
            ? 'peer-row font-bold'
            : 'ranking-row';
        for (const [, field] of columns) {
            const cell = row.insertCell();
            cell.className = field === 'Ploegnaam' ? 'ranking-team' : 'ranking-number';
            cell.textContent = field === 'Volgorde' ? String(index + 1) : standing[field] ?? '–';
        }
    }
    tableDiv.textContent = '';
    const scroll = document.createElement('div');
    scroll.className = 'ranking-scroll';
    scroll.appendChild(table);
    tableDiv.appendChild(scroll);
}

function getStandingsFunction() {
    const ploeg = ploegen.find(item => ploegKey(item) === select.value);
    if (!ploeg) return;
    const request = ++latestRequest;
    setView('ranking', ploeg);
    tableDiv.textContent = 'Ranking laden…';
    // Geen club- of ploegfilter: toon de volledige poule, ook voor beide bekerploegen.
    return (demoMode ? Promise.resolve(createDemoData(ploeg).standings) : volleyAdmin.getStandings(ploeg.id, provinceId))
        .then(response => {
            if (request !== latestRequest) return;
            if (!Array.isArray(response)) throw new Error('Ongeldig antwoord van VolleyAdmin2');
            const standings = response.filter(row => row.Reeks === ploeg.id && row.Wedstrijd === 'Hoofd');
            if (!standings.length) {
                tableDiv.textContent = 'Nog geen ranking beschikbaar voor deze poule.';
                return;
            }
            renderStandings(standings);
        })
        .catch(error => {
            if (request !== latestRequest) return;
            tableDiv.textContent = 'Ranking kon niet worden geladen. Probeer opnieuw.';
            console.error('Error:', error.message);
        });
}

function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, char => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[char]);
}

function matchDate(match) {
    const [day, month, year] = (match.t || '').split('/').map(Number);
    const [hour, minute] = (match.Aanvangsuur || '23:59').split(':').map(Number);
    return new Date(year, month - 1, day, hour, minute);
}

function hasMatchResult(match) {
    return Boolean(match.UitslagHoofd && match.UitslagHoofd !== 'undefined');
}

function nextScheduledMatch(matches, now = new Date()) {
    return matches.filter(match => !hasMatchResult(match) && String(match.postponed) !== '1' && matchDate(match) >= now)
        .sort((a, b) => matchDate(a) - matchDate(b))[0];
}

function renderMatches(matches, ploeg, now = new Date()) {
    const calendar = [...matches].sort((a, b) =>
        (Number.isNaN(matchDate(a).getTime()) ? Infinity : matchDate(a).getTime()) -
        (Number.isNaN(matchDate(b).getTime()) ? Infinity : matchDate(b).getTime()));
    const nextMatch = nextScheduledMatch(calendar, now);
    const results = calendar.filter(hasMatchResult);
    let wins = 0;
    for (const match of results) {
        const score = match.UitslagHoofd.split('-').map(Number);
        if (score.length === 2 && (isSelectedTeam(match, 'home', ploeg) ? score[0] > score[1] : score[1] > score[0])) wins++;
    }
    tableDiv.textContent = '';
    const featured = document.createElement('section');
    featured.className = 'next-match-section';
    const nextHeading = document.createElement('h3');
    nextHeading.className = 'fixture-heading';
    nextHeading.textContent = 'Eerstvolgende wedstrijd';
    featured.appendChild(nextHeading);
    if (nextMatch) {
        featured.appendChild(createMatchCard(nextMatch, ploeg, true));
    } else {
        const empty = document.createElement('p');
        empty.className = 'next-match-empty';
        empty.textContent = 'Er staat momenteel geen volgende wedstrijd gepland.';
        featured.appendChild(empty);
    }
    tableDiv.appendChild(featured);

    const summary = document.createElement('div');
    summary.className = 'match-summary';
    summary.innerHTML = `
        <div><span class="summary-number">${results.length}</span><span>Gespeeld</span></div>
        <div><span class="summary-number">${wins}</span><span>Gewonnen</span></div>
        <div><span class="summary-number">${calendar.length}</span><span>Totaal wedstrijden</span></div>`;
    tableDiv.appendChild(summary);

    const section = document.createElement('section');
    section.className = 'fixture-section';
    const heading = document.createElement('h3');
    heading.className = 'fixture-heading';
    heading.textContent = `Volledige kalender / ${String(calendar.length).padStart(2, '0')}`;
    section.appendChild(heading);
    for (const match of calendar) {
        section.appendChild(createMatchCard(match, ploeg, match === nextMatch));
    }
    tableDiv.appendChild(section);
}

function createMatchCard(match, ploeg, isNext = false) {
    const finished = hasMatchResult(match);
    const card = document.createElement('article');
    card.className = `fixture-card ${isNext ? 'next-fixture' : ''}`;
    const date = matchDate(match);
    const validDate = !Number.isNaN(date.getTime());
    const day = validDate ? String(date.getDate()).padStart(2, '0') : '–';
    const month = validDate ? date.toLocaleDateString('nl-BE', { month: 'short' }) : '';
    const score = finished ? match.UitslagHoofd.split('-').map(value => value.trim()) : [];
    const status = String(match.postponed) === '1' ? 'Uitgesteld' : finished ? 'Afgelopen' : isNext ? 'Eerstvolgende' : 'Gepland';
    const home = isSelectedTeam(match, 'home', ploeg);
    card.innerHTML = `<div class="fixture-topline"><span>${status}</span><span>${home ? 'THUIS' : 'UIT'} · ${escapeHtml(match.Aanvangsuur?.slice(0, 5) || '–')}</span></div>
        <div class="fixture-body"><div class="fixture-date"><strong>${day}</strong><span>${escapeHtml(month)}</span><small>${validDate ? date.getFullYear() : ''}</small></div>
        <div class="fixture-teams"><div class="${home ? 'our-team' : ''}">${escapeHtml(match.Thuis)}<span>${escapeHtml(score[0] || '–')}</span></div>
        <div class="${isSelectedTeam(match, 'visitors', ploeg) ? 'our-team' : ''}">${escapeHtml(match.Bezoekers)}<span>${escapeHtml(score[1] || '–')}</span></div></div></div>
        <div class="fixture-venue">↗ ${escapeHtml(match.SporthalNaam || 'Locatie nog niet bekend')}</div>`;
    const sets = [1, 2, 3, 4, 5].map(n => ({ n, score: match[`UitslagHoofd_set${n}`] }))
        .filter(set => set.score && set.score !== 'undefined');
    if (sets.length) {
        const details = document.createElement('details');
        details.className = 'fixture-details';
        details.innerHTML = `<summary>Setstanden <span aria-hidden="true">＋</span></summary><div class="set-list">${sets.map(set =>
            `<div><span>SET ${set.n}</span><strong>${escapeHtml(set.score)}</strong></div>`).join('')}</div>`;
        card.appendChild(details);
    }
    return card;
}
// Uitsluitend lokale voorbeeldgegevens: nooit vermengd met de officiële antwoorden.
function createDemoData(ploeg) {
    const peerName = ploeg.teamId === '108676' ? 'MVC Peer A (P1)' : ploeg.teamId === '108677' ? 'MVC Peer B (P3)' : `MVC Peer · ${ploeg.naam}`;
    const teams = [peerName, 'Volley Noord', 'VC Bosrand', 'Sporting Heuvel'];
    const standings = teams.map((Ploegnaam, i) => ({
        Reeks: ploeg.id, Wedstrijd: 'Hoofd', Ploegnaam, RangschikkingID: i === 0 ? ploeg.teamId || 'demo-peer' : `demo-${i}`,
        AantalWedstrijden: 0, AantalWedstrijdenGewonnen: 0, AantalWedstrijdenVerloren: 0,
        AantalSetsGewonnen: 0, AantalSetsVerloren: 0, AantalPunten: 0
    }));
    const matches = [];
    const fixtures = [[0, 1, 3, 1], [2, 0, 2, 3], [0, 3, 1, 3], [1, 2, 3, 0], [3, 1, 3, 2], [2, 3, 0, 3], [0, 2], [1, 0], [3, 0]];
    fixtures.forEach(([home, away, h, a], index) => {
        const date = new Date();
        date.setDate(date.getDate() + (h === undefined ? (index - 5) * 7 : -(6 - index) * 7));
        const match = {
            Reeks: ploeg.id, Thuis: teams[home], Bezoekers: teams[away],
            match_home_team_id: standings[home].RangschikkingID, match_visitors_team_id: standings[away].RangschikkingID,
            stnr_home: home === 0 ? clubNumber : 'DEMO', stnr_visitors: away === 0 ? clubNumber : 'DEMO',
            t: `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`,
            Aanvangsuur: '20:00:00', SporthalNaam: home === 0 ? 'Peer, Sporthal de Deuster' : 'Sporthal Horizon (demo)',
            UitslagHoofd: h === undefined ? '' : `${h} - ${a}`
        };
        if (h !== undefined) {
            const winningSide = h > a ? home : away;
            for (const [team, won, lost] of [[home, h, a], [away, a, h]]) {
                const row = standings[team];
                row.AantalWedstrijden++;
                row.AantalSetsGewonnen += won;
                row.AantalSetsVerloren += lost;
                row[team === winningSide ? 'AantalWedstrijdenGewonnen' : 'AantalWedstrijdenVerloren']++;
                row.AantalPunten += won === 3 ? lost === 2 ? 2 : 3 : won === 2 ? 1 : 0;
            }
            const homeWins = h > a ? [true, false, true, true, true] : [false, true, false, false, false];
            if (h + a === 3) homeWins.fill(h > a);
            if (h + a === 5) homeWins.splice(0, 5, true, false, true, false, h > a);
            for (let set = 1; set <= h + a; set++) {
                match[`UitslagHoofd_set${set}`] = homeWins[set - 1] ? (set === 5 ? '15/11' : '25/19') : (set === 5 ? '11/15' : '19/25');
            }
        }
        matches.push(match);
    });
    standings.sort((a, b) => b.AantalPunten - a.AantalPunten || b.AantalSetsGewonnen - a.AantalSetsGewonnen);
    standings.forEach((row, index) => { row.Volgorde = `${String(index + 1).padStart(2, '0')}.`; });
    return { matches, standings };
}
