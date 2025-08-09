document.addEventListener('DOMContentLoaded', () => {
  renderTicTacBoard();
});

function enterSite() {
  document.getElementById("homepage").style.display = "none";
  document.getElementById("mainContent").style.display = "block";
  renderTicTacBoard();
}

const puzzles = [
  "What has hands but can’t clap? A clock.",
  "What has a head and a tail but no body? A coin.",
  "What gets wetter the more it dries? A towel."
];
const quotes = [
  "“Stay hungry, stay foolish.” – Steve Jobs",
  "“Believe you can and you're halfway there.” – Theodore Roosevelt",
  "“It always seems impossible until it's done.” – Nelson Mandela",
  "“Do one thing every day that scares you.” – Eleanor Roosevelt",
  "“Opportunities don't happen. You create them.” – Chris Grosser"
];

function showPuzzle() {
  document.getElementById('puzzle').textContent = puzzles[Math.floor(Math.random() * puzzles.length)];
}

function showQuote() {
  document.getElementById('quote').textContent = quotes[Math.floor(Math.random() * quotes.length)];
}

function playGame(userChoice) {
  const choices = ['rock', 'paper', 'scissors'];
  const emojis = { rock: '✊', paper: '✋', scissors: '✌️' };
  const computer = choices[Math.floor(Math.random() * choices.length)];
  document.getElementById('computerMove').textContent = emojis[computer];

  let result = "It's a tie!";
  if (
    (userChoice === 'rock' && computer === 'scissors') ||
    (userChoice === 'scissors' && computer === 'paper') ||
    (userChoice === 'paper' && computer === 'rock')
  ) {
    result = "You win!";
  } else if (userChoice !== computer) {
    result = "You lose!";
  }
  document.getElementById('rpsResult').textContent = result;
}

function launchFirework() {
  const canvas = document.getElementById("fireworkCanvas");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let particles = [];
  const gravity = 0.05;
  const origins = [
    [canvas.width / 2, canvas.height / 2],
    [0, 0], [canvas.width, 0],
    [0, canvas.height], [canvas.width, canvas.height],
    [canvas.width / 2, 0], [canvas.width / 2, canvas.height],
    [0, canvas.height / 2], [canvas.width, canvas.height / 2]
  ];

  origins.forEach(([x, y]) => {
    for (let i = 0; i < 50; i++) {
      const angle = Math.random() * 2 * Math.PI;
      const speed = Math.random() * 7 + 3;
      particles.push({
        x: x,
        y: y,
        dx: Math.cos(angle) * speed,
        dy: Math.sin(angle) * speed,
        radius: 2 + Math.random() * 3,
        alpha: 1,
        decay: 0.01 + Math.random() * 0.02,
        color: `hsl(${Math.random() * 360}, 100%, 60%)`
      });
    }
  });

  function animate() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.dx;
      p.y += p.dy;
      p.dy += gravity;
      p.alpha -= p.decay;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.fill();
    });
    particles = particles.filter(p => p.alpha > 0);
    if (particles.length > 0) {
      requestAnimationFrame(animate);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = 1;
    }
  }

  animate();
}

function startMemoryGame() {
  const emojis = ['🐶','🐱','🐰','🦊','🐻','🐼','🐸','🐵'];
  const board = document.getElementById('memoryBoard');
  let tiles = emojis.concat(emojis).sort(() => 0.5 - Math.random());
  board.innerHTML = '';
  let revealed = [];
  let matched = [];

  tiles.forEach((emoji) => {
    const tile = document.createElement('div');
    tile.className = 'tile';
    tile.dataset.emoji = emoji;
    tile.onclick = () => {
      if (tile.classList.contains('revealed') || revealed.length >= 2) return;
      tile.textContent = emoji;
      tile.classList.add('revealed');
      revealed.push(tile);

      if (revealed.length === 2) {
        const [first, second] = revealed;
        if (first.dataset.emoji === second.dataset.emoji) {
          matched.push(first, second);
          revealed = [];
          if (matched.length === tiles.length) {
            setTimeout(() => alert("🎉 You matched all pairs!"), 300);
          }
        } else {
          setTimeout(() => {
            first.textContent = '';
            second.textContent = '';
            first.classList.remove('revealed');
            second.classList.remove('revealed');
            revealed = [];
          }, 600);
        }
      }
    };
    board.appendChild(tile);
  });
}

let gameBoard = Array(9).fill('');
let currentPlayer = 'X';

function getGameMode() {
  const selected = document.querySelector('input[name="mode"]:checked');
  return selected && selected.value === '2' ? 'PvP' : 'PvC';
}

function renderTicTacBoard() {
  const board = document.getElementById('ticTacBoard');
  board.innerHTML = '';
  gameBoard.forEach((val, i) => {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.textContent = val;
    cell.onclick = () => handleTicTacMove(i);
    board.appendChild(cell);
  });
}

function handleTicTacMove(index) {
  if (gameBoard[index] || checkWinner()) return;
  gameBoard[index] = currentPlayer;
  renderTicTacBoard();

  const winner = checkWinner();
  if (winner) {
    document.getElementById('ticTacResult').textContent = `🎉 ${winner} wins!`;
    return;
  } else if (!gameBoard.includes('')) {
    document.getElementById('ticTacResult').textContent = "It's a draw!";
    return;
  }

  if (getGameMode() === 'PvC') {
    currentPlayer = 'O';
    setTimeout(() => {
      makeComputerMove();
      renderTicTacBoard();
      const winner = checkWinner();
      if (winner) {
        document.getElementById('ticTacResult').textContent = `🎉 ${winner} wins!`;
      } else if (!gameBoard.includes('')) {
        document.getElementById('ticTacResult').textContent = "It's a draw!";
      }
      currentPlayer = 'X';
    }, 500);
  } else {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  }
}

function makeComputerMove() {
  const empty = gameBoard.map((v, i) => v === '' ? i : null).filter(v => v !== null);
  const move = empty[Math.floor(Math.random() * empty.length)];
  if (move !== undefined) gameBoard[move] = 'O';
}

function checkWinner() {
  const wins = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  for (let [a,b,c] of wins) {
    if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
      return gameBoard[a];
    }
  }
  return null;
}

function resetTicTacToe() {
  gameBoard = Array(9).fill('');
  currentPlayer = 'X';
  document.getElementById('ticTacResult').textContent = '';
  renderTicTacBoard();
}
