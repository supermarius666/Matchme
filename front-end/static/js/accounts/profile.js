document.addEventListener('DOMContentLoaded', () => {
    const bioTextarea = document.getElementById('bio-textarea');
    const editBioBtn = document.getElementById('edit-bio-btn');
    const saveBioUrl = editBioBtn ? editBioBtn.dataset.saveUrl : null;

    if (bioTextarea && editBioBtn) {
        if (bioTextarea.hasAttribute('readonly')) {
            bioTextarea.style.backgroundColor = '#f0f2f5';
            bioTextarea.style.borderColor = 'transparent';
        } else {
            bioTextarea.style.backgroundColor = 'white';
            bioTextarea.style.borderColor = '#dadde1';
        }

        editBioBtn.addEventListener('click', () => {
            if (bioTextarea.hasAttribute('readonly')) {
                bioTextarea.removeAttribute('readonly');
                bioTextarea.focus();
                editBioBtn.textContent = 'Salva';
                editBioBtn.style.backgroundColor = '#1877f2';
                editBioBtn.style.color = 'white';
                bioTextarea.style.backgroundColor = 'white';
                bioTextarea.style.borderColor = '#1877f2';
            } else {
                const newBio = bioTextarea.value;
                bioTextarea.setAttribute('readonly', true);
                editBioBtn.textContent = 'Modifica';
                editBioBtn.style.backgroundColor = '#e4e6eb';
                editBioBtn.style.color = '#050505';
                bioTextarea.style.backgroundColor = '#f0f2f5';
                bioTextarea.style.borderColor = 'transparent';

                if (saveBioUrl) {
                    fetch(saveBioUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRFToken': getCookie('csrftoken')
                        },
                        body: JSON.stringify({ bio: newBio })
                    })
                        .then(response => {
                            if (!response.ok) {
                                console.error('Error saving bio:', response.statusText);
                            }
                            return response.json();
                        })
                        .then(data => {
                            console.log('Bio saved:', data);
                        })
                        .catch(error => {
                            console.error('Fetch error:', error);
                        });
                } else {
                    console.warn("Save URL not provided for bio.");
                }
            }
        });
    }

    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            button.classList.add('active');

            const targetTab = button.dataset.tab;
            document.getElementById(targetTab).classList.add('active');
        });
    });

    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.startsWith(name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    const premiumIcon = document.querySelector('.upgrade-card .trophy-icon');
    if (premiumIcon) {
        premiumIcon.src = "{% static 'img/premium_icon.png' %}";
    }
});