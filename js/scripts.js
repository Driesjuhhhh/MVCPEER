document.addEventListener("DOMContentLoaded", () => {

    var darkmode = localStorage.getItem('darkmode')

    if (darkmode != 'true'){
        document.body.classList.toggle('dark-mode-variables');
    }

    const darkModeButton = document.getElementById('darkmode-button');
    darkModeButton.addEventListener('click', handleDarkModeButtonClick);
})




// Function to handle the dark mode button click event
function handleDarkModeButtonClick() {
    const isDarkModeEnabled = localStorage.getItem('darkmode') === 'true';

    // Toggle the dark mode CSS class
    document.body.classList.toggle('dark-mode-variables');

    // Update the "darkmode" value in localStorage
    localStorage.setItem('darkmode', !isDarkModeEnabled);

    darkMode.querySelector('span:nth-child(1)').classList.toggle('active');
    darkMode.querySelector('span:nth-child(2)').classList.toggle('active');
}







