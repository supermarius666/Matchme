const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const explode = (element) => {
    const text = element.getAttribute('data-original').split('');
    element.innerText = '';

    text.forEach((value, index) => {
        const outer = document.createElement("span");
        outer.className = "outer";

        const inner = document.createElement("span");
        inner.className = "inner";
        inner.style.animationDelay = `${rand(-5000, 0)}ms`;

        const letter = document.createElement("span");
        letter.className = "letter";
        letter.innerText = value;
        letter.style.animationDelay = `${index * 100}ms`;

        inner.appendChild(letter);
        outer.appendChild(inner);
        element.appendChild(outer);
    });
};

// Effetto Hacked Text globale
const hackedText = (element) => {
    if (element.matches(':hover')) return; // Se il mouse è sopra, non glitchare

    const originalText = element.getAttribute('data-original');
    if (!originalText) return;

    let iterations = 0;
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    const interval = setInterval(() => {
        if (element.matches(':hover')) {
            clearInterval(interval); // Se il mouse entra, stop glitch
            return;
        }

        element.innerText = originalText
            .split('')
            .map((char, index) => 
                index < iterations ? char : chars[rand(0, chars.length - 1)]
            )
            .join('');

        if (iterations >= originalText.length) clearInterval(interval);
        iterations++;
    }, 300);
};

// Attivazione su tutti gli elementi
document.querySelectorAll('.word.fancy').forEach((element) => {
    element.setAttribute('data-original', element.innerText); // Salva testo originale

    element.addEventListener('mouseenter', () => explode(element));

    setInterval(() => hackedText(element), 4000); // Ogni 4 secondi glitcha
});