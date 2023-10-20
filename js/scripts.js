'use strict'

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
    const mobileDarkModeButton = document.getElementById("mobile-darkmode-button");
    mobileDarkModeButton.addEventListener("click", handleDarkModeButtonClick);
    darkModeButton.addEventListener("click", handleDarkModeButtonClick);
});

// Function to handle the dark mode button click event
function handleDarkModeButtonClick() {
    const isDarkModeEnabled = localStorage.getItem("darkmode") === "true";

    // Toggle the dark mode CSS class
    document.body.classList.toggle("dark-mode-variables");

    // Update the "darkmode" value in localStorage
    localStorage.setItem("darkmode", !isDarkModeEnabled);

    darkMode.querySelector("span:nth-child(1)").classList.toggle("active");
    darkMode.querySelector("span:nth-child(2)").classList.toggle("active");
}


function setCurrentYear() {
    var currentYear = new Date().getFullYear();
    var yearSpan = document.getElementById("year");
    if (yearSpan) {
        yearSpan.textContent = currentYear;
    }
}

function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
  }
  
  function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
  }
  