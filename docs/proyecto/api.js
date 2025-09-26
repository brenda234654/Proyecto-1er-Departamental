// Este archivo maneja toda la comunicación con el servidor backend.
// Tiene funciones para obtener y guardar las puntuaciones.
// Incluye un fallback a localStorage si el servidor no responde.

const API_URL = 'https://proyecto-1er-departamental.onrender.com/scores';

async function getScores() {
    try {
        const response = await fetch(`${API_BASE_URL}/scores`);
        if (!response.ok) {
            throw new Error('El servidor no está disponible');
        }
        return await response.json();
    } catch (error) {
        console.warn('Fallback: Usando localStorage para obtener scores.', error.message);
        // Fallback: Si el servidor falla, intenta obtener los scores de localStorage
        const localScores = localStorage.getItem('cyberRunnerScores');
        return localScores ? JSON.parse(localScores) : [];
    }
}

async function saveScore(name, score, level) {
    try {
        const response = await fetch(`${API_BASE_URL}/scores`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, score, level }),
        });
        if (!response.ok) {
            throw new Error('El servidor no está disponible');
        }
        return await response.json();
    } catch (error) {
        console.warn('Fallback: Usando localStorage para guardar score.', error.message);
        // Fallback: Si el servidor falla, guarda el score en localStorage
        const localScores = await getScores(); // Obtiene los scores existentes (de localStorage si es necesario)
        localScores.push({ name, score, level });
        // Ordenar y mantener solo los mejores 10
        localScores.sort((a, b) => b.score - a.score);
        const topScores = localScores.slice(0, 10);
        localStorage.setItem('cyberRunnerScores', JSON.stringify(topScores));
        return { message: 'Score guardado localmente' };
    }
}
