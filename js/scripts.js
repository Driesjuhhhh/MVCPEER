document.addEventListener("DOMContentLoaded", () => {
  console.log("Leuk dat je de code van deze website bekijkt!");
  console.log("Deze code is geschreven door Dries Bielen");
  console.log("https://www.driesbielen.be");
  console.log("Have a good time in inspector land");
  setCurrentYear();



});

document.addEventListener('DOMContentLoaded', function() {
    var cookieAlert = document.querySelector('.cookiealert');
  
    if (cookieAlert) {
      window.addEventListener('scroll', function() {
        var scrollY = window.scrollY || window.pageYOffset;
  
        if (scrollY > 100) {
          cookieAlert.style.display = 'none';
        } 
      });
    }
  });
  

function setCurrentYear() {
  var currentYear = new Date().getFullYear();
  var yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = "© " + currentYear + " Mvc Peer";
  }
}
