

(() => {
  // Elements
  const boardEl = document.getElementById('board');
  const statusEl = document.getElementById('gameStatus');
  const resetBtn = document.getElementById('resetBtn');
  const undoBtn = document.getElementById('undoBtn');

  // Game state
  const WIN_COMBOS = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  let board = Array(9).fill('');    // '', 'X', or 'O'
  let currentPlayer = 'X';
  let gameActive = true;
  let history = []; // stack of moves for undo: {index, player}
let scoreX = 0;
let scoreO = 0;
let scoreDraw = 0;

const scoreXEl = document.getElementById('scoreX');
const scoreOEl = document.getElementById('scoreO');
const scoreDrawEl = document.getElementById('scoreDraw');

function updateScores() {
  scoreXEl.textContent = scoreX;
  scoreOEl.textContent = scoreO;
  scoreDrawEl.textContent = scoreDraw;
}

  // generate short beeps using WebAudio (no files)
  const AudioGen = (() => {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    function beep(freq=440, duration=0.06, type='sine', gain=0.12) {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = type;
      o.frequency.value = freq;
      g.gain.setValueAtTime(gain, ctx.currentTime);
      o.connect(g); g.connect(ctx.destination);
      o.start();
      o.stop(ctx.currentTime + duration);
    }
    return {
      move(){ beep(600, 0.05); },
      win(){ beep(880, 0.10); setTimeout(()=>beep(660,0.08), 90); },
      draw(){ beep(320, 0.12, 'triangle'); }
    };
  })();

  // Render the 3x3 board
  function renderBoard() {
    boardEl.innerHTML = '';
    for (let i = 0; i < 9; i++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      if (board[i] === 'X') cell.classList.add('x');
      if (board[i] === 'O') cell.classList.add('o');
      cell.setAttribute('role', 'button');
      cell.setAttribute('tabindex', '0');
      cell.setAttribute('data-index', String(i));
      cell.setAttribute('aria-label', `Cell ${i+1} ${board[i] ? 'occupied by ' + board[i] : 'empty'}`);
      cell.setAttribute('aria-disabled', String(!gameActive));
      cell.textContent = board[i];
      // Click handler
      cell.addEventListener('click', onCellActivate);
      // Keyboard handler (Enter or Space)
      cell.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
          e.preventDefault();
          onCellActivate.call(cell, e);
        }
      });
      boardEl.appendChild(cell);
    }
  }

  // Activate a cell (this === element if called via call)
  function onCellActivate(e) {
    if (!gameActive) return;
    const idx = Number(this.dataset.index);
    if (Number.isNaN(idx)) return;
    if (board[idx]) {
      // invalid move, flash status
      statusFlash('Cell already taken', 900);
      return;
    }
    makeMove(idx, currentPlayer);
  }

  // Make a move at index for player
  function makeMove(index, player) {
    if (!gameActive) return;
    board[index] = player;
    history.push({ index, player });
    AudioGen.move();
    // check end state
    const winner = checkWinner();
   if (winner) {
  gameActive = false;
  statusEl.className = 'status message-win';
  statusEl.textContent = `Player ${winner} wins!`;

  if (winner === 'X') scoreX++;
  else scoreO++;
  updateScores();

  highlightWinningCells(winner);
  AudioGen.win();
} else if (board.every(cell => cell !== '')) {
  gameActive = false;
  statusEl.className = 'status message-draw';
  statusEl.textContent = `Draw — no more moves`;

  scoreDraw++;
  updateScores();

  AudioGen.draw();
} 
     else {
      // continue
      currentPlayer = (player === 'X') ? 'O' : 'X';
      statusEl.className = 'status';
      statusEl.textContent = `Player ${currentPlayer}'s turn`;
    }
    renderBoard();
  }

  // Undo last move
  function undoLast() {
    if (!history.length || !gameActive) {
      statusFlash('No move to undo', 900);
      return;
    }
    const last = history.pop();
    board[last.index] = '';
    currentPlayer = last.player; 
    statusEl.className = 'status';
    statusEl.textContent = `Player ${currentPlayer}'s turn (undo)`;
    renderBoard();
  }

  // Reset the game
  function resetGame() {
    board = Array(9).fill('');
    currentPlayer = 'X';
    gameActive = true;
    history = [];
    statusEl.className = 'status';
    statusEl.textContent = `Player ${currentPlayer}'s turn`;
    clearHighlights();
    renderBoard();
  }

  // Check winner -> returns 'X'|'O'|null
  function checkWinner() {
    for (const combo of WIN_COMBOS) {
      const [a,b,c] = combo;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return null;
  }

  // Highlight winning cells 
  function highlightWinningCells(winner) {
    for (const combo of WIN_COMBOS) {
      const [a,b,c] = combo;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        // find the DOM cells and add attribute
        const cells = boardEl.querySelectorAll('.cell');
        [a,b,c].forEach(i => {
          const el = cells[i];
          if (el) {
            el.style.boxShadow = '0 10px 24px rgba(11,92,255,0.12), inset 0 -6px 18px rgba(0,0,0,0.06)';
            el.style.transform = 'scale(1.02)';
            el.setAttribute('aria-label', `Winning cell ${i+1}, ${winner}`);
          }
        });
        return;
      }
    }
  }

  function clearHighlights() {
    const cells = boardEl.querySelectorAll('.cell');
    cells.forEach(el => {
      el.style.boxShadow = '';
      el.style.transform = '';
    });
  }

  // for invalid moves
  let flashTimer = null;
  function statusFlash(text, ms=1000) {
    const prev = statusEl.textContent;
    statusEl.textContent = text;
    statusEl.style.opacity = '1';
    if (flashTimer) clearTimeout(flashTimer);
    flashTimer = setTimeout(()=> {
      // restore best known status
      if (!gameActive && checkWinner()) {
        statusEl.textContent = `Player ${checkWinner()} wins!`;
      } else if (!gameActive && board.every(c => c !== '')) {
        statusEl.textContent = 'Draw — no more moves';
      } else {
        statusEl.textContent = `Player ${currentPlayer}'s turn`;
      }
      flashTimer = null;
    }, ms);
  }

  // Setup initial board cells 
  function initBoardCells() {
    // create empty board 
    renderBoard();
  }

  // Add event listeners for reset & undo
  resetBtn?.addEventListener('click', resetGame);
  undoBtn?.addEventListener('click', undoLast);

  // Keyboard :pressing 'r' to reset, 'u' to undo
  window.addEventListener('keydown', (e) => {
    if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return; // don't capture typing
    if (e.key === 'r' || e.key === 'R') {
      resetGame();
    } else if (e.key === 'u' || e.key === 'U') {
      undoLast();
    }
  });

  // Initialize
  resetGame();
  initBoardCells();

})();
