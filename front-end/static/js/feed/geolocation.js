// TODO: API key del nostro account (da spostare da qui)
const apiKey = "dad12ae8e9df0544abcf80e33b6abecf";
const city = "Rome"

const data = getWeatherData(city)

// keyword async applicata a una funziona fa si che quando viene chiamata questa runnerà in modo asincrono rispetto al programma
// --> permette di fare eseguire la funzione in parallelo (concorrentemente) con l'esecuzione del programma
// Dentro le funzioni async si può usare la keyword await per bloccare un'istruzione finchè non ha terimato
// --> si bloccherà la funzione async (ad es. aspettando un'http response) ma non il programma
async function getWeatherData(city) {
    // 1. Chiama API di geolocalizzazione per trovare coordinate (latitudine, longitudine)
    const apiURL_1 = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=${5}&appid=${apiKey}`;
    const response_1 = await fetch(apiURL_1);

    if (!response_1.ok)
        throw new Error("Non riusciuto a fare fetch dei dati");

    // la response è un array di oggetti (prendo il primo)
    const data_1 = (await response_1.json())[0];
    // e poi lo destrutturo per poter accedere ai campi come variabili
    const {name, lat, lon} = data_1;

    console.log(data_1)

    return await data_1;
}