document.addEventListener("DOMContentLoaded", () => {
    const welcomeText = document.getElementById("welcomeText");
    let ellipsisCount = 0;

    // Function to update the text
    function updateText() {
        // If there are less than 3 ellipsis, add one
        if (ellipsisCount < 3) {
            welcomeText.textContent += ".";
            ellipsisCount++;
        } else {
            // If there are already 3 ellipsis, remove them
            welcomeText.textContent = "Welkom";
            ellipsisCount = 0;
        }
    }

    // Call the updateText function every 2 seconds
    setInterval(updateText, 2000);

    const toastLiveExample = document.getElementById('liveToast');
    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
    toastBootstrap.show();
});


function fetchNextMatch() {
    const url = "https://www.volleyadmin2.be/services/wedstrijden_xml.php?province_id=4&stamnummer=L-0923&format=json";

    // Selecteer de lijstitems waar je de informatie wilt weergeven
    const wedstrijdsporthal = document.querySelector(".volgendewedstrijd-sporthal");
    const wedstrijddatum = document.querySelector(".volgendewedstrijd-datum");
    const wedstrijduur = document.querySelector(".volgendewedstrijd-tijd");

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
        let location;
        if ("Sporthal de Deuster, Peer" == wedstrijd.SporthalNaam){
            location = true;
        } else {
            location = false;
        }

        if (!alreadyHappened && location) {
            futureDates.push(wedstrijd)
        }
    }

    return futureDates
}
