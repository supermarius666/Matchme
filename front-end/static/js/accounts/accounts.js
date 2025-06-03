// LOGIN / REGISTER TOGGLE

// Login HTML elements
const loginCard = document.getElementById('login-card');
const toggleToRegistrationLink = document.getElementById('toggle-to-registration');

const loginUsernameInput = document.getElementById('login-username');
const loginPassInput = document.getElementById('login-password');


// Register HTML elements
const registrationCard = document.getElementById('registration-card');
const toggleToLoginLink = document.getElementById('toggle-to-login');

const regUsernameInput = document.getElementById('reg-username');
const regNomeInput = document.getElementById('reg-nome');
const regCognomeInput = document.getElementById('reg-cognome');
const regDateInput = document.getElementById('reg-data-nascita');
const regCityInput = document.getElementById('reg-city-display');
const regGenderSelect = document.getElementById('reg-sesso');
const regMailSelect = document.getElementById('reg-email');
const regPasswordInput = document.getElementById('reg-password');
const regConfirmPassInput = document.getElementById('reg-conferma-password');

// csrf token
const csrfTokenInput = document.querySelector('input[name="csrfmiddlewaretoken"]');
const authUrl = "/accounts/auth_request/"
const redirectPreferencesUrl = "/accounts/preferences/"
const redirectHomeUrl = "/"


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

regDateInput.addEventListener('change', function() {
    const selectedDate = regDateInput.value;

    //console.log("Selected Date:", selectedDate);
});

document.getElementById('login-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const loginUsername = loginUsernameInput.value;
    const loginPass = loginPassInput.value;

    const errorMessage = document.getElementById("login-error-message")

    const payload = {
        type: "login",
        loginUsername: loginUsername,
        loginPassword : loginPass,
    };

    try {
        const response = await fetch(authUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfTokenInput.value
            },
            body: JSON.stringify(payload)
        });
        // .then(response => {
        //     console.log("FATTA RICHIESTA");
        //     if (!response.ok) {
        //         throw new Error(`HTTP error! status: ${response.status}`);
        //     }
        //     return response.json();
        // })
        // .then(data => {
        //     console.log(data)

        //     return data;
        // });

        if (!response.ok) throw new Error((await response.json()).message || 'Errore nel salvataggio.');

        // la response è in JSON
        const data_response = await response.json();
        //window.location.href = redirectUrl;

        if (data_response.success === true) {
            window.location.href = redirectHomeUrl;
        }
        else {
            errorMessage.innerHTML = `<div class="error-message">${data_response.message}</div>`
        }
    } catch (error) {
        throw new Error(await error.message || 'Errore nel salvataggio.');
    }
});

document.getElementById('registration-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const regUsername = regUsernameInput.value
    const regNome = regNomeInput.value
    const regCognome = regCognomeInput.value;
    const regBirthDate = regDateInput.value
    const regCity = regCityInput.value
    const regGender = regGenderSelect.value
    const regMail = regMailSelect.value
    const regPassword = regPasswordInput.value
    const regConfirmPass = regConfirmPassInput.value

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

    const errorMessage = document.getElementById("register-error-message")

    if (regPassword !== regConfirmPass) {
        errorMessage.innerHTML = `<div class="error-message">Le password non coincidono.</div>`
        event.preventDefault();
        return false;
    }
    else if (!passwordRegex.test(regPassword)) {
        errorMessage.innerHTML = `<div class="error-message">La password deve contenere almeno 8 caratteri, una lettera maiuscola, una minuscola e un numero.</div>`;
        event.preventDefault();
        return false;
    }
    else if (regBirthDate) {
        const today = new Date();
        const birthDate = new Date(regBirthDate);
        console.log("Selected Date!!!:", birthDate);
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        if (age < 18) {
            errorMessage.innerHTML = `<div class="error-message">Devi avere almeno 18 anni per registrarti.</div>`
            event.preventDefault();  // stop form submission
            return false;
        }
    }

    const payload = {
        type: "register",
        regUsername: regUsername,
        regNome : regNome,
        regCognome : regCognome,
        regBirthDate : regBirthDate,
        regCity : regCity,
        regGender : regGender,
        regMail : regMail,
        regPassword : regPassword,
        regConfirmPass : regConfirmPass,
    };

    try {
        console.log("PER FARE RICHIESTA");
        const response = await fetch(authUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfTokenInput.value
            },
            body: JSON.stringify(payload)
        });
        // .then(response => {
        //     console.log("FATTA RICHIESTA");
        //     if (!response.ok) {
        //         throw new Error(`HTTP error! status: ${response.status}`);
        //     }
        //     return response.json();
        // })
        // .then(data => {
        //     console.log(data)

        //     return data;
        // });

        if (!response.ok) throw new Error((await response.json()).message || 'Errore nel salvataggio.');

        // la response è in JSON
        const data_response = await response.json();
        //window.location.href = redirectUrl;

        if (data_response.success === true) {
            window.location.href = redirectPreferencesUrl;
        }
        else {
            errorMessage.innerHTML = `<div class="error-message">${data_response.message}</div>`
        }
    } catch (error) {
        throw new Error(await error.message || 'Errore nel salvataggio.');
    }
});
