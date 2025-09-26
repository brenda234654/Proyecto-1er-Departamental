document.addEventListener('DOMContentLoaded', () => {

    // --- SELECCIÓN DE ELEMENTOS DEL DOM ---
    // Botones para que el jugador elija
    const choiceButtons = document.querySelectorAll('.choice-btn');
    // Elementos para mostrar los resultados
    const resultMessage = document.getElementById('result-message');
    const userChoiceSpan = document.getElementById('user-choice');
    const computerChoiceSpan = document.getElementById('computer-choice');
    // Elementos del marcador
    const winsSpan = document.getElementById('wins');
    const lossesSpan = document.getElementById('losses');
    const tiesSpan = document.getElementById('ties');

    // --- VARIABLES DEL JUEGO ---
    const choices = ['piedra', 'papel', 'tijera'];
    let scores = {
        wins: 0,
        losses: 0,
        ties: 0
    };

    // --- LÓGICA PRINCIPAL ---
    // Añadir un evento de clic a cada botón
    choiceButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Obtener la elección del usuario del atributo 'data-choice' del botón
            const userChoice = button.dataset.choice;
            // Generar una elección aleatoria para la computadora
            const computerChoice = getComputerChoice();
            // Determinar quién ganó
            const winner = determineWinner(userChoice, computerChoice);
            // Actualizar el marcador
            updateScore(winner);
            // Mostrar los resultados en la pantalla
            displayResults(userChoice, computerChoice, winner);
        });
    });

    // --- FUNCIONES AUXILIARES ---

    /**
     * Genera y devuelve una elección aleatoria para la computadora.
     * @returns {string} 'piedra', 'papel' o 'tijera'
     */
    function getComputerChoice() {
        const randomIndex = Math.floor(Math.random() * choices.length);
        return choices[randomIndex];
    }

    /**
     * Compara las elecciones y determina el ganador.
     * @param {string} user - Elección del usuario.
     * @param {string} computer - Elección de la computadora.
     * @returns {string} 'win', 'lose' o 'tie'
     */
    function determineWinner(user, computer) {
        if (user === computer) {
            return 'tie'; // Empate
        }
        if (
            (user === 'piedra' && computer === 'tijera') ||
            (user === 'papel' && computer === 'piedra') ||
            (user === 'tijera' && computer === 'papel')
        ) {
            return 'win'; // El usuario gana
        }
        return 'lose'; // El usuario pierde
    }

    /**
     * Actualiza el objeto de puntuaciones según el resultado.
     * @param {string} winner - 'win', 'lose' o 'tie'
     */
    function updateScore(winner) {
        if (winner === 'win') {
            scores.wins++;
        } else if (winner === 'lose') {
            scores.losses++;
        } else {
            scores.ties++;
        }
    }

    /**
     * Actualiza la interfaz de usuario con los resultados y el marcador.
     * @param {string} user - Elección del usuario.
     * @param {string} computer - Elección de la computadora.
     * @param {string} winner - 'win', 'lose' o 'tie'
     */
    function displayResults(user, computer, winner) {
        // Actualizar el texto de las elecciones
        userChoiceSpan.textContent = user;
        computerChoiceSpan.textContent = computer;

        // Limpiar clases de color anteriores
        resultMessage.classList.remove('win', 'lose', 'tie');

        // Poner el mensaje y el color correspondiente
        if (winner === 'win') {
            resultMessage.textContent = '¡Ganaste! 🎉';
            resultMessage.classList.add('win');
        } else if (winner === 'lose') {
            resultMessage.textContent = '¡Perdiste! 😢';
            resultMessage.classList.add('lose');
        } else {
            resultMessage.textContent = '¡Es un empate! 🤝';
            resultMessage.classList.add('tie');
        }
        
        // Actualizar el marcador en la pantalla
        winsSpan.textContent = scores.wins;
        lossesSpan.textContent = scores.losses;
        tiesSpan.textContent = scores.ties;
    }
});