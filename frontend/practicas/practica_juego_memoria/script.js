// ---- ELEMENTOS DEL DOM ----
const gameBoard = document.querySelector('.memory-game');
const attemptsDisplay = document.getElementById('attempts');
const timerDisplay = document.getElementById('timer');
const restartButton = document.getElementById('restart-button');
const timeLimitInput = document.getElementById('time-limit');
const scoreDisplay = document.getElementById('score');
const finalScore = document.getElementById('final-score');

// Elementos del Modal
const modal = document.getElementById('victory-modal');
const modalTitle = document.getElementById('modal-title');
const modalMessage = document.getElementById('modal-message');
const finalTime = document.getElementById('final-time');
const finalAttempts = document.getElementById('final-attempts');
const modalRestartButton = document.getElementById('modal-restart-button');

// ---- DATOS DEL JUEGO ----
const cardEmojis = ['💀', '👻', '👽', '👾', '🤖', '🎃'];

// ---- VARIABLES DE ESTADO DEL JUEGO ----
let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let attempts = 0;
let matchesFound = 0;
let timer;
let timeElapsed = 0;
let score = 0;

// ---- FUNCIONES PRINCIPALES DEL JUEGO ----

/**
 * Mezcla un array (Algoritmo Fisher-Yates).
 * @param {Array} array - El array a mezclar.
 */
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

/**
 * Genera las cartas en el HTML y las añade al tablero.
 */
function generateCards() {
    const gameEmojis = [...cardEmojis, ...cardEmojis];
    shuffle(gameEmojis);
    const fragment = document.createDocumentFragment();
    for (const emoji of gameEmojis) {
        const card = document.createElement('div');
        card.classList.add('memory-card');
        card.dataset.value = emoji;
        card.innerHTML = `
            <div class="front-face"></div>
            <div class="back-face">${emoji}</div>
        `;
        fragment.appendChild(card);
    }
    gameBoard.appendChild(fragment);
}

/**
 * Se ejecuta al hacer clic en una carta.
 * @param {Event} e - El evento de clic.
 */
function flipCard(e) {
    const clickedCard = e.currentTarget;
    if (lockBoard || clickedCard === firstCard) return;

    if (!timer) {
        startTimer();
    }

    clickedCard.classList.add('flip');

    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = clickedCard;
    } else {
        secondCard = clickedCard;
        incrementAttempts();
        checkForMatch();
    }
}

/**
 * Comprueba si las dos cartas volteadas son una pareja.
 */
function checkForMatch() {
    const isMatch = firstCard.dataset.value === secondCard.dataset.value;
    isMatch ? disableCards() : unflipCards();
}

/**
 * Deshabilita los clics en las cartas que ya forman una pareja.
 */
function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    matchesFound++;

    if (matchesFound === cardEmojis.length) {
        endGame(true); // true = victoria
    }
    resetBoard();
}

/**
 * Voltea las cartas de nuevo si no son una pareja.
 */
function unflipCards() {
    lockBoard = true;
    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');
        resetBoard();
    }, 1200);
}

/**
 * Reinicia las variables del turno.
 */
function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

/**
 * Incrementa el contador de intentos y lo muestra.
 */
function incrementAttempts() {
    attempts++;
    attemptsDisplay.textContent = attempts;
}

/**
 * Inicia el temporizador.
 */
function startTimer() {
    timeElapsed = 0;
    timerDisplay.textContent = '0 s';
    const timeLimit = parseInt(timeLimitInput.value, 10);

    timer = setInterval(() => {
        timeElapsed++;
        timerDisplay.textContent = `${timeElapsed} s`;

        if (timeElapsed >= timeLimit) {
            endGame(false); // false = derrota
        }
    }, 1000);
}

/**
 * Calcula el score final basado en el tiempo y los intentos.
 * @returns {number} - La puntuación calculada.
 */
function calculateScore() {
    const baseScore = 10000;
    const timePenalty = timeElapsed * 10;
    const attemptsPenalty = attempts * 50;
    const finalScoreValue = baseScore - timePenalty - attemptsPenalty;
    return Math.max(0, finalScoreValue); // El score no puede ser menor que 0.
}

/**
 * Muestra el modal de fin de juego (victoria o derrota).
 * @param {boolean} isVictory - Indica si el jugador ganó.
 */
function endGame(isVictory) {
    clearInterval(timer);
    timer = null;

    if (isVictory) {
        score = calculateScore();
        modalTitle.textContent = '¡GANASTE! 🥳';
        modalMessage.textContent = '¡Felicidades, encontraste todas las parejas!';
    } else {
        score = 0;
        modalTitle.textContent = '¡SE ACABÓ EL TIEMPO! 😭';
        modalMessage.textContent = '¡Lástima! Inténtalo de nuevo.';
    }

    scoreDisplay.textContent = score;
    finalScore.textContent = score;
    finalTime.textContent = `${timeElapsed} segundos`;
    finalAttempts.textContent = attempts;
    modal.classList.add('visible');
}

/**
 * Inicia o reinicia el juego.
 */
function startGame() {
    resetBoard();
    clearInterval(timer);
    timer = null;
    timeElapsed = 0;
    attempts = 0;
    matchesFound = 0;
    score = 0;

    attemptsDisplay.textContent = '0';
    timerDisplay.textContent = '0 s';
    scoreDisplay.textContent = '0';
    gameBoard.innerHTML = '';
    modal.classList.remove('visible');

    generateCards();
    const cards = document.querySelectorAll('.memory-card');
    cards.forEach(card => card.addEventListener('click', flipCard));
}

// ---- EVENT LISTENERS ----
restartButton.addEventListener('click', startGame);
modalRestartButton.addEventListener('click', startGame);

// ---- INICIO DEL JUEGO ----
startGame();