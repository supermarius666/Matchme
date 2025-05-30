// NOTA: dal alcuni broswer si può settare la posizione

if (!navigator.geolocation) {
    throw new Error("No geolocation avaiable")
}

function success(pos) {
    const lat = pos.coords.latitude
    const lng = pos.coords.longitude

    // link ad un free mapping service (16 è lo zoom)
    const link_to_streetmap = `
        <a href="https://www.openstreetmap.org/#map=16/${lat}/${lng}">
            Your current position: latitude: ${lat}, longitude: ${lng}
        </a>
    `
    const coords = `lat: ${lat}, long: ${lng}`
    document.getElementById("geolocation").innerHTML += coords

    console.log(pos)
}

function error(err) {
    console.log(err)
    if (err.code === 1) {
        alert("Please allow access to geolocation")
    }
    else {
        alert("Position unavailable")
    }
}

const options = {
    enableHighAccuracy: true,

    // tempo in ms che aspetta per ricevere le coord
    timeout: 5000,

    // tempo max di vita di una posizione salvata in un cache server per accettarla 
    // mettendola a zero si richiede sempre la posizione al server principale 
    maximumAge: 10000,
}

// chiama l'API di geolocalizzazione:
// salva coordinate in un oggetto "pos" che passa alla funzione success()
// se la richiesta all'API non va a buon fine chiama error()
// viene chiamata quando si carica la pagina
navigator.geolocation.getCurrentPosition(success, error, options)

// fa stessa cosa ma viene chiamata ogni volta che lo user cambia posizione
//const id = navigator.geolocation.watchPosition(success, error, options)
