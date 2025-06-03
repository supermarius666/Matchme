// fatto cosi per evitare i problemi su csrf

(function() {
    const photoUploadButton = document.getElementById('photo-upload-button');
    const imageUploadInput = document.getElementById('image-upload');
    const imagePreviewContainer = document.querySelector('.image-preview-container');
    const imagePreview = document.getElementById('image-preview');
    const removeImageButton = document.querySelector('.remove-image-button');
    const postButton = document.querySelector('.post-button');
    const postTextArea = document.getElementById('description');
    const postsFeed = document.getElementById('posts-feed');

    const vediPostBtns = document.querySelectorAll(".view-post-btn");
    
    // Questa csrfTokenInput è locale a questo file/scope
    const csrfTokenInput = document.querySelector('input[name="csrfmiddlewaretoken"]');
    let selectedImageFile = null;



     vediPostBtns.forEach(button => {
        button.addEventListener("click", function() {
            // Trova il div .post-item più vicino (il genitore che contiene tutto del singolo post)
            const postItem = this.closest('.post-item');

            // Trova l'immagine del post all'interno di questo post-item
            const postImage = postItem.querySelector('.post-image');
            const imageUrl = postImage ? postImage.src : null; // Set to null if no image, so it doesn't try to load an invalid URL
            const imageAlt = postImage ? postImage.alt : "Post Image";

            // Trova il div .post-details e il contenuto testuale
            const postDetails = postItem.querySelector('.post-details');
            const postContent = postDetails ? postDetails.querySelector('.post-content').textContent : "Nessun contenuto disponibile.";
            const postDate = postDetails ? postDetails.querySelector('.post-date').textContent : "";

            // Costruisci il contenuto HTML per la modale
            let modalHtml = '';
            if (imageUrl) { // Add the image tag only if an image URL exists
                modalHtml += `<img src="${imageUrl}" alt="${imageAlt}" style="max-width: 100%; height: auto; border-radius: 8px; margin-bottom: 15px;">`;
            }
            modalHtml += `<p>${postContent}</p>`;
            if (postDate) { // Add date only if it exists
                modalHtml += `<small>${postDate}</small>`;
            }

            // Apri l'alert di SweetAlert2 con i dettagli del post
            Swal.fire({
                title: 'Dettagli del Post',
                html: modalHtml, // Usa solo il tuo HTML personalizzato
                // Rimuovi imageUrl, imageWidth, imageHeight, imageAlt qui per evitare la doppia visualizzazione
                showCloseButton: true,
                showConfirmButton: false, // Nessun pulsante di conferma
                focusConfirm: false
            });
        });
    });



    photoUploadButton.addEventListener('click', () => {
        imageUploadInput.click();
    });

    imageUploadInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            selectedImageFile = file;
            const reader = new FileReader();

            reader.onload = (e) => {
                imagePreview.src = e.target.result;
                imagePreviewContainer.style.display = 'block';
                removeImageButton.style.display = 'flex';
            };
            reader.readAsDataURL(file);
        } else {
            imagePreviewContainer.style.display = 'none';
            removeImageButton.style.display = 'none';
            imagePreview.src = '#';
            selectedImageFile = null;
        }
    });

    removeImageButton.addEventListener('click', () => {
        imagePreviewContainer.style.display = 'none';
        removeImageButton.style.display = 'none';
        imagePreview.src = '#';
        imageUploadInput.value = '';
        selectedImageFile = null;
    });

    async function savePostHandler() {
        const post_text = postTextArea.value.trim();
        const formData = new FormData();
        formData.append('post_text', post_text);
        formData.append("post_picture", selectedImageFile);

        try {
            const response = await fetch("/feed/post/", {
                method: 'POST',
                headers: {
                    'X-CSRFToken': csrfTokenInput.value
                },
                body: formData
            });

            if (!response.ok) throw new Error((await response.json()).message || 'Errore nel salvataggio.');

            const data = await response.json();
            console.log("Post inviato con successo:", data);

            // Reset UI
            postTextArea.value = '';
            imagePreviewContainer.style.display = 'none';
            removeImageButton.style.display = 'none';
            imagePreview.src = '#';
            imageUploadInput.value = '';
            selectedImageFile = null;

        } catch (error) {
            console.log("Errore durante l'invio del post:", error);
        }
    }

    postButton.addEventListener("click", savePostHandler); // Correzione delle parentesi se non l'hai già fatta

})(); 