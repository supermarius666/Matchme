document.addEventListener("DOMContentLoaded", () => {
  const faqs = [
    { q: "How do I create a profile?", a: "Tap sign-up, add info & photos." },
    { q: "Is the app free?", a: "Yes, with optional premium features." },
    { q: "Can I hide my profile?", a: "Go incognito in settings." },
    { q: "How do matches work?", a: "Both swipe right or tap heart." },
    { q: "Can I undo a swipe?", a: "Yes, with premium you can rewind." },
    { q: "Is my data secure?", a: "We encrypt your information." },
    { q: "How do I report someone?", a: "Use the three dots > Report." },
    { q: "Can I change my location?", a: "Yes, with premium access." },
    { q: "What is Boost?", a: "Top placement for 30 minutes." },
    { q: "How do I delete my account?", a: "Settings > Account > Delete." },
  ];

  const container = document.querySelector('.bubble-container');
  if (!container) {
    console.error("Missing .bubble-container element");
    return;
  }

  const placed = [];

  function isOverlapping(x, y, size) {
    return placed.some(pos => {
      const dx = pos.x - x;
      const dy = pos.y - y;
      return Math.sqrt(dx * dx + dy * dy) < (pos.size + size) / 2 + 8;
    });
  }

  function createBubble(faq, i) {
    const bubble = document.createElement("div");
    bubble.className = "bubble";
    bubble.innerText = faq.q;
    bubble.dataset.index = i;
    bubble.dataset.state = "question";

    const size = 100 + Math.random() * 40;
    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;

    const maxAttempts = 1000;
    let attempts = 0;
    let x, y;
    do {
      x = Math.random() * (container.clientWidth - size);
      y = Math.random() * (container.clientHeight - size);
      attempts++;
    } while (isOverlapping(x, y, size) && attempts < maxAttempts);

    bubble.style.position = "absolute";
    bubble.style.left = `${x}px`;
    bubble.style.top = `${y}px`;

    Draggable.create(bubble, {
      type: "x,y",
      bounds: container,
      inertia: true
    });
    placed.push({ x, y, size });

    animateBubble(bubble);

    // Toggle question/answer
    bubble.addEventListener("click", () => {
      const idx = parseInt(bubble.dataset.index);
      const isQ = bubble.dataset.state === "question";
      bubble.innerText = isQ ? faqs[idx].a : faqs[idx].q;
      bubble.dataset.state = isQ ? "answer" : "question";
    });

    container.appendChild(bubble);
  }

  function animateBubble(bubble) {
    function move() {
      const size = bubble.offsetWidth;
      const maxX = container.clientWidth - size;
      const maxY = container.clientHeight - size;

      const newX = Math.random() * maxX;
      const newY = Math.random() * maxY;

      gsap.to(bubble, {
        left: newX,
        top: newY,
        duration: 10 + Math.random() * 6,
        ease: "sine.inOut",
        onComplete: move
      });
    }
    move();
  }

  function initBubbles() {
    container.innerHTML = "";
    placed.length = 0;
    faqs.forEach((faq, i) => createBubble(faq, i));
  }

  window.addEventListener("resize", () => {
    setTimeout(() => initBubbles(), 300);
  });

  initBubbles();
});