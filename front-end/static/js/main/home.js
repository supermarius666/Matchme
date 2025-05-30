let rcards = document.querySelectorAll(".rcard");
let lcards = document.querySelectorAll(".left .card");
let stackArea = document.querySelector(".stack-area");

function rotateCards(cards, pass) {
  if (pass === 0) { return; }
  let angle = 0;
  cards.forEach((card, index) => {
    if (card.classList.contains("away")) {
      card.style.transform = `translateY(-120vh) rotate(-48deg)`;
    } else {
      card.style.transform = `rotate(${angle}deg)`;
      angle -= 10;
      card.style.zIndex = cards.length - index;
    }
  });
}

function handleScroll(cards, pass) {
  let distance = window.innerHeight * 0.3;
  let topVal = stackArea.getBoundingClientRect().top;
  let index = Math.floor(-1 * (topVal / distance + 1));

  cards.forEach((card, i) => {
    if (i <= index) {
      card.classList.add("away");
    } else {
      card.classList.remove("away");
    }
  });
  rotateCards(cards, pass);
}

rotateCards(rcards, 1);


window.addEventListener("scroll", () => {
  handleScroll(rcards, 1);
  handleScroll(lcards, 0);
});

document.querySelectorAll('.left .card').forEach(card => {
  const randomDeg = (Math.random() * 12) - 4; // Rotazione tra -4 e 8 gradi
  card.style.setProperty('--rotation', `${randomDeg}deg`);
});

/* marquee */
gsap.registerPlugin(ScrollTrigger)
gsap.to("body", {
  backgroundColor: "black",
  scrollTrigger: {
    trigger: ".gallery-container",
    start: "top center",
    end: "50% center",
    toggleActions: "play reverse play reverse",
    scrub: false,
  }
});
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
})

function raf(time) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}

requestAnimationFrame(raf)

const tl = gsap.timeline({
  scrollTrigger: {
    trigger: '.mimg',
    scrub: true
  }
})
  .to('.mimg', {
    stagger: .2,
    y: -700,
    scrub: true
  })

let split = SplitText.create(".wavy-word", { type: "chars,words" });
gsap.to(split.chars, {
  y: "-10%",
  duration: 1,
  ease: "sine.inOut",
  stagger: {
    each: 0.04,
    repeat: -1,
    yoyo: true
  }
});