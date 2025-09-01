const tableDiv = document.getElementById("table");
const select = document.getElementById("ploegenSelect");
const table = document.createElement("table");
const button = document.getElementById("button");

button.addEventListener("click", function () {
    tableDiv.innerHTML = "";
    getMatchesFunction();
});

// Hardcoded lijst op basis van de data uit volleyscores HTML
document.addEventListener("DOMContentLoaded", function() {
    const ploegen = [
        { naam: 'Promo 1 Dames', id: 'LDP1' },
        { naam: 'Promo 3 Dames C', id: 'LDP3-C' },
        { naam: 'U19 Meisjes Niveau 2 Ronde 1', id: 'LMU19N2R1' },
        { naam: 'U15 Meisjes Niveau 1 Ronde 1 A', id: 'LMU15N1R1-A' },
        { naam: 'U15 Meisjes Niveau 1 Ronde 1 B', id: 'LMU15N1R1-B' },
        { naam: 'U15 Meisjes Niveau 3 Ronde 1 E', id: 'LMU15N3R1-E' },
        { naam: 'U15 Meisjes Niveau 3 Ronde 1 G', id: 'LMU15N3R1-G' },
        { naam: 'U13 Meisjes Niveau 1 Ronde 1 A', id: 'LMU13N1R1-A' },
        { naam: 'U13 Meisjes Niveau 1 Ronde 1 D', id: 'LMU13N1R1-D' },
        { naam: 'U13 Meisjes Niveau 3 Ronde 1 G', id: 'LMU13N3R1-G' },
        { naam: 'U13 Meisjes Niveau 3 Ronde 1 H', id: 'LMU13N3R1-H' },
        { naam: 'U11 Jongens-Meisjes 2 - 2 Niveau 2 Ronde 1 A', id: 'LJMU112-2N2R1-A' },
        { naam: 'Beker van Limburg Promo Dames F', id: 'BVLPD F' },
        { naam: 'Beker van Limburg Promo Dames L', id: 'BVLPD L' },
        { naam: 'Beker van Limburg U19 Meisjes', id: 'BVLU19M' }
    ];
    if (select) {
        select.innerHTML = ploegen.map(opt => `<option value="${opt.id}">${opt.naam}</option>`).join("\n");
        select.selectedIndex = 0;
        // Verwijder eventuele oude fallback-melding
        const oldFallback = document.getElementById('ploegen-fallback');
        if (oldFallback) oldFallback.remove();
    }
    // Show mock data table by default
    if (tableDiv) {
        const table = document.createElement("table");
        table.className = "min-w-full text-sm text-gray-800 dark:text-gray-100 border-separate border-spacing-y-2";
        table.innerHTML =
            `<thead>
                <tr class="bg-blue-100 dark:bg-gray-700 text-base">
                    <th class="px-2 py-3 w-8"></th>
                    <th class="px-4 py-3">Thuis</th>
                    <th class="px-4 py-3">Bezoeker</th>
                    <th class="px-4 py-3">Locatie</th>
                    <th class="px-4 py-3">Wanneer</th>
                    <th class="px-4 py-3">Score</th>
                </tr>
            </thead>`;
        var tbody = table.createTBody();
        mockMatches.forEach((element, idx) => {
            var uitslag = (element.UitslagHoofd === "undefined") ? "/" : element.UitslagHoofd;
            var aanvangsuur = element.Aanvangsuur;
            const row = document.createElement("tr");
            row.className = `bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all cursor-pointer group ${idx % 2 === 0 ? 'bg-opacity-90' : 'bg-opacity-100'}`;
            // Open/dichtklap icoon SVG (chevron)
            const iconTd = `<td class=\"px-2 py-3 align-middle w-8\">
                <span class=\"inline-block transition-transform duration-300 group-[.open]:rotate-90\">
                    <svg class=\"w-5 h-5 text-blue-500 dark:text-blue-300\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" viewBox=\"0 0 24 24\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M9 5l7 7-7 7\"/></svg>
                </span>
            </td>`;
            row.innerHTML =
                iconTd +
                `<td class=\"px-4 py-3 font-semibold\">${element.Thuis}</td>
                <td class=\"px-4 py-3\">${element.Bezoekers}</td>
                <td class=\"px-4 py-3 text-sm\">${element.SporthalNaam}</td>
                <td class=\"px-4 py-3 text-sm whitespace-nowrap\">${element.t} <span class=\"font-mono\">${aanvangsuur.substr(0,5)}</span></td>
                <td class=\"px-4 py-3 text-center font-bold\">${uitslag}</td>
            `;
            tbody.appendChild(row);

            // Uitklapbare details rij
            const detailsRow = document.createElement("tr");
            detailsRow.className = "hidden details-row";
            detailsRow.innerHTML = `<td colspan="6" class="px-6 py-5 bg-gradient-to-br from-blue-100/80 to-blue-200/60 dark:from-gray-900/80 dark:to-gray-800/60 rounded-b-2xl border-t border-blue-200 dark:border-gray-700">
                <div class="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                    <div class="flex-1">
                        <div class="font-semibold text-blue-700 dark:text-blue-300 mb-2">Setstanden</div>
                        <div class="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-1 text-sm">
                            <div><span class="font-medium">Set 1:</span> ${element.UitslagHoofd_set1 || '/'} </div>
                            <div><span class="font-medium">Set 2:</span> ${element.UitslagHoofd_set2 || '/'} </div>
                            <div><span class="font-medium">Set 3:</span> ${element.UitslagHoofd_set3 || '/'} </div>
                            <div><span class="font-medium">Set 4:</span> ${element.UitslagHoofd_set4 || '/'} </div>
                            <div><span class="font-medium">Set 5:</span> ${element.UitslagHoofd_set5 || '/'} </div>
                        </div>
                    </div>
                    <div class="flex-1 mt-4 md:mt-0">
                        <div class="font-semibold text-blue-700 dark:text-blue-300 mb-2">Eindstand</div>
                        <div class="text-lg font-bold">${element.UitslagHoofd || '/'} </div>
                    </div>
                </div>
            </td>`;
            tbody.appendChild(detailsRow);

            row.addEventListener('click', function() {
                detailsRow.classList.toggle('hidden');
            });
        });
    tableDiv.innerHTML = "";
    tableDiv.appendChild(table);

        // Statistiek toevoegen
        const statDiv = document.createElement("div");
        statDiv.className = "mt-6 text-center text-base font-semibold text-blue-700 dark:text-blue-300";
        // Simpele analyse: wie wint vaker, thuis of uit?
        let homeWins = 0, awayWins = 0, teamName = "MVC Peer";
        mockMatches.forEach(m => {
            if (!m.UitslagHoofd || m.UitslagHoofd === "/" || m.UitslagHoofd === "undefined") return;
            const [home, away] = m.UitslagHoofd.split("-").map(Number);
            if (isNaN(home) || isNaN(away)) return;
            if (m.Thuis === teamName && home > away) homeWins++;
            if (m.Bezoekers === teamName && away > home) awayWins++;
        });
        let statText = "";
        if (homeWins > awayWins) statText = `🏠 <b>MVC Peer</b> wint vaker thuis! (${homeWins}x thuis vs ${awayWins}x uit)`;
        else if (awayWins > homeWins) statText = `🚌 <b>MVC Peer</b> wint vaker uit! (${awayWins}x uit vs ${homeWins}x thuis)`;
        else if (homeWins === 0 && awayWins === 0) statText = `Nog geen overwinningen voor <b>MVC Peer</b>.`;
        else statText = `Evenveel thuis- als uitoverwinningen voor <b>MVC Peer</b>! (${homeWins}x thuis, ${awayWins}x uit)`;

        // Hoogste overwinning en zwaarste nederlaag
        let maxWin = null, maxLoss = null;
        // Gemiddeld aantal gescoorde sets per wedstrijd
        let totalSets = 0, playedMatches = 0;
        mockMatches.forEach(m => {
            if (!m.UitslagHoofd || m.UitslagHoofd === "/" || m.UitslagHoofd === "undefined") return;
            const [home, away] = m.UitslagHoofd.split("-").map(Number);
            if (isNaN(home) || isNaN(away)) return;
            let diff = 0, win = false, loss = false;
            // Punten per set voor MVC Peer
            let puntenTotaal = 0, setsTotaal = 0;
            for (let i = 1; i <= 5; i++) {
                const setScore = m[`UitslagHoofd_set${i}`];
                if (!setScore || setScore === "/" || setScore === "undefined") continue;
                const [setHome, setAway] = setScore.split("-").map(Number);
                if (isNaN(setHome) || isNaN(setAway)) continue;
                // Alleen daadwerkelijk gespeelde sets tellen, en juiste score pakken
                if (m.Thuis === teamName) {
                    puntenTotaal += setHome;
                    setsTotaal++;
                } else if (m.Bezoekers === teamName) {
                    puntenTotaal += setAway;
                    setsTotaal++;
                }
            }
            if (setsTotaal > 0) {
                m._puntenTotaal = puntenTotaal;
                m._setsTotaal = setsTotaal;
            }
            if (m.Thuis === teamName) {
                diff = home - away;
                win = home > away;
                loss = home < away;
                totalSets += home;
            } else if (m.Bezoekers === teamName) {
                diff = away - home;
                win = away > home;
                loss = away < home;
                totalSets += away;
            }
            if (win && (!maxWin || diff > maxWin.diff)) maxWin = { ...m, diff };
            if (loss && (!maxLoss || diff < maxLoss.diff)) maxLoss = { ...m, diff };
            playedMatches++;
        });
        let extraStats = "";
        if (playedMatches > 0) {
            const avgSets = (totalSets / playedMatches).toFixed(2);
            // Gemiddeld aantal punten per set voor MVC Peer
            let totaalPunten = 0, totaalSets = 0;
            mockMatches.forEach(m => {
                if (typeof m._puntenTotaal === "number" && typeof m._setsTotaal === "number") {
                    totaalPunten += m._puntenTotaal;
                    totaalSets += m._setsTotaal;
                }
            });
            let avgPuntenPerSet = totaalSets > 0 ? (totaalPunten / totaalSets).toFixed(2) : "-";
            extraStats += `<br>📊 Gemiddeld aantal gescoorde sets per wedstrijd: <b>${avgSets}</b>`;
            extraStats += `<br>🏐 Gemiddeld aantal punten per set (<b>MVC Peer</b>): <b>${avgPuntenPerSet}</b>`;
        }
        if (maxWin) {
            extraStats += `<br>🏆 Grootste overwinning: <b>${maxWin.Thuis} - ${maxWin.Bezoekers}</b> (${maxWin.UitslagHoofd}, ${maxWin.t})`;
        }
        if (maxLoss) {
            extraStats += `<br>😬 Zwaarste nederlaag: <b>${maxLoss.Thuis} - ${maxLoss.Bezoekers}</b> (${maxLoss.UitslagHoofd}, ${maxLoss.t})`;
        }
        statDiv.innerHTML = statText + extraStats;
        tableDiv.appendChild(statDiv);
    }
});

