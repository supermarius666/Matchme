const searchInput = document.getElementById("search-bar")
    const chatsDiv = document.getElementById("chats")

    searchInput.addEventListener("input", function() {
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
    })

    // aggiunge users al div delle chat
    function displayOutput(users) {
        chatsDiv.innerHTML = ""

        if (users.length > 0) {
            users.forEach(username => {
                chatsDiv.innerHTML += `
                    <div class="chat-item" onclick="enterChat('${username}')">
                        <div class="chat-avatar">
                            <img class="chat-avatar" src="{% if user.profile_picture %}{{ user.profile_picture.url }}{% else %}{% static 'img/default.jpg' %}{% endif %}" alt="Foto Profilo"> 
                        </div>

                        <div class="chat-info">
                            <div class="chat-name">${username}</div>
                        </div>
                        <div class="chat-timestamp">02:01 TODO</div>
                        {# <a href="{% url 'chatroom' user.username %}" class="feed-start-chat-button">Chat</a> #}
                    </div>
                `
            })
        }
        // inutile mi sa tanto li prende anche sopra
        /*
        else {
            chatsDiv.innerHTML = `
                {% for user in matched_users %}
                    <div class="chat-item" onclick="enterChat('{{ user.username }}')">
                        <div class="chat-avatar">
                            <img class="chat-avatar" src="{% if user.profile_picture %}{{ user.profile_picture.url }}{% else %}{% static 'img/default.jpg' %}{% endif %}" alt="Foto Profilo"> 
                        </div>

                        <div class="chat-info">
                            <div class="chat-name">{{ user.username }}</div>
                        </div>
                        <div class="chat-timestamp">02:01 TODO</div>
                        {# <a href="{% url 'chatroom' user.username %}" class="feed-start-chat-button">Chat</a> #}
                    </div>
                {% endfor %}
            `
        }
        */
    }