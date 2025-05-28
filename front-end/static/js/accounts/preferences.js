// selezione checkbox
document.querySelectorAll('input[name="interested_in"]').forEach(checkbox => {
  const label = checkbox.parentElement;
  label.addEventListener('click', e => {
    e.preventDefault();
    checkbox.checked = !checkbox.checked;
    label.classList.toggle('selected', checkbox.checked);
  });
  if (checkbox.checked) {
    label.classList.add('selected');
  }
});

// contatore caratteri bio
const bio = document.getElementById('bio');
const charCount = document.getElementById('charCount');

bio.addEventListener('input', () => {
  charCount.textContent = `${bio.value.length} / 255`;
});