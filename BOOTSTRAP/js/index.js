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

    // Call the updateText function every second
    setInterval(updateText, 2000);
});
