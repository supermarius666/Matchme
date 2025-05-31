console.log("JavaScript script started execution.");

// --- DOM Elements ---
const myProfileView = document.getElementById('my-profile-view');
const publicPreviewView = document.getElementById('public-preview-view');

const editProfileBtn = document.getElementById('edit-profile-btn');
const publicPreviewBtn = document.getElementById('public-preview-btn');

const bioTextarea = document.getElementById('bio-textarea');
const publicBioText = document.getElementById('public-bio-text'); // For public view bio
const editBioBtn = document.getElementById('edit-bio-btn');
const charCount = document.getElementById('char-count');
const messageBox = document.getElementById('message-box');

const editAvatarBtn = document.querySelector('.edit-avatar-btn');
const avatarUploadInput = document.getElementById('avatar-upload');
const editCoverBtn = document.querySelector('.edit-cover-btn');
const coverUploadInput = document.getElementById('cover-upload');

const avatarOverlay = document.querySelector('.profile-avatar-container .avatar-overlay');
const coverOverlay = document.querySelector('.cover-photo-section .cover-overlay');

// --- State Variables ---
let currentView = 'myProfile'; // 'myProfile' or 'publicPreview'
let isEditingMode = false;

// --- Utility Functions ---
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.startsWith(name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function showMessage(message, type) {
    messageBox.textContent = message;
    messageBox.classList.remove('hidden', 'bg-green-100', 'text-green-800', 'bg-red-100', 'text-red-800', 'bg-blue-100', 'text-blue-800'); // Added bg-blue-100/text-blue-800 for 'info'
    if (type === 'success') {
        messageBox.classList.add('bg-green-100', 'text-green-800');
    } else if (type === 'error') {
        messageBox.classList.add('bg-red-100', 'text-red-800');
    } else if (type === 'info') { // New type for informational messages
        messageBox.classList.add('bg-blue-100', 'text-blue-800');
    }
    messageBox.classList.remove('hidden');

    // Only hide success/info messages automatically
    if (type === 'success' || type === 'info') {
        console.log('Attempting to hide message box in 3 seconds...');
        setTimeout(() => {
            console.log('Inside setTimeout callback. Hiding message box.');
            messageBox.classList.add('hidden');
        }, 3000);
    }
}

function updateCharCount() {
    if (bioTextarea) {
        const currentLength = bioTextarea.value.length;
        const maxLength = bioTextarea.maxLength;
        charCount.textContent = `${currentLength}/${maxLength}`;
    }
}

// --- View Toggling Logic ---
function toggleView(viewName) {
    currentView = viewName;

    if (viewName === 'myProfile') {
        myProfileView.classList.remove('hidden');
        publicPreviewView.classList.add('hidden');
        editProfileBtn.classList.remove('hidden'); // Show "Modifica Profilo"
        publicPreviewBtn.textContent = 'Anteprima Pubblica';
        toggleEditMode(false); // Ensure edit mode is off when returning to my profile
        // Reset tab to user-stats when returning to my profile view
        switchTab(document.querySelector('#my-profile-view .tab-buttons .tab-button[data-tab="user-stats"]'));
    } else if (viewName === 'publicPreview') {
        myProfileView.classList.add('hidden');
        publicPreviewView.classList.remove('hidden');
        editProfileBtn.classList.add('hidden'); // Hide "Modifica Profilo"
        publicPreviewBtn.textContent = 'Torna al Mio Profilo';
        toggleEditMode(false); // Ensure edit mode is off in public view
        // Update public bio text just in case it was edited
        if (publicBioText) {
            publicBioText.textContent = bioTextarea.value;
        }
        // Switch to public-user-posts tab in public view
        switchTab(document.querySelector('#public-preview-view .tab-buttons .tab-button[data-tab="public-user-posts"]'));
    }
}

function toggleEditMode(enable) {
    isEditingMode = enable;

    // Toggle edit overlays for profile and cover pictures
    if (avatarOverlay) {
        if (enable) avatarOverlay.classList.add('active');
        else avatarOverlay.classList.remove('active');
    }
    if (coverOverlay) {
        if (enable) coverOverlay.classList.add('active');
        else coverOverlay.classList.remove('active');
    }

    // Toggle bio textarea readonly state
    if (bioTextarea) {
        if (enable) {
            bioTextarea.removeAttribute('readonly');
            bioTextarea.focus();
        } else {
            bioTextarea.setAttribute('readonly', true);
        }
    }

    // Adjust "Modifica Profilo" button text
    if (editProfileBtn) {
        editProfileBtn.textContent = enable ? 'Salva Modifiche' : 'Modifica Profilo';
    }

    // Adjust "Modifica" button for biography
    if (editBioBtn) {
        editBioBtn.textContent = enable ? 'Salva' : 'Modifica';
        if (enable) {
            editBioBtn.classList.remove('bg-blue-600');
            editBioBtn.classList.add('bg-green-600');
        } else {
            editBioBtn.classList.remove('bg-green-600');
            editBioBtn.classList.add('bg-blue-600');
        }
    }
}

// --- Tab Switching Logic ---
function switchTab(clickedButton) {
    if (!clickedButton) return;

    const tabContainer = clickedButton.closest('.profile-tabs');
    if (!tabContainer) return;

    const tabButtons = tabContainer.querySelectorAll('.tab-button');
    const tabContents = tabContainer.querySelectorAll('.tab-content');
    const targetTabId = clickedButton.dataset.tab;

    tabButtons.forEach(button => button.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));

    clickedButton.classList.add('active');
    const targetContent = tabContainer.querySelector(`#${targetTabId}`);
    if (targetContent) {
        targetContent.classList.add('active');
    }
}

