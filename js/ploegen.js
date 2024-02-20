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
    const komendeWedstrijden = data.filter(wedstrijd => wedstrijd.t > getCurrentDate());

    // Neem de gegevens van de eerstvolgende wedstrijd
    const eerstvolgendeWedstrijd = komendeWedstrijden.length > 0 ? komendeWedstrijden[0] : null;

    // Update de innerHTML van de lijstitems
    wedstrijdsporthal.innerHTML = eerstvolgendeWedstrijd
      ? `<span>Locatie: ${eerstvolgendeWedstrijd.SporthalNaam}</span>`
      : "<span>Geen komende wedstrijden gevonden.</span>";

    wedstrijddatum.innerHTML = `<span>Aanvangsuur: ${eerstvolgendeWedstrijd.Aanvangsuur}</span>`

    wedstrijduur.innerHTML = `<span>Aanvangsuur: ${eerstvolgendeWedstrijd.Aanvangsuur}</span>`
  })
  .catch(error => console.error("Fout bij het ophalen van gegevens:", error));

// Functie om de huidige datum in het juiste formaat te krijgen (bijvoorbeeld "16/09/2023")
function getCurrentDate() {
  const today = new Date();
  const day = today.getDate();
  const month = today.getMonth() + 1; // Maanden beginnen bij 0
  const year = today.getFullYear();

  return `${day}/${month}/${year}`;
}
