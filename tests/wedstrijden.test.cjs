const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const vm = require('node:vm');

function setup(fetch = async () => ({ ok: true, json: async () => [] })) {
    function element() {
        return { value: '', textContent: '', children: [], attrs: {},
            addEventListener(event, handler) { this[event] = handler; },
            setAttribute(key, value) { this.attrs[key] = value; },
            appendChild(child) { this.children.push(child); return child; },
            createTHead() { return this.appendChild(element()); },
            createTBody() { return this.appendChild(element()); },
            insertRow() { return this.appendChild(element()); },
            insertCell() { return this.appendChild(element()); }
        };
    }
    const elements = Object.fromEntries(['table', 'ploegenSelect', 'button', 'rankingButton', 'resultsHeading', 'demoButton', 'demoNotice'].map(id =>
        [id, element()]));
    const context = vm.createContext({
        document: { getElementById: id => elements[id], createElement: element, addEventListener() {} },
        fetch, console: { error() {} }
    });
    vm.runInContext(readFileSync('js/wedstrijden_fetch.js', 'utf8'), context);
    return { context, elements, run: code => vm.runInContext(code, context) };
}

const match = (home, away, series = 'BVLPD-F') => ({
    Reeks: series, match_home_team_id: home, match_visitors_team_id: away,
    stnr_home: ['108676', '108677'].includes(home) ? 'L-0923' : 'L-0137',
    stnr_visitors: ['108676', '108677'].includes(away) ? 'L-0923' : 'L-0137'
});

test('shared cup series is filtered by team, including the derby for both teams', () => {
    const s = setup();
    s.context.matches = [match('108676', 'other'), match('other', '108676'),
        match('108677', 'other'), match('other', '108677'), match('108676', '108677'),
        match('other', 'another'), match('108676', 'other', 'LDP1')];
    for (const id of ['108676', '108677']) {
        assert.equal(s.run(`filterMatches(matches, ploegen.find(p => p.teamId === '${id}')).length`), 3);
    }
    assert.equal(s.run("isSelectedTeam(matches[4], 'home', ploegen[13])"), false);
    assert.equal(s.run("isSelectedTeam(matches[4], 'visitors', ploegen[13])"), true);
});

test('regular youth teams are recognized by club number despite name suffixes', () => {
    const s = setup();
    s.context.matches = [{ Reeks: 'LMU17N2R1-C', Thuis: 'MVC Peer B *', stnr_home: 'L-0923' },
        { Reeks: 'LMU17N2R1-C', Bezoekers: 'MVC Peer B *', stnr_visitors: 'L-0923' },
        { Reeks: 'LMU17N2R1-B', stnr_home: 'L-0923' }];
    assert.equal(s.run('filterMatches(matches, ploegen[5]).length'), 2);
});

test('cup selections have unique keys but request the same valid series code', async () => {
    const urls = [];
    const s = setup(async url => { urls.push(new URL(url)); return { ok: true, json: async () => [] }; });
    assert.equal(s.run('new Set(ploegen.map(ploegKey)).size'), 14);
    for (const id of ['108676', '108677']) {
        s.elements.ploegenSelect.value = `BVLPD-F:${id}`;
        await s.run('getMatchesFunction()');
        assert.equal(s.elements.table.textContent, 'Geen wedstrijden gevonden voor deze ploeg.');
    }
    for (const url of urls) {
        assert.equal(url.searchParams.get('reeks'), 'BVLPD-F');
        assert.equal(url.searchParams.get('stamnummer'), 'L-0923');
    }
});

test('late requests cannot overwrite the current team and errors are visible', async () => {
    const pending = [];
    const s = setup(() => new Promise((resolve, reject) => pending.push({ resolve, reject })));
    s.elements.ploegenSelect.value = 'LDP1';
    const first = s.run('getMatchesFunction()');
    s.elements.ploegenSelect.value = 'LDP3-C';
    const second = s.run('getMatchesFunction()');
    pending[1].reject(new Error('offline'));
    await second;
    const message = s.elements.table.textContent;
    assert.match(message, /konden niet worden geladen/);
    pending[0].resolve({ ok: true, json: async () => [] });
    await first;
    assert.equal(s.elements.table.textContent, message);
});


