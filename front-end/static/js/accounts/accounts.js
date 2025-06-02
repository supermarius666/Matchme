// LOGIN / REGISTER TOGGLE
const loginCard = document.getElementById('login-card');
const registrationCard = document.getElementById('registration-card');
const toggleToRegistrationLink = document.getElementById('toggle-to-registration');
const toggleToLoginLink = document.getElementById('toggle-to-login');

if (toggleToRegistrationLink && toggleToLoginLink) {
    toggleToRegistrationLink.addEventListener('click', () => {
        loginCard.style.display = 'none';
        registrationCard.style.display = 'block';
        toggleToRegistrationLink.style.display = 'none';
        toggleToLoginLink.style.display = 'inline';
    });

    toggleToLoginLink.addEventListener('click', () => {
        registrationCard.style.display = 'none';
        loginCard.style.display = 'block';
        toggleToLoginLink.style.display = 'none';
        toggleToRegistrationLink.style.display = 'inline';
    });
}


document.querySelectorAll('.password-toggle .fa-eye, .password-toggle .fa-eye-slash').forEach(icon => {
    icon.addEventListener('click', () => {
        // Trova l'input all'interno dello stesso form-group
        const input = icon.closest('.form-group').querySelector('input[type="password"], input[type="text"]');
        
        if (input) {
            input.type = input.type === 'password' ? 'text' : 'password';
            icon.classList.toggle('fa-eye');
            icon.classList.toggle('fa-eye-slash');
        }
    });
});