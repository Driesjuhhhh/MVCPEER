fetchpromo1();
fetchpromo3();


function fetchpromo1() {
    const url = "https://www.volleyadmin2.be/services/wedstrijden_xml.php?reeks=LDP1&province_id=4&stamnummer=L-0923&format=json";

    // Selecteer de lijstitems waar je de informatie wilt weergeven
    const wedstrijdsporthal = document.querySelector(".volgendewedstrijdpromo-1-sporthal");
    const wedstrijddatum = document.querySelector(".volgendewedstrijdpromo-1-datum");
    const wedstrijduur = document.querySelector(".volgendewedstrijdpromo-1-tijd");

    // Fetch data using Fetch API
    fetch(url)
        .then(response => response.json())
        .then(data => {

            // Filter de wedstrijden die nog moeten plaatsvinden
            const wedstrijden = eerstvolgendeWedstrijden(data)

            // Neem de gegevens van de eerstvolgende wedstrijd
            const eerstvolgendeWedstrijd = wedstrijden[0];

            // Update de innerHTML van de lijstitems
            wedstrijdsporthal.innerHTML = eerstvolgendeWedstrijd
                ? `<span>Locatie: ${eerstvolgendeWedstrijd.SporthalNaam}</span>`
                : "<span>Geen komende wedstrijden gevonden.</span>";

            wedstrijddatum.innerHTML = `<span>Datum: ${eerstvolgendeWedstrijd.t}</span>`

            wedstrijduur.innerHTML = `<span>Uur: ${eerstvolgendeWedstrijd.Aanvangsuur.substr(
                0,
                5
            )}</span>`
        })
        .catch(error => console.error("Fout bij het ophalen van gegevens:", error));
}

function fetchpromo3() {
    const url = "https://www.volleyadmin2.be/services/wedstrijden_xml.php?reeks=LDP3-A&province_id=4&stamnummer=L-0923&format=json";

    // Selecteer de lijstitems waar je de informatie wilt weergeven
    const wedstrijdsporthal = document.querySelector(".volgendewedstrijdpromo-3-sporthal");
    const wedstrijddatum = document.querySelector(".volgendewedstrijdpromo-3-datum");
    const wedstrijduur = document.querySelector(".volgendewedstrijdpromo-3-tijd");

    // Fetch data using Fetch API
    fetch(url)
        .then(response => response.json())
        .then(data => {

            // Filter de wedstrijden die nog moeten plaatsvinden
            const wedstrijden = eerstvolgendeWedstrijden(data)

            // Neem de gegevens van de eerstvolgende wedstrijd
            const eerstvolgendeWedstrijd = wedstrijden[0];

            // Update de innerHTML van de lijstitems
            wedstrijdsporthal.innerHTML = eerstvolgendeWedstrijd
                ? `<span>Locatie: ${eerstvolgendeWedstrijd.SporthalNaam}</span>`
                : "<span>Geen komende wedstrijden gevonden.</span>";

            wedstrijddatum.innerHTML = `<span>Datum: ${eerstvolgendeWedstrijd.t}</span>`

            wedstrijduur.innerHTML = `<span>Uur: ${eerstvolgendeWedstrijd.Aanvangsuur.substr(
                0,
                5
            )}</span>`
        })
        .catch(error => console.error("Fout bij het ophalen van gegevens:", error));
}

function eerstvolgendeWedstrijden(data) {
    const futureDates = []

    for (let i = 0; i < data.length; i++) {
        const wedstrijd = data[i]
        //console.log(time)
        const date = wedstrijd.t.split("/").reverse().join("-");
        //console.log(date)
        const alreadyHappened = new Date(date) < new Date();

        if (!alreadyHappened) {
            futureDates.push(wedstrijd)
        }
    }

    return futureDates
}

