form.addEventListener("submit", function(event) {
    event.preventDefault();
    const message = event.target.message.value.trim();

    if (message !== "") {
        // Invia al server
        chatSocket.send(JSON.stringify({
            "username": username,
            "message": message
        }));

        // Crea HTML del messaggio come già presente nel server
        const messages = document.getElementById("messages");
        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        const msgDiv = document.createElement("div");
        msgDiv.classList.add("message-container", "my-message");

        msgDiv.innerHTML = `
            <div class="message-bubble">
                <div class="message-text">${message}</div>
                <div class="message-timestamp">${timeString}</div>
            </div>
        `;

        messages.appendChild(msgDiv);
        messages.scrollTop = messages.scrollHeight;

        // Reset input
        form.reset();
    }
});
