const searchInput = document.getElementById("search-bar")
const chatsDiv = document.getElementById("chats")

function fetchSearchOutput() {
    // url che passa il parametro senza encoding per i query parameter
    //const url = `/feed/search_chat/${searchInput.value}`;

    // url che passa il parametro come query parameter (richiesta AJAX)
    // viene inviato il contenuto dell'input
    const url = `/feed/search_chat/?q=${encodeURIComponent(searchInput.value)}`;

    // fa request GET all'url
    fetch(url, {
        method: 'GET'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        displayOutput(data.searched_users)
    })
}

// aggiunge users al div delle chat
function displayOutput(users) {
    chatsDiv.innerHTML = ""

    const profile_pic = "{% if user.profile_picture %}{{ user.profile_picture.url }}{% else %}{% static 'img/default.jpg' %}{% endif %}"

    if (users.length > 0) {
        console.log(users);
        users.forEach(user => {
            chatsDiv.innerHTML += `
                <div class="chat-item" onclick="enterChat('${user[0]}')">
                    <div class="chat-avatar">
                        <img class="chat-avatar" src="${user[1]}" alt="Foto Profilo"> 
                    </div>

                    <div class="chat-info">
                        <div class="chat-name">${user[0]}</div>
                    </div>
                    <div class="chat-timestamp">${user[2]}</div>
                </div>
            `
        })
    }
}

searchInput.addEventListener("input", fetchSearchOutput)

if (document.title.includes("Chat")) {
    const sendButton = document.getElementById("send-button")
    sendButton.addEventListener('click', fetchSearchOutput)
}

// Initial update for all sliders when the page loads
document.addEventListener('DOMContentLoaded', () => {
    fetchSearchOutput();
});