test('ranking renders the full cup pool, preserves official positions and marks both Peer teams', async () => {
    const urls = [];
    const rows = ['Other club', 'MVC Peer A (P1)', 'MVC Peer B (P3)'].map((Ploegnaam, i) => ({
        Reeks: 'BVLPD-F', Wedstrijd: 'Hoofd', Ploegnaam, Volgorde: ['01a.', '01b.', '03.'][i], AantalPunten: 0
    }));
    const s = setup(async url => { urls.push(new URL(url)); return { ok: true, json: async () => rows }; });
    s.elements.ploegenSelect.value = 'BVLPD-F:108676';
    await s.elements.rankingButton.click();
    assert.equal(urls[0].searchParams.get('reeks'), 'BVLPD-F');
    assert.equal(urls[0].searchParams.has('stamnummer'), false);
    const body = s.elements.table.children[0].children[0].children[1];
    assert.equal(body.children.length, 3);
    assert.equal(body.children[1].children[0].textContent, '01b.');
    assert.equal(body.children[1].children[7].textContent, 0);
    assert.match(body.children[1].className, /font-bold/);
    assert.match(body.children[2].className, /font-bold/);
    assert.equal(s.elements.rankingButton.attrs['aria-pressed'], 'true');
    assert.equal(s.elements.button.attrs['aria-pressed'], 'false');
    s.elements.ploegenSelect.value = 'BVLPD-F:108677';
    await s.elements.ploegenSelect.change();
    assert.equal(urls[1].searchParams.get('reeks'), 'BVLPD-F');
    assert.equal(s.elements.resultsHeading.textContent, 'Ranking – Promo 3 Beker');
});

test('switching views rejects stale responses and retains ranking on team changes', async () => {
    const pending = [];
    const s = setup(() => new Promise(resolve => pending.push(resolve)));
    s.elements.ploegenSelect.value = 'LDP1';
    const matches = s.elements.button.click();
    const ranking = s.elements.rankingButton.click();
    pending[1]({ ok: true, json: async () => [] });
    await ranking;
    pending[0]({ ok: true, json: async () => [] });
    await matches;
    assert.equal(s.elements.table.textContent, 'Nog geen ranking beschikbaar voor deze poule.');
    const next = s.elements.button.click();
    pending[2]({ ok: true, json: async () => [] });
    await next;
    assert.equal(s.elements.button.attrs['aria-pressed'], 'true');
    assert.equal(s.elements.table.textContent, 'Geen wedstrijden gevonden voor deze ploeg.');
});

test('ranking request failures show a retry message', async () => {
    const s = setup(async () => { throw Error('offline'); });
    s.elements.ploegenSelect.value = 'LDP1';
    await s.elements.rankingButton.click();
    assert.equal(s.elements.table.textContent, 'Ranking kon niet worden geladen. Probeer opnieuw.');
});


test('demo works in both views without network requests and exits back to official data', async () => {
    let requests = 0;
    const s = setup(async () => { requests++; return { ok: true, json: async () => [] }; });
    s.elements.ploegenSelect.value = 'BVLPD-F:108676';
    await s.elements.demoButton.click();
    assert.equal(requests, 0);
    assert.equal(s.elements.demoNotice.hidden, false);
    assert.match(s.elements.table.innerHTML, /Op de kalender/);
    assert.equal(s.run('filterMatches(createDemoData(ploegen[12]).matches, ploegen[12]).length'), 6);
    await s.elements.rankingButton.click();
    assert.equal(requests, 0);
    s.elements.ploegenSelect.value = 'LMU17N2R1-C';
    await s.elements.ploegenSelect.change();
    assert.equal(requests, 0);
    assert.equal(s.elements.resultsHeading.textContent, 'Ranking – U17B');
    await s.elements.demoButton.click();
    assert.equal(requests, 1);
    assert.equal(s.elements.demoNotice.hidden, true);
});

test('demo scores, set counts and standings agree and live responses cannot replace demo', async () => {
    const s = setup();
    const data = s.run('createDemoData(ploegen[0])');
    for (const match of data.matches.filter(m => m.UitslagHoofd)) {
        const score = match.UitslagHoofd.split('-').map(Number);
        const actual = [0, 0];
        for (let n = 1; n <= 5; n++) {
            if (!match[`UitslagHoofd_set${n}`]) continue;
            const [home, away] = match[`UitslagHoofd_set${n}`].split('/').map(Number);
            actual[home > away ? 0 : 1]++;
        }
        assert.deepEqual(actual, score);
    }
    const peer = data.standings.find(row => row.Ploegnaam.startsWith('MVC Peer'));
    assert.equal(peer.AantalWedstrijden, 3);
    assert.equal(peer.AantalWedstrijdenGewonnen, 2);
    assert.equal(peer.AantalPunten, 5);
    let resolve;
    const delayed = setup(() => new Promise(r => { resolve = r; }));
    delayed.elements.ploegenSelect.value = 'LDP1';
    const live = delayed.elements.button.click();
    await delayed.elements.demoButton.click();
    const demo = delayed.elements.table.innerHTML;
    resolve({ ok: true, json: async () => [] });
    await live;
    assert.equal(delayed.elements.table.innerHTML, demo);
});
