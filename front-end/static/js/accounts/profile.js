console.log("profile.js loaded and executing (for owner).");

// --- DOM Elements ---
const myProfileView = document.getElementById('my-profile-view');
const publicPreviewView = document.getElementById('public-preview-view');

const editProfileBtn = document.getElementById('edit-profile-btn');
const publicPreviewBtn = document.getElementById('public-preview-btn');

const bioTextarea = document.getElementById('bio-textarea');
const publicBioText = document.getElementById('public-bio-text'); // For public view bio
const editBioBtn = document.getElementById('edit-bio-btn');
const charCount = document.getElementById('char-count');

// Modificato per puntare al nuovo elemento per i messaggi di stato
const messageBox = document.getElementById('status-message-box'); 

const editAvatarBtn = document.querySelector('.edit-avatar-btn');
const avatarUploadInput = document.getElementById('avatar-upload');
const editCoverBtn = document.querySelector('.edit-cover-btn');
const coverUploadInput = document.getElementById('cover-upload');

const avatarOverlay = document.querySelector('.profile-avatar-container .avatar-overlay');
const coverOverlay = document.querySelector('.cover-photo-section .cover-overlay');

// Elemento aggiunto per passare l'URL di upload da Django
const profileDataContainer = document.getElementById('profile-data-container');
let uploadUrl = ''; // Verrà popolato da profileDataContainer.dataset.uploadUrl

// --- State Variables ---
let currentView = 'myProfile';
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
    if (!messageBox) { 
        console.error("MessageBox element (status-message-box) not found. Message:", message, type);
        alert(message);
        return;
    }
    messageBox.textContent = message;
    messageBox.classList.remove('hidden', 'bg-green-100', 'text-green-800', 'bg-red-100', 'text-red-800', 'bg-blue-100', 'text-blue-800');
    
    if (type === 'success') {
        messageBox.classList.add('bg-green-100', 'text-green-800');
    } else if (type === 'error') {
        messageBox.classList.add('bg-red-100', 'text-red-800');
    } else if (type === 'info') {
        messageBox.classList.add('bg-blue-100', 'text-blue-800');
    }
    messageBox.classList.remove('hidden');

    // Nasconde il messaggio dopo 3 secondi per successo e info
    if (type === 'success' || type === 'info') {
        setTimeout(() => {
            messageBox.classList.add('hidden');
        }, 3000);
    }
}

function updateCharCount() {
    if (bioTextarea && charCount) { 
        const currentLength = bioTextarea.value.length;
        const maxLength = bioTextarea.maxLength;
        charCount.textContent = `${currentLength}/${maxLength}`;
    }
}

// --- View Toggling Logic (Specific to owner) ---
function toggleView(viewName) {
    currentView = viewName;
    console.log("Toggling view to:", viewName);

    if (viewName === 'myProfile') {
        if (myProfileView) myProfileView.classList.remove('hidden');
        if (publicPreviewView) publicPreviewView.classList.add('hidden');
        if (editProfileBtn) editProfileBtn.classList.remove('hidden'); 
        if (publicPreviewBtn) publicPreviewBtn.textContent = 'Anteprima Pubblica';
        
        // Trigger the correct tab for "myProfile" view (from profile_tabs.js)
        const myProfileStatsTab = document.querySelector('#my-profile-view .tab-buttons .tab-button[data-tab="user-stats"]');
        if (myProfileStatsTab) {
            myProfileStatsTab.click();
        }

    } else if (viewName === 'publicPreview') {
        if (myProfileView) myProfileView.classList.add('hidden');
        if (publicPreviewView) publicPreviewView.classList.remove('hidden');
        if (editProfileBtn) editProfileBtn.classList.add('hidden'); 
        if (publicPreviewBtn) publicPreviewBtn.textContent = 'Torna al Mio Profilo';
        
        // Quando si va in anteprima pubblica, la modalità di modifica deve essere disattivata.
        if (isEditingMode) {
            toggleEditMode(false);
        }
        
        if (publicBioText && bioTextarea) {
            publicBioText.textContent = bioTextarea.value;
        }

        // Trigger the correct tab for "publicPreview" view (from profile_tabs.js)
        const publicPostsTab = document.querySelector('#public-preview-view .tab-buttons .tab-button[data-tab="public-user-posts"]');
        if (publicPostsTab) {
            publicPostsTab.click();
        }
    }
}

function toggleEditMode(enable) {
    isEditingMode = enable;
    console.log("Toggling edit mode to:", isEditingMode); 

    if (avatarOverlay) {
        if (isEditingMode) avatarOverlay.classList.add('active');
        else avatarOverlay.classList.remove('active');
    }
    if (coverOverlay) {
        if (isEditingMode) coverOverlay.classList.add('active');
        else coverOverlay.classList.remove('active');
    }

    if (bioTextarea) {
        if (isEditingMode) {
            bioTextarea.removeAttribute('readonly');
            bioTextarea.focus();
        } else {
            bioTextarea.setAttribute('readonly', true);
        }
    }

    if (editProfileBtn) {
        editProfileBtn.textContent = isEditingMode ? 'Salva Modifiche' : 'Modifica Profilo';
    }

    if (editBioBtn) {
        editBioBtn.textContent = isEditingMode ? 'Salva' : 'Modifica';
        if (isEditingMode) {
            editBioBtn.classList.remove('bg-blue-600');
            editBioBtn.classList.add('bg-green-600');
        } else {
            editBioBtn.classList.remove('bg-green-600');
            editBioBtn.classList.add('bg-blue-600');
        }
    }
}

