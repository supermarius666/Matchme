let rcards = document.querySelectorAll(".rcard");
let lcards = document.querySelectorAll(".left .card");
let stackArea = document.querySelector(".stack-area");

function rotateCards(cards, pass) {
if (pass === 0) {return;}
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