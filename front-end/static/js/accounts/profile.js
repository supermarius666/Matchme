document.addEventListener('DOMContentLoaded', () => {
    // Gestione Foto Cover
    const coverPhotoSection = document.querySelector('.cover-photo-section');
    const editCoverBtn = document.querySelector('.edit-cover-btn');
    const coverUploadInput = document.getElementById('cover-upload');
    const coverImage = document.querySelector('.cover-image');
    const coverPlaceholder = document.querySelector('.cover-placeholder');

    if (editCoverBtn && coverUploadInput) {
        editCoverBtn.addEventListener('click', () => {
            coverUploadInput.click();
        });

        coverUploadInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file && file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    if (coverImage) {
                        coverImage.src = e.target.result;
                    } else if (coverPlaceholder && coverPhotoSection) {
                        // Se c'è un placeholder, lo sostituiamo con l'immagine
                        const newImg = document.createElement('img');
                        newImg.src = e.target.result;
                        newImg.className = 'cover-image'; // Applica le stesse classi
                        coverPhotoSection.innerHTML = ''; // Rimuovi il placeholder
                        coverPhotoSection.appendChild(newImg); // Aggiungi la nuova immagine
                    }
                    // Qui potresti anche attivare un salvataggio automatico o un pulsante "Salva"
                };
                reader.readAsDataURL(file);
            } else {
                alert('Per favore, seleziona un file immagine per la copertina.');
                coverUploadInput.value = ''; // Resetta l'input
            }
        });
    }

    // Gestione Foto Profilo (Avatar)
    const profileAvatarContainer = document.querySelector('.profile-avatar-container');
    const editAvatarBtn = document.querySelector('.edit-avatar-btn');
    const avatarUploadInput = document.getElementById('avatar-upload');
    const profileAvatar = document.querySelector('.profile-avatar');

    if (editAvatarBtn && avatarUploadInput) {
        editAvatarBtn.addEventListener('click', () => {
            avatarUploadInput.click();
        });

        avatarUploadInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file && file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    profileAvatar.src = e.target.result;
                    // Qui potresti anche attivare un salvataggio automatico o un pulsante "Salva"
                };
                reader.readAsDataURL(file);
            } else {
                alert('Per favore, seleziona un file immagine per l\'avatar.');
                avatarUploadInput.value = '';
            }
        });
    }

    // Gestione Biografia (Modifica/Salva)
    const bioTextarea = document.getElementById('bio-textarea');
    const editBioBtn = document.getElementById('edit-bio-btn');

    if (bioTextarea && editBioBtn) {
        // Funzione per impostare la modalità di visualizzazione/modifica
        const setBioMode = (readonly) => {
            bioTextarea.readOnly = readonly;
            if (readonly) {
                editBioBtn.textContent = 'Modifica';
                editBioBtn.classList.remove('btn-save-bio'); // Rimuovi classe save se presente
                editBioBtn.classList.add('btn-edit-bio'); // Aggiungi classe edit
            } else {
                bioTextarea.focus();
                editBioBtn.textContent = 'Salva';
                editBioBtn.classList.remove('btn-edit-bio'); // Rimuovi classe edit
                editBioBtn.classList.add('btn-save-bio'); // Aggiungi classe save
            }
        };

        // Inizia in modalità solo lettura
        setBioMode(true);

        editBioBtn.addEventListener('click', () => {
            if (bioTextarea.readOnly) {
                // Passa alla modalità modifica
                setBioMode(false);
            } else {
                // Passa alla modalità salvataggio (e poi solo lettura)
                const newBio = bioTextarea.value;
                const saveUrl = editBioBtn.dataset.saveUrl; // Recupera l'URL di salvataggio

                // Esegui una richiesta AJAX per salvare la biografia
                fetch(saveUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': getCookie('csrftoken') // Funzione per ottenere il CSRF token
                    },
                    body: JSON.stringify({ bio: newBio })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        alert('Biografia salvata con successo!');
                        setBioMode(true); // Torna alla modalità solo lettura
                    } else {
                        alert('Errore durante il salvataggio: ' + data.message);
                    }
                })
                .catch(error => {
                    console.error('Errore AJAX:', error);
                    alert('Si è verificato un errore di rete.');
                });
            }
        });
    }

// Funzione per aggiornare il conteggio dei caratteri
    const updateCharCount = () => {
        if (charCountDisplay) {
            const currentLength = bioTextarea.value.length;
            charCountDisplay.textContent = `${currentLength}/${MAX_BIO_LENGTH}`;
            if (currentLength > MAX_BIO_LENGTH) {
                charCountDisplay.style.color = 'red'; // Colore rosso se si supera il limite
            } else {
                charCountDisplay.style.color = '#666'; // Colore normale
            }
        }
    };

    // Funzione helper per ottenere il CSRF token (necessario per Django POST)
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }


    // Gestione Tab
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    if (tabButtons.length > 0 && tabContents.length > 0) {
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Rimuovi 'active' da tutti i bottoni e contenuti
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));

                // Aggiungi 'active' al bottone cliccato
                button.classList.add('active');

                // Mostra il contenuto della tab corrispondente
                const targetTabId = button.dataset.tab;
                const targetTabContent = document.getElementById(targetTabId);
                if (targetTabContent) {
                    targetTabContent.classList.add('active');
                }
            });
        });

        // Attiva la tab iniziale (quella con la classe 'active' nell'HTML)
        // Se non c'è nessuna 'active' per default, attiva la prima
        let initialActiveTab = document.querySelector('.tab-button.active');
        if (!initialActiveTab && tabButtons.length > 0) {
            tabButtons[0].classList.add('active');
            tabContents[0].classList.add('active');
        }
    }
});