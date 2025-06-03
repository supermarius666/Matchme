// --- DOM Elements ---
const myProfileView = document.getElementById('my-profile-view');
const publicPreviewView = document.getElementById('public-preview-view');

const editProfileBtn = document.getElementById('edit-profile-btn');
const publicPreviewBtn = document.getElementById('public-preview-btn');

const bioTextarea = document.getElementById('bio-textarea');
const publicBioText = document.getElementById('public-bio-text');

const messageBox = document.getElementById('status-message-box');

const editAvatarBtn = document.querySelector('.edit-avatar-btn');
const avatarUploadInput = document.getElementById('avatar-upload');
const editCoverBtn = document.querySelector('.edit-cover-btn');
const coverUploadInput = document.getElementById('cover-upload');

const avatarOverlay = document.querySelector('.profile-avatar-container .avatar-overlay');
const coverOverlay = document.querySelector('.cover-photo-section .cover-overlay');

const csrfTokenInput = document.querySelector('input[name="csrfmiddlewaretoken"]');

const uploadUrl = '/accounts/update_profile/';

// variabili globali dove metteremo l'immagine caricata dal file explorer
let avatar_pic_file = null;
let cover_pic_file = null;

let currentView = 'myProfile';
let isEditingMode = false;

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

// toggle del tipo di pagina: (Anteprima Pubblica - Torna al Mio Profilo)
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

// logica di togglig: toggla isEditingMode e rende modificabili foto/textArea in base allo stato in cui si trova
function toggleEditMode(enable) {
    isEditingMode = enable;
    
    if (isEditingMode)
        showMessage('Modalità modifica attivata. Clicca sulle aree per modificare.', 'info');

    console.log("toggleEditMode: ${isEditingMode}");

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
}

async function editProfileHandler() {
    // ModificaProfilo/SalvaModifiche sono su lo stesso pulsante: quando si clicca si toggla lo stato di questa var (e la edit mode stessa)
    // click su ModificaProfilo --> isEditingMode = true
    // click su SalvaModifiche --> isEditingMode = false
    toggleEditMode(!isEditingMode);

    const newBio = bioTextarea.value.trim();

    if (newBio.length > bioTextarea.maxLength) {
        showMessage(`La biografia supera il limite di ${bioTextarea.maxLength} caratteri.`, 'error');
        return;
    }

    // Nella richiesta HTTP POST invieremo un oggetto FormData e non un JSON perchè è questa la convenzione per inviare immagini
    // (volendo possiamo mandare le immagini anche attraverso un json)
    const formData = new FormData();

    formData.append('bio', newBio);
    formData.append("profile_picture", avatar_pic_file);
    formData.append("cover_picture", cover_pic_file);

    // inseriamo il 'X-CSRFToken' nel body cosi non va messo come altro campo dell'header
    formData.append('csrfmiddlewaretoken', csrfTokenInput.value);

    // se si ha cliccato su Salva Modifiche (non si è più in EditingMode) si fetchano i dati a server
    if (!isEditingMode) {
        try {
            const response = await fetch(uploadUrl, {
                method: 'POST',
                body: formData 
            });

            if (!response.ok) throw new Error((await response.json()).message || 'Errore nel salvataggio.');

            // la response invece è in JSON
            const data = await response.json();
            
            // si risetta la textArea della Bio a readonly
            bioTextarea.setAttribute('readonly', true);
            
            // renderizza il messaggio di successo inviato nella response dal server
            showMessage(data.message, 'success');
            publicBioText.textContent = newBio;

            console.log("finito di inviare dati")
        } catch (error) {
            showMessage(error.message || 'Errore durante il salvataggio.', 'error');
        }
    }
}

async function handleImageUpload(event, imageType) {
    const fileInput = event.target;
    const file = fileInput.files[0];

    if (!file) return showMessage('Nessun file selezionato.', 'error');

    // oggetto per leggere file (per noi immagini) nel file explorer del pc
    const reader = new FileReader();
    reader.onload = (e) => {
        if (fileInput.id === 'avatar-upload') {
            document.querySelectorAll('.profile-avatar').forEach(img => img.src = e.target.result);
        } else if (fileInput.id === 'cover-upload') {
            document.querySelectorAll('.cover-image').forEach(img => img.src = e.target.result);
        }
    };
    reader.readAsDataURL(file);

    if (imageType == "avatar") {
        avatar_pic_file = file;
    }
    else if (imageType == "cover") {
        cover_pic_file = file;
    }
}

// --- DOM Ready ---
document.addEventListener('DOMContentLoaded', function () {
 

    editProfileBtn?.addEventListener('click', editProfileHandler);

    publicPreviewBtn?.addEventListener('click', () => {
        toggleView(currentView === 'myProfile' ? 'publicPreview' : 'myProfile');
    });

    editAvatarBtn?.addEventListener('click', () => {
        if (isEditingMode) avatarUploadInput?.click();
        else showMessage('Attiva la modalità di modifica per caricare le immagini.', 'info');
    });

    editCoverBtn?.addEventListener('click', () => {
        if (isEditingMode) coverUploadInput?.click();
        else showMessage('Attiva la modalità di modifica per caricare le immagini.', 'info');
    });

    // event listener degli input per inserire le immagini
    // per passargli parametri diversi ("avatar", "cover") contengono come handler un arrow function che chiama il vero handler
    avatarUploadInput?.addEventListener('change', (event) => handleImageUpload(event, 'avatar'));
    coverUploadInput?.addEventListener('change', (event) => handleImageUpload(event, 'cover'));

    // Setup iniziale
    toggleView('myProfile');
    avatarOverlay?.classList.remove('active');
    coverOverlay?.classList.remove('active');
});
