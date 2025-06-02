document.addEventListener('DOMContentLoaded', function() {
    
    const preferenceLabels = document.querySelectorAll('.preference-options label');

    preferenceLabels.forEach(label => {
        const checkbox = label.querySelector('input[type="checkbox"]');
        
      
        if (checkbox && checkbox.checked) {
            label.classList.add('selected');
        }

        label.addEventListener('click', function() {
            if (checkbox) {
                // Inverti lo stato della checkbox
                checkbox.checked = !checkbox.checked;
                // Toggle la classe 'selected' sulla label
                label.classList.toggle('selected', checkbox.checked);
            }
        });

        // Opzionale: per gestire il caso in cui la checkbox venga cliccata direttamente
        // anche se abbiamo nascosto la display, è una buona pratica
        if (checkbox) {
            checkbox.addEventListener('change', function() {
                label.classList.toggle('selected', this.checked);
            });
        }
    });

    // Gestione del contatore caratteri della bio
    const bioTextarea = document.getElementById('bio');
    const charCountDisplay = document.getElementById('charCount');
    const maxLength = bioTextarea.getAttribute('maxlength');

    if (bioTextarea && charCountDisplay) {
        // Aggiorna il contatore all'inizio (es. se c'è testo preesistente)
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