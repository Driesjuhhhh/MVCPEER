const reeksCodeArray = ["P1D","P3D-B","LMU17N2R1-E","LMU15N1R1-A","LMU15N2R1-C","LMU13N2R1-E","LMU13N3R1-B","LMU13N3R1-C","LMJU11N3R1-A","LMJU11N3R1-C","LMJU11N3R1-D","LMJU112-2(4.1)R1-B","BVLPD C","BVLPD L"];
const reeksNameArray = ["Promo 1 Dames", "Promo 3 Dames", "U17 Meisjes Niveau 2", "U15 Meisjes A", "U15 Meisjes B", "U13 Meisjes A", "U13 Meisjes B", "U13 Meisjes C", "U11 Jongens-Meisjes A", "U11 Jongens-Meisjes B", "U11 Jongens-Meisjes C", "U11 Jongens Meisjes 2v2", "Beker van Limburg Promo 1", "Beker van Limburg Promo 3"];
 const tableDiv = document.getElementById('table');

class VolleyAdmin2 {
    static API_URL = 'https://www.volleyadmin2.be/services';

    // Possible methods
    static API_METHOD_STANDINGS = 'rangschikking';
    static API_METHOD_MATCHES = 'wedstrijden';
    static API_METHOD_TEAMS = 'series';

    // Possible variables
    static CLUB_NUMBER = 'stamnummer';
    static PROVINCE_ID = 'province_id';
    static SERIES_ID = 'reeks';

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
        if (typeof fetch !== 'function') {
            throw new Error('This method requires the fetch API, which is not available in this environment.');
        }

        parameters.format = 'json';

        const queryParams = Object.entries(parameters)
            .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
            .join('&');

        // Define endPoint
        const endPoint = `${VolleyAdmin2.API_URL}/${method}_xml.php?${queryParams}`;

        try {
            // Fetch data
            const response = await fetch(endPoint, {
                method: 'GET',
                timeout: 10000,
              });

            // Handle response errors
            if (!response.ok) {
                throw new Error(`Request failed with status: ${response.status}`);
            }

            // Parse response as JSON
            const responseData = await response.json();

            return responseData;
        } catch (error) {
            throw new Error(`An error occurred while fetching data: ${error.message}`);
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

            if (![VolleyAdmin2.CLUB_NUMBER, VolleyAdmin2.PROVINCE_ID, VolleyAdmin2.SERIES_ID].includes(key)) {
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
        return this.doCall(VolleyAdmin2.API_METHOD_MATCHES, this.checkParameters({
            [VolleyAdmin2.SERIES_ID]: seriesId,
            [VolleyAdmin2.PROVINCE_ID]: provinceId,
            [VolleyAdmin2.CLUB_NUMBER]: clubNumber,
        }));
    }

    /**
     * Get series
     *
     * @param {number} provinceId - Fill in if you want to filter for province.
     * @returns {Promise<object>}
     * @throws {Error}
     */
    async getSeries(provinceId = null) {
        return this.doCall(VolleyAdmin2.API_METHOD_TEAMS, this.checkParameters({
            [VolleyAdmin2.PROVINCE_ID]: provinceId,
        }));
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
        return this.doCall(VolleyAdmin2.API_METHOD_STANDINGS, this.checkParameters({
            [VolleyAdmin2.SERIES_ID]: seriesId,
            [VolleyAdmin2.PROVINCE_ID]: provinceId,
        }));
    }
}

// Instantiate the VolleyAdmin2 class
const volleyAdmin = new VolleyAdmin2();

// Set the credentials
const clubNumber = 'L-0923';
const provinceId = 4;
const seriesId = document.getElementById('ploegenSelect').value;

// Example: Get matches
volleyAdmin.getMatches(seriesId, provinceId, clubNumber)
    .then((matches) => {
        
        if (tableDiv) {
            const table = document.createElement('table');
            table.innerHTML = '<tr><th>Ploeg</th><th>Datum</th></tr>';

            matches.forEach(element => {
                const ploegnummer = element.Reeks;
                for (let i = 0; i < reeksCodeArray.length; i++) {
                    if (reeksCodeArray[i] === ploegnummer){
                        var ploeg = reeksNameArray[i]
                    }
                  }
                const wedstrijdnummer = element.Wedstrijdnr;
                
                const row = document.createElement('tr');
                row.innerHTML = `<td>${ploeg}</td><td>${datum}</td>`;
                
                table.appendChild(row);
            });

            tableDiv.appendChild(table);
        } else {
            console.error('Error');
        }
    })
    .catch((error) => {
        table.innerHTML = `<p>Error: ${error.message} ${seriesId}<p>`;
        console.error('Error:', error.message);
    });


// Example: Get series
volleyAdmin.getSeries(provinceId)
    .then((series) => {
        console.log('Series:', series);
    })
    .catch((error) => {
        table.innerHTML = `<p>Error: ${error.message}<p>`;
    });

// Example: Get standings
volleyAdmin.getStandings(seriesId, provinceId)
    .then((standings) => {
        console.log('Standings:', standings);
    })
    .catch((error) => {
        table.innerHTML = `<p>Error: ${error.message}<p>`;
    });
