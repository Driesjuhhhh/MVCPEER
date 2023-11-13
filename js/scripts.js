document.addEventListener("DOMContentLoaded", () => {
    console.log("Leuk dat je de code van deze website bekijkt!");
    console.log("Deze code is geschreven door Dries Bielen");
    console.log("https://www.driesbielen.be");
    console.log("Have a good time in inspector land");
    setCurrentYear();

    var darkmode = localStorage.getItem("darkmode");

    if (darkmode === "true") {
        document.body.classList.toggle("dark-mode-variables");
    }

    const darkModeButton = document.getElementById("darkmode-button");
    darkModeButton.addEventListener("click", handleDarkModeButtonClick);
});

function setCurrentYear() {
    var currentYear = new Date().getFullYear();
    var yearSpan = document.getElementById("year");
    if (yearSpan) {
        yearSpan.textContent = "© " + currentYear + " Mvc Peer";
    }
}

function handleDarkModeButtonClick() {
    const isDarkModeEnabled = localStorage.getItem("darkmode") === "true";

    // Toggle the dark mode CSS class
    document.body.classList.toggle("dark-mode-variables");

    // Update the "darkmode" value in localStorage
    localStorage.setItem("darkmode", !isDarkModeEnabled);

    darkMode.querySelector("span:nth-child(1)").classList.toggle("active");
    darkMode.querySelector("span:nth-child(2)").classList.toggle("active");
}