const regCityDisplayInput = document.getElementById("reg-city-display");
const regCityHiddenInput = document.getElementById("reg-city-hidden");   

if (regCityDisplayInput) {
    regCityDisplayInput.addEventListener('click', handleCityInputClick);
    regCityDisplayInput.addEventListener('focus', handleCityInputClick); 
} else {
    console.error("Errore: Impossibile trovare l'elemento #reg-city-display nel DOM.");
}

function handleCityInputClick() {
    if (!navigator.geolocation) {
        if (regCityDisplayInput) {
            regCityDisplayInput.value = "Geolocalizzazione non disponibile.";
        }
        return; 
    }
    
    getPosition();
}


function success(pos) {
    const lat = pos.coords.latitude;
    const lng = pos.coords.longitude;

    fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`)
        .then(response => response.json())
        .then(data => {
            const city = data.address.city || data.address.town || data.address.village || "Città non trovata";
            
            if (regCityDisplayInput) {
                regCityDisplayInput.value = city;
            }
            if (regCityHiddenInput) {
                regCityHiddenInput.value = city;
            }
        })
        .catch(error => {
            console.error("Errore nel reverse geocoding:", error);
            if (regCityDisplayInput) {
                regCityDisplayInput.value = "Errore nel recupero della città.";
            }
            if (regCityHiddenInput) {
                regCityHiddenInput.value = ""; 
            }
        });

    console.log("Posizione:", pos);
}

function error(err) {
    console.log(err);
    let message = "";
    if (err.code === 1) {
        message = "Permesso di geolocalizzazione negato.";
    } else {
        message = "Posizione non disponibile.";
    }
    if (regCityDisplayInput) {
        regCityDisplayInput.value = message;
    }
    if (regCityHiddenInput) {
        regCityHiddenInput.value = "";
    }
}

const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 10000,
}


function getPosition() {
    navigator.geolocation.getCurrentPosition(success, error, options);
}