const url = "https://www.volleyadmin2.be/services/wedstrijden_xml.php?province_id=4&stamnummer=L-0923&seriesid=p1d&format=json";

// Selecteer de lijstitems waar je de informatie wilt weergeven
const wedstrijdsporthal = document.querySelector(".volgendewedstrijdpromo-1-sporthal");
const wedstrijddatum = document.querySelector(".volgendewedstrijdpromo-1-datum");
const wedstrijduur = document.querySelector(".volgendewedstrijdpromo-1-tijd");

// Fetch data using Fetch API
fetch(url)
  .then(response => response.json())
  .then(data => {

    // Filter de wedstrijden die nog moeten plaatsvinden
    const wedstrijden = eerstvolgendeWedstrijd(data)

    // Neem de gegevens van de eerstvolgende wedstrijd
    const eerstvolgendeWedstrijd = wedstrijden[0];

    // Update de innerHTML van de lijstitems
    wedstrijdsporthal.innerHTML = eerstvolgendeWedstrijd
      ? `<span>Locatie: ${eerstvolgendeWedstrijd.SporthalNaam}</span>`
      : "<span>Geen komende wedstrijden gevonden.</span>";

    wedstrijddatum.innerHTML = `<span>Datum: ${eerstvolgendeWedstrijd.t}</span>`

    wedstrijduur.innerHTML = `<span>Uur: ${eerstvolgendeWedstrijd.Aanvangsuur}</span>`
  })
  .catch(error => console.error("Fout bij het ophalen van gegevens:", error));

function eerstvolgendeWedstrijden(data) {
    const futureDates = []

    for (let i = 0; i < data.length; i++) {
        const time = data[i]
        //console.log(time)
        const date = time.t.split("/").reverse().join("-");
        //console.log(date)
        const alreadyHappened = new Date(date) < new Date();

        if (!alreadyHappened) {
            futureDates.push(date)
        }
    }

    return futureDates
}

