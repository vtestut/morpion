let currentPlayer = 'x';
let scoreX = 0;
let scoreO = 0;
let boardState = Array(9).fill(null);
let isGameOver = false;
const gameBoard = document.getElementById('game-board');
const message = document.getElementById('message');
const displayXscore = document.getElementById('score-x');
const displayOscore = document.getElementById('score-o');

/* INIT ************************************************/

document.addEventListener('DOMContentLoaded', () => {
    const restartButton = document.getElementById('new-game-button');
    const rematchButton = document.getElementById('rematch-button');

    restartButton.addEventListener('click', startNewGame);
    rematchButton.addEventListener('click', startRematch);

    startNewGame();
});

function initBoard() {
    gameBoard.innerHTML = '';
    for (let i = 0; i < 9; i++) {
        const cellElement = document.createElement('div');
        cellElement.classList.add('cell');
        cellElement.dataset.index = i;

        cellElement.addEventListener('click', () => handleCellClick(i, cellElement));
        gameBoard.appendChild(cellElement);
    }
}

function startNewGame() {
    resetScore();
    resetGameState();
    initBoard();
    setRandomStartingPlayer();
}

function startRematch() {
    resetGameState();
    initBoard();
    setRandomStartingPlayer();
}

function setRandomStartingPlayer() {
    currentPlayer = Math.random() < 0.5 ? 'x' : 'o';
    message.textContent = `C'est au tour du joueur ${currentPlayer.toUpperCase()}`;
}

/* GESTION ******************************************/

function handleCellClick(index, cellElement) {
    if (isGameOver || !updateBoardState(index)) return;

    cellElement.classList.add(getCurrentPlayer());

    const winningCombination = checkWin();
    if (winningCombination) {
        endGame(winningCombination);
    } else if (isDraw()) {
        endDrawGame();
    } else {
        changePlayer();
        message.textContent = `C'est au tour du joueur ${getCurrentPlayer().toUpperCase()}`;
    }
}

function updateBoardState(index) {
    if (!boardState[index]) {
        boardState[index] = getCurrentPlayer();
        return true;
    }
    return false;
}

function checkWin() {
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // lignes
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // colonnes
        [0, 4, 8], [2, 4, 6]             // diagonales
    ];

    for (let combination of winningCombinations) {
        const [a, b, c] = combination;
        if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
            return combination;
        }
    }
    return null;
}

function isDraw() {
    return boardState.every(cell => cell !== null);
}

function endGame(winningCombination) {
    message.textContent = `Le joueur ${getCurrentPlayer().toUpperCase()} a gagné !`;
    updateScore();
    winningCells(winningCombination);
    isGameOver = true;
}

function endDrawGame() {
    message.textContent = "Match nul !";
    isGameOver = true;
}

function getCurrentPlayer() {
    return currentPlayer;
}

function changePlayer() {
    currentPlayer = currentPlayer === 'x' ? 'o' : 'x';
}

/* UTILS **************************************/

function winningCells(winningCombination) {
    winningCombination.forEach(index => {
        const cell = document.querySelector(`.cell[data-index="${index}"]`);
        cell.classList.add('winning-cell');
    });
}

function updateScore() {
    if (currentPlayer === 'x') {
        scoreX++;
        displayXscore.textContent = scoreX;
    } else {
        scoreO++;
        displayOscore.textContent = scoreO;
    }
}

function resetScore() {
    scoreX = 0;
    scoreO = 0;
    displayXscore.textContent = scoreX;
    displayOscore.textContent = scoreO;
}

function resetGameState() {
    boardState.fill(null);
    isGameOver = false;
}