// --- Event Listeners ---

// Main Profile / Public Preview buttons
if (editProfileBtn) {
    editProfileBtn.addEventListener('click', () => {
        if (isEditingMode) {
            // In una configurazione più complessa, qui potresti voler salvare
            // tutte le modifiche (bio, immagini, etc.) con una singola chiamata AJAX.
            // Per ora, l'upload delle immagini avviene al momento della selezione
            // e il salvataggio della bio ha un suo pulsante.
            toggleEditMode(false); // Esce dalla modalità di modifica
            showMessage('Modalità modifica disattivata.', 'info'); // Messaggio più neutro
        } else {
            toggleEditMode(true); // Entra in modalità modifica
            toggleView('myProfile'); // Assicurati di essere nella vista "Il Mio Profilo"
            showMessage('Modalità modifica attivata.', 'info');
        }
    });
}

if (publicPreviewBtn) {
    publicPreviewBtn.addEventListener('click', () => {
        if (currentView === 'myProfile') {
            toggleView('publicPreview');
        } else {
            toggleView('myProfile');
        }
    });
}

// Bio editing (existing logic, slightly adapted)
if (bioTextarea) {
    bioTextarea.addEventListener('input', updateCharCount);
}

if (editBioBtn) {
    editBioBtn.addEventListener('click', async () => {
        console.log('Bio Edit/Save button clicked!');
        console.log('Current bio button text (trimmed):', editBioBtn.textContent.trim());

        if (editBioBtn.textContent.trim() === 'Modifica') {
            // Switch to edit mode for bio
            bioTextarea.removeAttribute('readonly');
            bioTextarea.focus();
            editBioBtn.textContent = 'Salva';
            editBioBtn.classList.remove('bg-blue-600');
            editBioBtn.classList.add('bg-green-600');
            messageBox.classList.add('hidden');
        } else {
            // Switch to save mode for bio
            const newBio = bioTextarea.value.trim();
            // L'URL per salvare la bio dovrebbe essere passato tramite un attributo data-save-url
            // sul pulsante o essere definito globalmente se è sempre lo stesso.
            // Per questo esempio, assumiamo che 'editBioBtn.dataset.saveUrl' sia impostato nel template HTML.
            const saveUrl = editBioBtn.dataset.saveUrl; // Esempio: "{% url 'profile:save_bio' %}"

            if (!saveUrl) {
                showMessage('URL di salvataggio biografia non definito.', 'error');
                return;
            }

            if (newBio.length > bioTextarea.maxLength) {
                showMessage(`La biografia supera il limite di ${bioTextarea.maxLength} caratteri.`, 'error');
                return;
            }

            editBioBtn.textContent = 'Salvataggio...';
            editBioBtn.disabled = true;
            messageBox.classList.add('hidden');

            try {
                const response = await fetch(saveUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': getCookie('csrftoken')
                    },
                    body: JSON.stringify({ bio: newBio })
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Si è verificato un errore durante il salvataggio.');
                }

                const data = await response.json();

                bioTextarea.setAttribute('readonly', true);
                editBioBtn.textContent = 'Modifica';
                editBioBtn.classList.remove('bg-green-600');
                editBioBtn.classList.add('bg-blue-600');
                showMessage(data.message, 'success');
                // Update public bio text immediately after successful save
                if (publicBioText) {
                    publicBioText.textContent = newBio;
                }
            } catch (error) {
                console.error('Fetch error for bio:', error);
                showMessage(error.message || 'Errore di rete o del server durante il salvataggio della biografia.', 'error');
            } finally {
                editBioBtn.disabled = false;
                if (editBioBtn.textContent === 'Salvataggio...') {
                    editBioBtn.textContent = 'Salva'; // Reset button text if an error occurred during saving
                }
            }
        }
    });
}

