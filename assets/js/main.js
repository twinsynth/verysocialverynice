// Dynamically load cards from topic JS modules
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

async function buildDeck() {
  deck = [];
  console.log("🧠 Selected topics:", selectedTopics);

  for (const topic of selectedTopics) {
    try {
      console.log(`📦 Attempting to load: ${topic}`);
      const module = await import(`cards/${topic}.js`);



      const topicData = module.default;

      const cards = topicData.cards.map((text, i) => ({
        id: `${topic}-${i}`,
        text,
        topic: topicData.topic,
        color: topicData.color
      }));

      console.log(`✅ Loaded ${cards.length} cards from ${topic}`);
      deck.push(...cards);
    } catch (err) {
      console.error(`❌ Failed to load topic: ${topic}`, err);
    }
  }

  console.log("🗂 Final deck:", deck);
  shuffle(deck);
  renderDeck();
}

function renderDeck() {
  const stack = document.getElementById("card-stack");
  stack.innerHTML = "";

  if (!deck.length) {
    stack.innerHTML = '<p style="color:red; text-align:center;">⚠️ No cards loaded.</p>';
    return;
  }

  const visibleCards = deck.slice(currentCardIndex, currentCardIndex + 10);

  visibleCards.forEach((card, index) => {
    const cardEl = document.createElement("div");
    cardEl.className = "card";
    cardEl.style.zIndex = 100 - index;
    cardEl.style.top = `${index * 2}px`;
    cardEl.style.left = `${index * 2}px`;

    const inner = document.createElement("div");
    inner.className = "card-inner";

    const front = document.createElement("div");
    front.className = "card-front";
    front.style.backgroundColor = card.color;
    front.textContent = "Tap to flip";

    const back = document.createElement("div");
    back.className = "card-back";
    back.innerHTML = `<div class="card-content">${card.text}</div><div class="topic-label">${card.topic}</div>`;

    inner.appendChild(front);
    inner.appendChild(back);
    cardEl.appendChild(inner);

    cardEl.addEventListener("click", () => {
      if (!cardEl.classList.contains("flipped")) {
        cardEl.classList.add("flipped");
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
    shuffle(deck); // endless + reshuffle
    currentCardIndex = 0;
  }
  renderDeck();
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

window.buildDeck = buildDeck;
