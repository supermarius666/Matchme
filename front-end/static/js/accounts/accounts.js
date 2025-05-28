const loginCard = document.getElementById('login-card');
const registrationCard = document.getElementById('registration-card');
const toggleToRegistrationLink = document.getElementById('toggle-to-registration');
const toggleToLoginLink = document.getElementById('toggle-to-login');

toggleToRegistrationLink.addEventListener('click', (e) => {
  // e.preventDefault();
  loginCard.style.display = 'none';
  registrationCard.style.display = 'block';
  toggleToRegistrationLink.style.display = 'none';
  toggleToLoginLink.style.display = 'inline';
});

toggleToLoginLink.addEventListener('click', (e) => {
  // e.preventDefault();
  registrationCard.style.display = 'none';
  loginCard.style.display = 'block';
  toggleToLoginLink.style.display = 'none';
  toggleToRegistrationLink.style.display = 'inline';
});


/* nascodi o meno la password */
document.getElementById('toggle-password').addEventListener('click', function () {
  const pwd = document.getElementById('login-password');
  pwd.type = pwd.type === 'password' ? 'text' : 'password';
  this.classList.toggle('fa-eye-slash');
});



