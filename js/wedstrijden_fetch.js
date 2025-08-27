
const tableDiv = document.getElementById("table");
const select = document.getElementById("ploegenSelect");
const table = document.createElement("table");
const button = document.getElementById("button");

button.addEventListener("click", function () {
    tableDiv.innerHTML = "";
    getMatchesFunction();
});

// Functie om automatisch ploegnamen en ids te laden uit volleyscores.be

async function updatePloegenSelectFromVolleyscores() {
    const volleyscoresUrl = "https://www.volleyscores.be/index.php?v=2&ss=0&isActiveSeason=1&t=Club%20L-0923%20Monsheide%20VBC%20Peer&a=cc&se=12&pi=&si=&ti=&ci=10791&mm=&ssi=&st=&w=%25&f=&lng=nl";
    try {
        const response = await fetch(volleyscoresUrl);
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        // Zoek alle tekstnodes met "Reeks:"
        const allElements = Array.from(doc.querySelectorAll('body *'));
        let options = [];
        allElements.forEach(el => {
            if (el.childNodes.length === 1 && el.childNodes[0].nodeType === 3 && el.textContent.includes('Reeks:')) {
                const match = el.textContent.match(/Reeks:\s*(.*?)\s*\((.*?)\)/);
                if (match) {
                    const naam = match[1].trim();
                    const id = match[2].trim();
                    options.push({ id, naam });
                }
            }
        });
        if (options.length > 0 && select) {
            select.innerHTML = options.map(opt => `<option value="${opt.id}">${opt.naam}</option>`).join("\n");
            // Verwijder eventuele oude fallback-melding
            const oldFallback = document.getElementById('ploegen-fallback');
            if (oldFallback) oldFallback.remove();
            // Selecteer eerste ploeg, maar laad nog geen wedstrijden
            select.selectedIndex = 0;
        }
    } catch (e) {
        // Fallback: toon melding onder de select
        console.warn("Kon ploegen niet automatisch laden van volleyscores.be", e);
        if (select) {
            let fallback = document.getElementById('ploegen-fallback');
            if (!fallback) {
                fallback = document.createElement('div');
                fallback.id = 'ploegen-fallback';
                fallback.style.color = 'red';
                fallback.style.fontSize = '0.9em';
                fallback.style.marginTop = '8px';
                fallback.textContent = 'Let op: ploegenlijst kon niet automatisch geladen worden.';
                select.parentNode.insertBefore(fallback, select.nextSibling);
            }
        }
    }
}

// Roep de functie aan bij paginalaad
document.addEventListener("DOMContentLoaded", async function() {
    // Toon tijdelijk een laad-optie
    if (select) {
        select.innerHTML = '<option disabled selected>laden...</option>';
    }
    await updatePloegenSelectFromVolleyscores();
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
        try {
            const response =  fetch(volleyscoresUrl);
            const html =  response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");
            // Zoek alle tekstnodes met "Reeks:"
            const allElements = Array.from(doc.querySelectorAll('body *'));
            let options = [];
            allElements.forEach(el => {
                if (el.childNodes.length === 1 && el.childNodes[0].nodeType === 3 && el.textContent.includes('Reeks:')) {
                    const match = el.textContent.match(/Reeks:\s*(.*?)\s*\((.*?)\)/);
                    if (match) {
                        const naam = match[1].trim();
                        const id = match[2].trim();
                        options.push({ id, naam });
                    }
                }
            });
            if (options.length > 0 && select) {
                select.innerHTML = options.map(opt => `<option value="${opt.id}">${opt.naam}</option>`).join("\n");
                // Verwijder eventuele oude fallback-melding
                const oldFallback = document.getElementById('ploegen-fallback');
                if (oldFallback) oldFallback.remove();
                // Selecteer eerste ploeg, maar laad nog geen wedstrijden
                select.selectedIndex = 0;
            } else if (select) {
                select.innerHTML = '<option disabled selected>Geen ploegen gevonden</option>';
            }
        } catch (e) {
            // Fallback: toon melding onder de select
            console.warn("Kon ploegen niet automatisch laden van volleyscores.be", e);
            if (select) {
                select.innerHTML = '<option disabled selected>Geen ploegen gevonden</option>';
                let fallback = document.getElementById('ploegen-fallback');
                if (!fallback) {
                    fallback = document.createElement('div');
                    fallback.id = 'ploegen-fallback';
                    fallback.style.color = 'red';
                    fallback.style.fontSize = '0.9em';
                    fallback.style.marginTop = '8px';
                    fallback.textContent = 'Let op: ploegenlijst kon niet automatisch geladen worden.';
                    select.parentNode.insertBefore(fallback, select.nextSibling);
                }
            }
        }
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
                const table = document.createElement("table");
                table.classList.add("table");
                table.innerHTML =
                    '<thead><tr><th scope="col">Thuis</th><th scope="col">Bezoeker</th><th scope="col">Locatie</th><th scope="col">Wanneer</th><th scope="col">Score</th></tr></thead>';
                var tbody = table.createTBody();
                matches.forEach((element) => {
                    if (element.UitslagHoofd === "undefined") {
                        var uitslag = "/";
                    } else {
                        var uitslag = element.UitslagHoofd;
                    }
                    var aanvangsuur = element.Aanvangsuur;
                    const row = document.createElement("tr");
                    row.innerHTML = `<td>${element.Thuis}</td><td>${
                        element.Bezoekers
                    }</td><td>${element.SporthalNaam}</td><td>
                    ${element.t} ${aanvangsuur.substr(
                        0,
                        5
                    )}</td><td> ${uitslag}</td>`;

                    tbody.appendChild(row);
                });

                tableDiv.appendChild(table);
            } else {
                console.error("Error");
            }
        })
        .catch((error) => {
            table.innerHTML = `<p>Error<p>`;
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