// --- Event Listeners ---

document.addEventListener('DOMContentLoaded', function() {
    // Recupera l'URL di upload dal DOM
    if (profileDataContainer) {
        uploadUrl = profileDataContainer.dataset.uploadUrl;
        if (!uploadUrl) {
            console.error("Errore: l'URL di upload delle foto non è stato trovato nell'elemento profile-data-container.");
            showMessage("Impossibile caricare le foto: URL di upload mancante. Contatta il supporto.", "error");
        }
    } else {
        console.error("Errore: L'elemento '#profile-data-container' non è stato trovato. Impossibile ottenere l'URL di upload.");
        showMessage("Errore configurazione profilo. Impossibile caricare immagini.", "error");
    }

    // Main Profile / Public Preview buttons
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', () => {
            console.log("Edit Profile / Save Changes button clicked. isEditingMode before:", isEditingMode);
            if (isEditingMode) { 
                toggleEditMode(false); 
                showMessage('Modalità modifica disattivata.', 'info');
            } else { 
                toggleEditMode(true); 
                toggleView('myProfile'); // Assicurati di essere nella vista "Il Mio Profilo"
                showMessage('Modalità modifica attivata. Clicca sulle aree per modificare.', 'info');
            }
            console.log("isEditingMode after click:", isEditingMode);
        });
    }

    if (publicPreviewBtn) {
        publicPreviewBtn.addEventListener('click', () => {
            console.log("Public Preview / Back to My Profile button clicked. Current view:", currentView);
            if (currentView === 'myProfile') {
                toggleView('publicPreview');
            } else {
                toggleView('myProfile');
            }
        });
    }

    // Bio editing
    if (bioTextarea) {
        bioTextarea.addEventListener('input', updateCharCount);
    }

    if (editBioBtn) {
        editBioBtn.addEventListener('click', async () => {
            console.log('Bio Edit/Save button clicked!');
            if (editBioBtn.textContent.trim() === 'Modifica') {
                bioTextarea.removeAttribute('readonly');
                bioTextarea.focus();
                editBioBtn.textContent = 'Salva';
                editBioBtn.classList.remove('bg-blue-600');
                editBioBtn.classList.add('bg-green-600');
                if (messageBox) messageBox.classList.add('hidden'); 
            } else {
                const newBio = bioTextarea.value.trim();
                const saveUrl = editBioBtn.dataset.saveUrl; 

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
                if (messageBox) messageBox.classList.add('hidden');

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
                    if (publicBioText) {
                        publicBioText.textContent = newBio;
                    }
                } catch (error) {
                    console.error('Fetch error for bio:', error);
                    showMessage(error.message || 'Errore di rete o del server durante il salvataggio della biografia.', 'error');
                } finally {
                    editBioBtn.disabled = false;
                    if (editBioBtn.textContent === 'Salvataggio...') {
                        editBioBtn.textContent = 'Salva';
                    }
                }
            }
        });
    }

    // Image upload triggers
    if (editAvatarBtn) {
        editAvatarBtn.addEventListener('click', () => {
            console.log("Avatar edit button clicked. isEditingMode:", isEditingMode);
            if (isEditingMode && avatarUploadInput) {
                avatarUploadInput.click();
            } else { 
                showMessage('Attiva la modalità di modifica per caricare le immagini.', 'info');
            }
        });
    }

    if (editCoverBtn) {
        editCoverBtn.addEventListener('click', () => {
            console.log("Cover edit button clicked. isEditingMode:", isEditingMode);
            if (isEditingMode && coverUploadInput) {
                coverUploadInput.click();
            } else {
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

        if (!uploadUrl) { // Controllo aggiuntivo per l'URL di upload
            showMessage("Impossibile caricare l'immagine: URL di upload non disponibile.", "error");
            return;
        }

        const formData = new FormData();
        formData.append(fileInput.name, file);
        formData.append('csrfmiddlewaretoken', getCookie('csrftoken'));

        // Anteprima immediata dell'immagine selezionata
        const reader = new FileReader();
        reader.onload = (e) => {
            if (fileInput.id === 'avatar-upload') {
                document.querySelector('.profile-avatar').src = e.target.result;
                const publicAvatar = document.querySelector('#public-preview-view .profile-avatar');
                if (publicAvatar) publicAvatar.src = e.target.result;
            } else if (fileInput.id === 'cover-upload') {
                document.querySelector('.cover-image').src = e.target.result;
                const publicCover = document.querySelector('#public-preview-view .cover-image');
                if (publicCover) publicCover.src = e.target.result;
            }
        };
        reader.readAsDataURL(file);

        showMessage('Caricamento dell\'immagine in corso...', 'info');

        try {
            const response = await fetch(uploadUrl, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Errore del server durante il caricamento dell\'immagine.');
            }

            const data = await response.json();

            if (data.success) {
                showMessage(data.message, 'success');
                // Aggiorna l'immagine con l'URL definitivo dal server (se diverso dall'anteprima)
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

    // --- Initial Setup on Page Load (Only for owner) ---
    updateCharCount();
    toggleView('myProfile'); 
    // Assicurati che gli overlay siano nascosti inizialmente
    if (avatarOverlay) avatarOverlay.classList.remove('active');
    if (coverOverlay) coverOverlay.classList.remove('active');
});