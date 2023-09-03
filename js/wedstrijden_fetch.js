class VolleyAdmin2 {
    static API_URL = 'http://www.volleyadmin2.be/services';

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
const seriesId = 'P3D-B';

// Example: Get matches
volleyAdmin.getMatches(seriesId, provinceId, clubNumber)
    .then(async (matches) => {
        
        

        // Selecteer de tabeldiv
        const tableDiv = document.getElementById('table');

        // Maak een nieuwe tabel aan
        const table = document.createElement('table');

        // Maak de tabelkop (header) aan
        const headerRow = table.insertRow();
        const header1 = document.createElement('th');
        header1.textContent = 'Match ID';
        const header2 = document.createElement('th');
        header2.textContent = 'Series Name';
        const header3 = document.createElement('th');
        header3.textContent = 'Match Info';
        const header4 = document.createElement('th');
        header4.textContent = 'Datum';
        headerRow.appendChild(header1);
        headerRow.appendChild(header2);
        headerRow.appendChild(header3);
        headerRow.appendChild(header4);

        // Voeg elke match toe als een rij in de tabel
        for (const match of matches) {
            const row = table.insertRow();
            
            const seriesName = await volleyAdmin.getSeriesName(match.seriesId);
            const matchInfo = await volleyAdmin.getMatchInfo(match.matchId);
            const formattedDate = formatDate(match.date);

            const cell1 = row.insertCell();
            cell1.textContent = match.matchId;
            const cell2 = row.insertCell();
            cell2.textContent = seriesName;
            const cell3 = row.insertCell();
            cell3.textContent = matchInfo;
            const cell4 = row.insertCell();
            cell4.textContent = formattedDate;
        }

        // Voeg de voltooide tabel toe aan de div
        tableDiv.appendChild(table);
    })
    .catch((error) => {
        console.error('Error:', error.message);
    });


// Example: Get series
volleyAdmin.getSeries(provinceId)
    .then((series) => {
        console.log('Series:', series);
    })
    .catch((error) => {
        console.error('Error:', error.message);
    });

// Example: Get standings
volleyAdmin.getStandings(seriesId, provinceId)
    .then((standings) => {
        console.log('Standings:', standings);
    })
    .catch((error) => {
        console.error('Error:', error.message);
    });
