// Aggiungi questo codice in static/js/main/about.js
document.addEventListener('DOMContentLoaded', function() {
    // Esempio: Animazione all'apparizione delle sezioni
    const sections = document.querySelectorAll('.about-section');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in'); // Aggiungi una classe per l'animazione
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // Puoi aggiungere CSS per .fade-in nel tuo about.css
    // .fade-in {
    //    opacity: 0;
    //    transform: translateY(20px);
    //    transition: opacity 0.6s ease-out, transform 0.6s ease-out;
    // }
    // .fade-in.is-visible { /* Aggiungi questa classe quando la sezione è visibile */
    //    opacity: 1;
    //    transform: translateY(0);
    // }

    // Esempio: Smooth scroll per il link "La Nostra Storia"
    const smoothScrollLink = document.querySelector('.hero-content .btn-primary');
    if (smoothScrollLink) {
        smoothScrollLink.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            document.querySelector(targetId).scrollIntoView({
                behavior: 'smooth'
            });
        });
    }

});