const items = [
  { id: 0, name: 'Loop Mania', image: 'loop_mania.png', rating: 1200 },
  { id: 1, name: 'Wooden Wonder', image: 'wooden_wonder.png', rating: 1200 },
  { id: 2, name: 'Sky Screamer', image: 'sky_screamer.png', rating: 1200 },
  { id: 3, name: 'Carnival Twister', image: 'carnival_twister.png', rating: 1200 },
  { id: 4, name: 'Cosmic Loop', image: 'cosmic_loop.png', rating: 1200 }
];

let ratings = JSON.parse(localStorage.getItem('ratings'));
if (!ratings || ratings.length !== items.length) {
  ratings = items.map(item => ({ id: item.id, rating: item.rating }));
}

function expectedScore(rA, rB) {
  return 1 / (1 + Math.pow(10, (rB - rA) / 400));
}

function updateElo(winnerIndex, loserIndex) {
  const Ra = ratings[winnerIndex].rating;
  const Rb = ratings[loserIndex].rating;
  const Ea = expectedScore(Ra, Rb);
  const Eb = 1 - Ea;
  const K = 32;
  ratings[winnerIndex].rating = Ra + K * (1 - Ea);
  ratings[loserIndex].rating = Rb + K * (0 - Eb);
}

function pickTwo() {
  let a = Math.floor(Math.random() * items.length);
  let b;
  do {
    b = Math.floor(Math.random() * items.length);
  } while (b === a);
  return [a, b];
}

function renderDuel() {
  const container = document.getElementById('duel-container');
  container.innerHTML = '';
  const [i1, i2] = pickTwo();
  const candidates = [items[i1], items[i2]];
  candidates.forEach((item, idx) => {
    const card = document.createElement('div');
    card.className = 'card';
    const img = document.createElement('img');
    img.src = item.image;
    img.alt = item.name;
    const title = document.createElement('h3');
    title.textContent = item.name;
    const button = document.createElement('button');
    button.textContent = 'Diese finde ich besser';
    button.addEventListener('click', () => {
      const winnerIndex = ratings.findIndex(r => r.id === item.id);
      const loserIndex = ratings.findIndex(r => r.id === candidates[1 - idx].id);
      updateElo(winnerIndex, loserIndex);
      localStorage.setItem('ratings', JSON.stringify(ratings));
      updateRanking();
      renderDuel();
    });
    card.appendChild(img);
    card.appendChild(title);
    card.appendChild(button);
    container.appendChild(card);
  });
}

function updateRanking() {
  const list = document.getElementById('ranking-list');
  list.innerHTML = '';
  const sorted = [...ratings].sort((a, b) => b.rating - a.rating);
  sorted.forEach(r => {
    const li = document.createElement('li');
    const nameSpan = document.createElement('span');
    nameSpan.textContent = items[r.id].name;
    const ratingSpan = document.createElement('span');
    ratingSpan.textContent = Math.round(r.rating);
    li.appendChild(nameSpan);
    li.appendChild(ratingSpan);
    list.appendChild(li);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  updateRanking();
  renderDuel();
});
