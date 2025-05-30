const profilePicContainer = document.getElementById('profile-pic-container');
const profilePic = document.getElementById('profile-pic');
const imageUpload = document.getElementById('image-upload');
const thumbPreview = document.getElementById('thumb-preview');
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
      thumbPreview.src = e.target.result;
      thumbPreview.style.display = "block";
    };
    reader.readAsDataURL(file);
  } else {
    alert('Per favore, seleziona un file immagine valido.');
    imageUpload.value = '';
    profilePic.src = defaultAvatarSrc;
    thumbPreview.style.display = "none";
  }
});
