console.log("profile.js loaded and executing (for owner).");

// --- DOM Elements ---
const myProfileView = document.getElementById('my-profile-view');
const publicPreviewView = document.getElementById('public-preview-view');

const editProfileBtn = document.getElementById('edit-profile-btn');
const publicPreviewBtn = document.getElementById('public-preview-btn');

const bioTextarea = document.getElementById('bio-textarea');
const publicBioText = document.getElementById('public-bio-text');
const editBioBtn = document.getElementById('edit-bio-btn');
const charCount = document.getElementById('char-count');

const messageBox = document.getElementById('status-message-box');

const editAvatarBtn = document.querySelector('.edit-avatar-btn');
const avatarUploadInput = document.getElementById('avatar-upload');
const editCoverBtn = document.querySelector('.edit-cover-btn');
const coverUploadInput = document.getElementById('cover-upload');

const avatarOverlay = document.querySelector('.profile-avatar-container .avatar-overlay');
const coverOverlay = document.querySelector('.cover-photo-section .cover-overlay');

const profileDataContainer = document.getElementById('profile-data-container');
let uploadUrl = '';

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
    messageBox.className = '';
    messageBox.classList.add('status-message-box');

    if (type === 'success') {
        messageBox.classList.add('bg-green-100', 'text-green-800');
    } else if (type === 'error') {
        messageBox.classList.add('bg-red-100', 'text-red-800');
    } else if (type === 'info') {
        messageBox.classList.add('bg-blue-100', 'text-blue-800');
    }

    messageBox.classList.remove('hidden');
    if (type !== 'error') {
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

// --- View Toggle Logic ---
function toggleView(viewName) {
    currentView = viewName;

    if (viewName === 'myProfile') {
        myProfileView?.classList.remove('hidden');
        publicPreviewView?.classList.add('hidden');
        editProfileBtn?.classList.remove('hidden');
        publicPreviewBtn.textContent = 'Anteprima Pubblica';

        const myProfileStatsTab = document.querySelector('#my-profile-view .tab-buttons .tab-button[data-tab="user-stats"]');
        myProfileStatsTab?.click();
    } else {
        myProfileView?.classList.add('hidden');
        publicPreviewView?.classList.remove('hidden');
        editProfileBtn?.classList.add('hidden');
        publicPreviewBtn.textContent = 'Torna al Mio Profilo';

        if (isEditingMode) toggleEditMode(false);

        if (publicBioText && bioTextarea) {
            publicBioText.textContent = bioTextarea.value;
        }

        const publicPostsTab = document.querySelector('#public-preview-view .tab-buttons .tab-button[data-tab="public-user-posts"]');
        publicPostsTab?.click();
    }
}

function toggleEditMode(enable) {
    isEditingMode = enable;

    avatarOverlay?.classList.toggle('active', isEditingMode);
    coverOverlay?.classList.toggle('active', isEditingMode);

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
        editBioBtn.classList.toggle('bg-blue-600', !isEditingMode);
        editBioBtn.classList.toggle('bg-green-600', isEditingMode);
    }
}

// --- DOM Ready ---
document.addEventListener('DOMContentLoaded', function () {
    uploadUrl = profileDataContainer?.dataset.uploadUrl || '';
    if (!uploadUrl) {
        showMessage("Impossibile caricare le foto: URL di upload mancante.", "error");
    }

    editProfileBtn?.addEventListener('click', () => {
        toggleEditMode(!isEditingMode);
        if (!isEditingMode) toggleView('myProfile');
        showMessage(isEditingMode ? 'Modalità modifica attivata. Clicca sulle aree per modificare.' : 'Modalità modifica disattivata.', 'info');
    });

    publicPreviewBtn?.addEventListener('click', () => {
        toggleView(currentView === 'myProfile' ? 'publicPreview' : 'myProfile');
    });

    bioTextarea?.addEventListener('input', updateCharCount);

    editBioBtn?.addEventListener('click', async () => {
        if (editBioBtn.textContent.trim() === 'Modifica') {
            bioTextarea.removeAttribute('readonly');
            bioTextarea.focus();
            editBioBtn.textContent = 'Salva';
            editBioBtn.classList.replace('bg-blue-600', 'bg-green-600');
            messageBox?.classList.add('hidden');
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

            try {
                const response = await fetch(saveUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': getCookie('csrftoken')
                    },
                    body: JSON.stringify({ bio: newBio })
                });

                if (!response.ok) throw new Error((await response.json()).message || 'Errore nel salvataggio.');

                const data = await response.json();

                bioTextarea.setAttribute('readonly', true);
                editBioBtn.textContent = 'Modifica';
                editBioBtn.classList.replace('bg-green-600', 'bg-blue-600');
                showMessage(data.message, 'success');
                publicBioText.textContent = newBio;
            } catch (error) {
                showMessage(error.message || 'Errore durante il salvataggio.', 'error');
            } finally {
                editBioBtn.disabled = false;
                if (editBioBtn.textContent === 'Salvataggio...') {
                    editBioBtn.textContent = 'Salva';
                }
            }
        }
    });

    editAvatarBtn?.addEventListener('click', () => {
        if (isEditingMode) avatarUploadInput?.click();
        else showMessage('Attiva la modalità di modifica per caricare le immagini.', 'info');
    });

    editCoverBtn?.addEventListener('click', () => {
        if (isEditingMode) coverUploadInput?.click();
        else showMessage('Attiva la modalità di modifica per caricare le immagini.', 'info');
    });

    async function handleImageUpload(event) {
        const fileInput = event.target;
        const file = fileInput.files[0];
        if (!file) return showMessage('Nessun file selezionato.', 'error');
        if (!uploadUrl) return showMessage('URL di upload mancante.', 'error');

        const reader = new FileReader();
        reader.onload = (e) => {
            if (fileInput.id === 'avatar-upload') {
                document.querySelectorAll('.profile-avatar').forEach(img => img.src = e.target.result);
            } else if (fileInput.id === 'cover-upload') {
                document.querySelectorAll('.cover-image').forEach(img => img.src = e.target.result);
            }
        };
        reader.readAsDataURL(file);

        const formData = new FormData();
        formData.append(fileInput.name, file);
        formData.append('csrfmiddlewaretoken', getCookie('csrftoken'));

        showMessage('Caricamento in corso...', 'info');

        try {
            const response = await fetch(uploadUrl, { method: 'POST', body: formData });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message);

            if (fileInput.id === 'avatar-upload' && data.profile_picture_url) {
                document.querySelectorAll('.profile-avatar').forEach(img => img.src = data.profile_picture_url);
            } else if (fileInput.id === 'cover-upload' && data.cover_picture_url) {
                document.querySelectorAll('.cover-image').forEach(img => img.src = data.cover_picture_url);
            }

            showMessage(data.message || 'Immagine aggiornata.', 'success');
        } catch (error) {
            showMessage(error.message || 'Errore durante il caricamento.', 'error');
        }
    }

    avatarUploadInput?.addEventListener('change', handleImageUpload);
    coverUploadInput?.addEventListener('change', handleImageUpload);

    // Setup iniziale
    updateCharCount();
    toggleView('myProfile');
    avatarOverlay?.classList.remove('active');
    coverOverlay?.classList.remove('active');
});
