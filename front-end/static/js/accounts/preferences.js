document.addEventListener('DOMContentLoaded', function() {
    const preferenceLabels = document.querySelectorAll('.preference-options label');

    preferenceLabels.forEach(label => {
        const checkbox = label.querySelector('input[type="checkbox"]');
        
        if (checkbox && checkbox.checked) {
            label.classList.add('selected');
        }

        label.addEventListener('click', function() {
            if (checkbox) {
                checkbox.checked = !checkbox.checked;
                label.classList.toggle('selected', checkbox.checked);
            }
        });

        if (checkbox) {
            checkbox.addEventListener('change', function() {
                label.classList.toggle('selected', this.checked);
            });
        }
    });

    const bioTextarea = document.getElementById('bio');
    const charCountDisplay = document.getElementById('charCount');
    const maxLength = bioTextarea.getAttribute('maxlength');

    if (bioTextarea && charCountDisplay) {
        charCountDisplay.textContent = `${bioTextarea.value.length} / ${maxLength}`;

        bioTextarea.addEventListener('input', function() {
            const currentLength = this.value.length;
            charCountDisplay.textContent = `${currentLength} / ${maxLength}`;

            if (currentLength > maxLength) {
                this.value = this.value.substring(0, maxLength);
                charCountDisplay.textContent = `${maxLength} / ${maxLength}`;
            }
        });
    }
});