// Set the credentials
const clubNumber = "L-0923";
const provinceId = 4;
const seriesId = select.value;

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
function getMatchesFunction() {
    volleyAdmin
        .getMatches(
            document.getElementById("ploegenSelect").value,
            provinceId,
            clubNumber
        )
        .then((matches) => {
            if (tableDiv) {
                tableDiv.innerHTML = ""; // Clear mock data
                const table = document.createElement("table");
                table.className = "min-w-full text-sm text-gray-800 dark:text-gray-100 border-separate border-spacing-y-2";
                table.innerHTML =
                    `<thead>
                        <tr class="bg-blue-100 dark:bg-gray-700 text-base">
                            <th class="px-4 py-3 rounded-l-xl">Thuis</th>
                            <th class="px-4 py-3">Bezoeker</th>
                            <th class="px-4 py-3">Locatie</th>
                            <th class="px-4 py-3">Wanneer</th>
                            <th class="px-4 py-3 rounded-r-xl">Score</th>
                        </tr>
                    </thead>`;
                var tbody = table.createTBody();
                matches.forEach((element, idx) => {
                    var uitslag = (element.UitslagHoofd === "undefined") ? "/" : element.UitslagHoofd;
                    var aanvangsuur = element.Aanvangsuur;
                    const row = document.createElement("tr");
                    row.className = `bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all cursor-pointer ${idx % 2 === 0 ? 'bg-opacity-90' : 'bg-opacity-100'}`;
                    row.innerHTML = `
                        <td class="px-4 py-3 font-semibold">${element.Thuis}</td>
                        <td class="px-4 py-3">${element.Bezoekers}</td>
                        <td class="px-4 py-3 text-sm">${element.SporthalNaam}</td>
                        <td class="px-4 py-3 text-sm whitespace-nowrap">${element.t} <span class="font-mono">${aanvangsuur.substr(0,5)}</span></td>
                        <td class="px-4 py-3 text-center font-bold">${uitslag}</td>
                    `;
                    tbody.appendChild(row);

                    // Uitklapbare details rij
                    const detailsRow = document.createElement("tr");
                    detailsRow.className = "hidden details-row";
                    detailsRow.innerHTML = `<td colspan="5" class="px-6 py-4 bg-blue-50 dark:bg-gray-900/70 text-left rounded-b-xl">
                        <div class="text-sm">
                            <b>UitslagHoofd:</b> ${element.UitslagHoofd || '/'}<br>
                            <b>Set 1:</b> ${element.UitslagHoofd_set1 || '/'}<br>
                            <b>Set 2:</b> ${element.UitslagHoofd_set2 || '/'}<br>
                            <b>Set 3:</b> ${element.UitslagHoofd_set3 || '/'}<br>
                            <b>Set 4:</b> ${element.UitslagHoofd_set4 || '/'}<br>
                            <b>Set 5:</b> ${element.UitslagHoofd_set5 || '/'}
                        </div>
                    </td>`;
                    tbody.appendChild(detailsRow);

                    row.addEventListener('click', function() {
                        detailsRow.classList.toggle('hidden');
                    });
                });
                tableDiv.appendChild(table);

                // Statistiek toevoegen
                const statDiv = document.createElement("div");
                statDiv.className = "mt-6 text-center text-base font-semibold text-blue-700 dark:text-blue-300";
                // Simpele analyse: wie wint vaker, thuis of uit?
                let homeWins = 0, awayWins = 0, teamName = "MVC Peer";
                matches.forEach(m => {
                    if (!m.UitslagHoofd || m.UitslagHoofd === "/" || m.UitslagHoofd === "undefined") return;
                    const [home, away] = m.UitslagHoofd.split("-").map(Number);
                    if (isNaN(home) || isNaN(away)) return;
                    if (m.Thuis === teamName && home > away) homeWins++;
                    if (m.Bezoekers === teamName && away > home) awayWins++;
                });
                let statText = "";
                if (homeWins > awayWins) statText = `🏠 <b>MVC Peer</b> wint vaker thuis! (${homeWins}x thuis vs ${awayWins}x uit)`;
                else if (awayWins > homeWins) statText = `🚌 <b>MVC Peer</b> wint vaker uit! (${awayWins}x uit vs ${homeWins}x thuis)`;
                else if (homeWins === 0 && awayWins === 0) statText = `Nog geen overwinningen voor <b>MVC Peer</b>.`;
                else statText = `Evenveel thuis- als uitoverwinningen voor <b>MVC Peer</b>! (${homeWins}x thuis, ${awayWins}x uit)`;

                // Hoogste overwinning en zwaarste nederlaag
                let maxWin = null, maxLoss = null;
                // Gemiddeld aantal gescoorde sets per wedstrijd
                let totalSets = 0, playedMatches = 0;
                matches.forEach(m => {
                    if (!m.UitslagHoofd || m.UitslagHoofd === "/" || m.UitslagHoofd === "undefined") return;
                    const [home, away] = m.UitslagHoofd.split("-").map(Number);
                    if (isNaN(home) || isNaN(away)) return;
                    let diff = 0, win = false, loss = false;
                    // Punten per set voor MVC Peer
                    let puntenTotaal = 0, setsTotaal = 0;
                    for (let i = 1; i <= 5; i++) {
                        const setScore = m[`UitslagHoofd_set${i}`];
                        if (!setScore || setScore === "/" || setScore === "undefined") continue;
                        const [setHome, setAway] = setScore.split("-").map(Number);
                        if (isNaN(setHome) || isNaN(setAway)) continue;
                        // Alleen daadwerkelijk gespeelde sets tellen, en juiste score pakken
                        if (m.Thuis === teamName) {
                            puntenTotaal += setHome;
                            setsTotaal++;
                        } else if (m.Bezoekers === teamName) {
                            puntenTotaal += setAway;
                            setsTotaal++;
                        }
                    }
                    if (setsTotaal > 0) {
                        m._puntenTotaal = puntenTotaal;
                        m._setsTotaal = setsTotaal;
                    }
                    if (m.Thuis === teamName) {
                        diff = home - away;
                        win = home > away;
                        loss = home < away;
                        totalSets += home;
                    } else if (m.Bezoekers === teamName) {
                        diff = away - home;
                        win = away > home;
                        loss = away < home;
                        totalSets += away;
                    }
                    if (win && (!maxWin || diff > maxWin.diff)) maxWin = { ...m, diff };
                    if (loss && (!maxLoss || diff < maxLoss.diff)) maxLoss = { ...m, diff };
                    playedMatches++;
                });
                let extraStats = "";
                if (playedMatches > 0) {
                    const avgSets = (totalSets / playedMatches).toFixed(2);
                    // Gemiddeld aantal punten per set voor MVC Peer
                    let totaalPunten = 0, totaalSets = 0;
                    matches.forEach(m => {
                        if (typeof m._puntenTotaal === "number" && typeof m._setsTotaal === "number") {
                            totaalPunten += m._puntenTotaal;
                            totaalSets += m._setsTotaal;
                        }
                    });
                    let avgPuntenPerSet = totaalSets > 0 ? (totaalPunten / totaalSets).toFixed(2) : "-";
                    extraStats += `<br>📊 Gemiddeld aantal gescoorde sets per wedstrijd: <b>${avgSets}</b>`;
                    extraStats += `<br>🏐 Gemiddeld aantal punten per set (<b>MVC Peer</b>): <b>${avgPuntenPerSet}</b>`;
                }
                if (maxWin) {
                    extraStats += `<br>🏆 Grootste overwinning: <b>${maxWin.Thuis} - ${maxWin.Bezoekers}</b> (${maxWin.UitslagHoofd}, ${maxWin.t})`;
                }
                if (maxLoss) {
                    extraStats += `<br>😬 Zwaarste nederlaag: <b>${maxLoss.Thuis} - ${maxLoss.Bezoekers}</b> (${maxLoss.UitslagHoofd}, ${maxLoss.t})`;
                }

                statDiv.innerHTML = statText + extraStats;
                tableDiv.appendChild(statDiv);
            } else {
                console.error("Error");
            }
        })
        .catch((error) => {
            tableDiv.innerHTML = `<p>Error<p>`;
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

function getStandingsFunction() {
    // Example: Get standings
    volleyAdmin
        .getStandings(seriesId, provinceId)
        .then((standings) => {
            // console.log('Standings:', standings);
        })
        .catch((error) => {
            // table.innerHTML = `<p>Error<p>`;
            // console.log(error)
        });
}