// Image upload triggers
if (editAvatarBtn) {
    editAvatarBtn.addEventListener('click', () => {
        if (isEditingMode && avatarUploadInput) {
            avatarUploadInput.click(); // Trigger the hidden file input
        } else if (!isEditingMode) {
            showMessage('Attiva la modalità di modifica per caricare le immagini.', 'info');
        }
    });
}

if (editCoverBtn) {
    editCoverBtn.addEventListener('click', () => {
        if (isEditingMode && coverUploadInput) {
            coverUploadInput.click(); // Trigger the hidden file input
        } else if (!isEditingMode) {
            showMessage('Attiva la modalità di modifica per caricare le immagini.', 'info');
        }
    });
}

// Handle file selection and AJAX upload
async function handleImageUpload(event) {
    const fileInput = event.target;
    const file = fileInput.files[0];
    if (!file) {
        showMessage('Nessun file selezionato per il caricamento.', 'error');
        return;
    }

    const formData = new FormData();
    // Il nome dell'input file (es. 'avatar-upload' o 'cover-upload') deve corrispondere a quello atteso nella tua view Django.
    formData.append(fileInput.name, file);
    formData.append('csrfmiddlewaretoken', getCookie('csrftoken'));

    // Optional: Display a local preview of the selected image
    const reader = new FileReader();
    reader.onload = (e) => {
        if (fileInput.id === 'avatar-upload') {
            document.querySelector('.profile-avatar').src = e.target.result;
            // Aggiorna anche l'immagine nella vista pubblica, se esiste
            const publicAvatar = document.querySelector('#public-preview-view .profile-avatar');
            if (publicAvatar) publicAvatar.src = e.target.result;
        } else if (fileInput.id === 'cover-upload') {
            document.querySelector('.cover-image').src = e.target.result;
            // Aggiorna anche l'immagine nella vista pubblica, se esiste
            const publicCover = document.querySelector('#public-preview-view .cover-image');
            if (publicCover) publicCover.src = e.target.result;
        }
    };
    reader.readAsDataURL(file);

    // *** LOGICA DI UPLOAD AJAX AL SERVER DJANGO ***
    // Questo URL deve essere generato nel tuo template Django usando {% url 'nome_app:nome_view' %}
    // Assicurati che 'upload_photo' sia il nome della tua view in Django e 'profile' il namespace della tua app.
    const uploadUrl = "{% url 'profile:upload_photo' %}";

    showMessage('Caricamento dell\'immagine in corso...', 'info');

    try {
        const response = await fetch(uploadUrl, {
            method: 'POST',
            body: formData,
            // NON impostare l'header 'Content-Type' quando usi FormData; il browser lo imposta automaticamente.
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Errore del server durante il caricamento dell\'immagine.');
        }

        const data = await response.json();

        if (data.success) {
            showMessage(data.message, 'success');
            // Aggiorna l'attributo src delle immagini con l'URL definitivo restituito da Django
            // Questo è cruciale per visualizzare l'immagine salvata permanentemente sul server.
            if (fileInput.id === 'avatar-upload' && data.profile_picture_url) {
                document.querySelector('.profile-avatar').src = data.profile_picture_url;
                const publicAvatar = document.querySelector('#public-preview-view .profile-avatar');
                if (publicAvatar) publicAvatar.src = data.profile_picture_url;
            } else if (fileInput.id === 'cover-upload' && data.cover_picture_url) {
                document.querySelector('.cover-image').src = data.cover_picture_url;
                const publicCover = document.querySelector('#public-preview-view .cover-image');
                if (publicCover) publicCover.src = data.cover_picture_url;
            }
        } else {
            showMessage(data.message || 'Errore durante il caricamento dell\'immagine.', 'error');
        }
    } catch (error) {
        console.error('Upload error:', error);
        showMessage(error.message || 'Errore di rete o del server durante il caricamento dell\'immagine.', 'error');
    }
}

if (avatarUploadInput) {
    avatarUploadInput.addEventListener('change', handleImageUpload);
}
if (coverUploadInput) {
    coverUploadInput.addEventListener('change', handleImageUpload);
}

// Tab button event listeners (delegation for both myProfile and publicPreview tabs)
document.querySelectorAll('.profile-tabs .tab-buttons').forEach(tabButtonsContainer => {
    tabButtonsContainer.addEventListener('click', (event) => {
        const clickedButton = event.target.closest('.tab-button');
        if (clickedButton) {
            switchTab(clickedButton);
        }
    });
});


// --- Initial Setup on Page Load ---
window.onload = () => {
    updateCharCount();
    toggleView('myProfile'); // Start in my profile view
    // Ensure overlays are hidden initially
    if (avatarOverlay) avatarOverlay.classList.remove('active');
    if (coverOverlay) coverOverlay.classList.remove('active');
};