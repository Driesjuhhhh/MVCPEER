const url = "https://www.volleyadmin2.be/services/wedstrijden_xml.php?province_id=4&stamnummer=L-0923&seriesid=p1d&format=json";

// Select the list item where you want to display the information
const wedstrijdInfoElement = document.querySelector(".volgendewedstrijdpromo-1");

// Fetch data using Fetch API
fetch(url)
  .then(response => response.json())
  .then(data => {
    // Neem alleen de gegevens van de eerstvolgende wedstrijd
    const eerstvolgendeWedstrijd = data[0];

    // Update the innerHTML of the list item
    wedstrijdInfoElement.innerHTML = eerstvolgendeWedstrijd
      ? `<span>Sporthal: ${eerstvolgendeWedstrijd.SporthalNaam}, Aanvangsuur: ${eerstvolgendeWedstrijd.Aanvangsuur}</span>`
      : "<span>Geen komende wedstrijden gevonden.</span>";
  })
  .catch(error => console.error("Fout bij het ophalen van gegevens:", error));
