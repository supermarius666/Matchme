const profilePicContainer = document.getElementById('profile-pic-container');
const profilePic = document.getElementById('profile-pic');
const imageUpload = document.getElementById('image-upload');
const defaultAvatarSrc = profilePic.src;

profilePicContainer.addEventListener('click', () => {
    imageUpload.click();
});

imageUpload.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
            profilePic.src = e.target.result;
           
        };
        reader.readAsDataURL(file);
    } else {
        alert('Per favore, seleziona un file immagine valido (es. JPG, PNG).');
        imageUpload.value = ''; 
        profilePic.src = defaultAvatarSrc; 
        
    }
});