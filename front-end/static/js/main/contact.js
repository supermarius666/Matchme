document.addEventListener('DOMContentLoaded', function() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const header = item.querySelector('.faq-header');
        const answer = item.querySelector('.faq-answer');
        const icon = header.querySelector('i');

        header.addEventListener('click', () => {
            const wasActive = item.classList.contains('active');

            faqItems.forEach(otherItem => {
                if (otherItem.classList.contains('active')) {
                    const otherAnswer = otherItem.querySelector('.faq-answer');
                    const otherIcon = otherItem.querySelector('.faq-header i');

                    otherItem.classList.remove('active');
                    otherAnswer.style.maxHeight = 0;
                    otherIcon.classList.remove('fa-minus');
                    otherIcon.classList.add('fa-plus');
                }
            });

            if (!wasActive) {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
                icon.classList.remove('fa-plus');
                icon.classList.add('fa-minus');
            }
        });
    });

    const bubbleContainer = document.getElementById('bubbleContainer');
    const bubbleTexts = [
        "Amore", "Passione", "Felicità", "Incontri", "Connessione",
        "Vita", "Amici", "Coppia", "Cuore", "Desiderio",
        "Sogni", "Viaggi", "Avventura", "Gioia"
    ];

    const numBubbles = 10;

    const placed = [];

    function isOverlapping(x, y, size) {
        return placed.some(pos => {
            const dx = pos.x - x;
            const dy = pos.y - y;
            return Math.sqrt(dx * dx + dy * dy) < (pos.size + size) / 2 + 8;
        });
    }

    function createBubble(text, i) {
        const bubble = document.createElement("div");
        bubble.className = "bubble";
        bubble.innerText = text;
        bubble.dataset.index = i;
        bubble.dataset.state = "question";

        const size = 100 + Math.random() * 40;
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;

        const maxAttempts = 1000;
        let attempts = 0;
        let x, y;
        do {
            const padding = 10;
            const containerWidth = bubbleContainer.clientWidth;
            const containerHeight = bubbleContainer.clientHeight;
            x = padding + Math.random() * (containerWidth - size - 2 * padding);
            y = padding + Math.random() * (containerHeight - size - 2 * padding);
            attempts++;
        } while (isOverlapping(x, y, size) && attempts < maxAttempts);

        bubble.style.position = "absolute";
        gsap.set(bubble, { x: x, y: y });

        Draggable.create(bubble, {
            type: "x,y",
            bounds: bubbleContainer,
            inertia: true
        });
        placed.push({ x, y, size });

        animateBubble(bubble);

        bubble.addEventListener("click", () => {
            console.log("Bubble clicked:", bubble.innerText);
        });

        bubbleContainer.appendChild(bubble);
    }

    function animateBubble(bubble) {
        function move() {
            const size = bubble.offsetWidth;
            const padding = 10;
            const containerWidth = bubbleContainer.clientWidth;
            const containerHeight = bubbleContainer.clientHeight;
            const maxX = containerWidth - size - padding;
            const maxY = containerHeight - size - padding;
            const newX = padding + Math.random() * maxX;
            const newY = padding + Math.random() * maxY;

            gsap.to(bubble, {
                x: newX,
                y: newY,
                duration: 10 + Math.random() * 6,
                ease: "sine.inOut",
                onComplete: move
            });
        }
        move();
    }

    function initBubbles() {
        if (!bubbleContainer) return;
        bubbleContainer.innerHTML = "";
        placed.length = 0;
        for (let i = 0; i < numBubbles; i++) {
            const randomText = bubbleTexts[Math.floor(Math.random() * bubbleTexts.length)];
            createBubble(randomText, i);
        }
    }

    window.addEventListener("resize", () => {
        setTimeout(() => initBubbles(), 300);
    });

    initBubbles();
});