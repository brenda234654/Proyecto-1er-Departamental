# 🦖 RunnerJS - Proyecto Integrador

¡Bienvenido a RunnerJS! Un juego web estilo *endless runner*, inspirado en el clásico juego del dinosaurio de Google, pero con un toque moderno y un sistema de puntuaciones global.

Este proyecto fue desarrollado como parte de un proyecto integrador, aplicando conocimientos de desarrollo Frontend y Backend con JavaScript.

**🕹️ ¡Juega la versión en vivo aquí! 🕹️**
[**https://brenda234654.github.io/Proyecto-1er-Departamental/**](https://brenda234654.github.io/Proyecto-1er-Departamental/)

---

(<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/4f5830e3-97a9-4c1f-935e-54b075eac04f" />

## 📖 Descripción del Proyecto

RunnerJS es una aplicación web completa que incluye:
* **Landing Page:** Una página de inicio que sirve como portafolio, con enlaces a prácticas anteriores y al proyecto principal.
* **Juego Principal:** Un *endless runner* creado con HTML5 Canvas donde el jugador debe saltar para esquivar obstáculos. La dificultad aumenta progresivamente.
* **Sistema de Puntuaciones:** Al final de cada partida, los jugadores pueden guardar su nombre y puntuación.
* **Leaderboard Global:** Una tabla de las 10 mejores puntuaciones, consultada en tiempo real desde un servidor.

## 🛠️ Tecnologías Utilizadas

Este proyecto está dividido en dos partes principales:

#### **Frontend**
* **HTML5:** Para la estructura de la web.
* **CSS3:** Para el diseño y la apariencia.
* **JavaScript (ES6+):** Para toda la lógica del juego, interacciones y comunicación con la API.
* **HTML5 Canvas:** Para el renderizado y la animación del juego.
* **Desplegado en:** GitHub Pages.

#### **Backend**
* **Node.js:** Entorno de ejecución para el servidor.
* **Express.js:** Framework para crear la API REST.
* **API REST:** Endpoints para obtener y guardar las puntuaciones.
* **Persistencia:** Los datos se guardan en un archivo `scores.json`.
* **Desplegado en:** Render.

## 📁 Estructura del Repositorio

```
/
├─ /docs/           # Contiene todo el código del frontend (desplegado en GitHub Pages)
│  ├─ index.html    # Landing Page
│  ├─ /practicas/   # Prácticas anteriores
│  └─ /proyecto/    # El juego principal
└─ /backend/        # Contiene el código del servidor (desplegado en Render)
   ├─ server.js     # Archivo principal del servidor Express
   └─ data/scores.json # Base de datos de puntuaciones
```

## 🔌 Endpoints de la API

La API del backend cuenta con los siguientes endpoints:

* `GET /scores`: Obtiene la lista de las mejores puntuaciones.
* `POST /scores`: Guarda una nueva puntuación. Se debe enviar un cuerpo JSON con `name`, `score` y `level`.

**URL Base de la API:** `https://proyecto-1er-departamental.onrender.com`

## 🚀 Instalación y Uso Local (Opcional)

Si deseas ejecutar este proyecto en tu propia máquina:

1.  **Clona el repositorio:**
    ```bash
    git clone [https://github.com/brenda234654/Proyecto-1er-Departamental.git](https://github.com/brenda234654/Proyecto-1er-Departamental.git)
    ```
2.  **Ejecuta el frontend:**
    Simplemente abre el archivo `docs/index.html` en tu navegador.

3.  **Ejecuta el backend:**
    ```bash
    cd backend
    npm install
    node server.js
    ```
    *No olvides actualizar la `API_BASE_URL` en el archivo `docs/proyecto/api.js` para que apunte a `http://localhost:10000`.*
