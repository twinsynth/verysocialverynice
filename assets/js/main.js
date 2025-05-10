// Placeholder card data for demo (can be replaced by loading from external file)
const allCards = [
  { text: "Is happiness a choice?", topic: "mindbenders", color: "#4d3c97" },
  { text: "What’s your guilty pleasure show?", topic: "poptalk", color: "#ed4c67" },
  { text: "Traveling alone is more rewarding than with others.", topic: "wanderlust", color: "#118a7e" },
  { text: "Pineapple belongs on pizza.", topic: "forthelols", color: "#f78fb3" },
  { text: "People should be allowed to say anything online.", topic: "hottakes", color: "#c0392b" }
];

let selectedTopics = JSON.parse(localStorage.getItem("selectedTopics")) || [];
let deck = [];
let currentCardIndex = 0;

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function buildDeck() {
  deck = allCards.filter(card => selectedTopics.includes(card.topic));
  shuffle(deck);
  renderDeck();
}

function renderDeck() {
  const stack = document.getElementById("card-stack");
  stack.innerHTML = "";

  const visibleCards = deck.slice(currentCardIndex, currentCardIndex + 10);

  visibleCards.forEach((card, index) => {
    const cardEl = document.createElement("div");
    cardEl.className = "card";
    cardEl.style.zIndex = 100 - index;
    cardEl.style.top = `${index * 2}px`;
    cardEl.style.left = `${index * 2}px`;
    cardEl.style.backgroundColor = card.color;
    cardEl.innerHTML = `<div class="card-content">Tap to flip</div><div class="topic-label">${card.topic}</div>`;

    cardEl.addEventListener("click", () => {
      if (!cardEl.classList.contains("flipped")) {
        cardEl.classList.add("flipped");
        cardEl.innerHTML = `<div class="card-content">${card.text}</div><div class="topic-label">${card.topic}</div>`;
      } else {
        nextCard();
      }
    });

    addSwipeListener(cardEl);
    stack.appendChild(cardEl);
  });
}

function nextCard() {
  currentCardIndex++;
  if (currentCardIndex >= deck.length) {
    alert("You've gone through all the cards!");
    currentCardIndex = 0;
  }
  renderDeck();
}

function addSwipeListener(el) {
  let startX;

  el.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
  });

  el.addEventListener("touchend", (e) => {
    const diff = e.changedTouches[0].clientX - startX;
    if (Math.abs(diff) > 50) {
      nextCard();
    }
  });

  el.addEventListener("mousedown", (e) => {
    startX = e.clientX;
  });

  el.addEventListener("mouseup", (e) => {
    const diff = e.clientX - startX;
    if (Math.abs(diff) > 50) {
      nextCard();
    }
  });
}

// Init
if (document.getElementById("shuffle-button")) {
  document.getElementById("shuffle-button").addEventListener("click", () => {
    currentCardIndex = 0;
    shuffle(deck);
    renderDeck();
  });
}

if (document.getElementById("card-stack")) {
  buildDeck();
}
