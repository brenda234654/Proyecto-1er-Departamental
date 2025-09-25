// --- EJECUCIÓN CUANDO EL DOM ESTÁ LISTO ---
document.addEventListener('DOMContentLoaded', () => {
    
    // --- CLAVE DE API ---
    // ¡¡¡IMPORTANTE!!! Reemplaza 'TU_API_KEY_AQUI' con tu clave de OpenWeatherMap.
    const API_KEY = '5499df3af16dfcaafe8f909c36237d39';

    // --- ELEMENTOS DEL DOM ---
    const loader = document.getElementById('loader');
    const weatherCard = document.getElementById('weather-card');
    const weatherContent = document.getElementById('weather-content');
    const searchContainer = document.getElementById('search-container');
    const searchForm = document.getElementById('search-form');
    const cityInput = document.getElementById('city-input');
    const geoErrorMsg = document.getElementById('geo-error');

    // Elementos para mostrar datos
    const cityDisplay = document.getElementById('city');
    const weatherIcon = document.getElementById('weather-icon');
    const tempDisplay = document.getElementById('temperature');
    const descDisplay = document.getElementById('description');
    const feelsLikeDisplay = document.getElementById('feels-like');
    const humidityDisplay = document.getElementById('humidity');
    const windDisplay = document.getElementById('wind-speed');

    // --- INICIO DE LA APP ---
    // Intenta obtener la ubicación del usuario al cargar la página.
    navigator.geolocation.getCurrentPosition(onGeoSuccess, onGeoError);

    // --- MANEJO DE GEOLOCALIZACIÓN ---

    /**
     * Callback que se ejecuta si se obtiene la ubicación con éxito.
     * @param {GeolocationPosition} position - Objeto con las coordenadas.
     */
    function onGeoSuccess(position) {
        const { latitude, longitude } = position.coords;
        getWeatherByCoords(latitude, longitude);
    }

    /**
     * Callback que se ejecuta si falla la geolocalización.
     * Muestra el campo de búsqueda manual.
     */
    function onGeoError() {
        showSearchInput('No se pudo obtener tu ubicación. Por favor, busca una ciudad.');
    }

    // --- LÓGICA DE FETCH A LA API ---

    /**
     * Obtiene el clima usando coordenadas.
     * @param {number} lat - Latitud.
     * @param {number} lon - Longitud.
     */
    async function getWeatherByCoords(lat, lon) {
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=es`;
        await fetchWeather(url);
    }

    /**
     * Obtiene el clima usando el nombre de una ciudad.
     * @param {string} city - Nombre de la ciudad.
     */
    async function getWeatherByCity(city) {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=es`;
        await fetchWeather(url);
    }

    /**
     * Función principal para hacer la petición fetch a la API.
     * @param {string} url - La URL completa de la API.
     */
    async function fetchWeather(url) {
        showLoader();
        try {
            const response = await fetch(url);
            if (!response.ok) {
                // Si la ciudad no se encuentra (error 404) o hay otro error.
                throw new Error(`Error: ${response.statusText}`);
            }
            const data = await response.json();
            displayWeatherData(data);
            searchContainer.style.display = 'none'; // Oculta el buscador si la petición es exitosa
        } catch (error) {
            console.error('Error al obtener datos del clima:', error);
            showSearchInput('Ciudad no encontrada. Inténtalo de nuevo.');
        } finally {
            hideLoader();
        }
    }

    // --- MANIPULACIÓN DEL DOM Y UI ---

    /**
     * Muestra los datos del clima en la tarjeta.
     * @param {object} data - Objeto con los datos de la API.
     */
    function displayWeatherData(data) {
        // Extraemos los datos necesarios del objeto de la API.
        const { name } = data;
        const { temp, feels_like, humidity } = data.main;
        const { description, main: weatherCondition, icon } = data.weather[0];
        const { speed } = data.wind;

        // Actualizamos el contenido de los elementos HTML.
        cityDisplay.textContent = name;
        tempDisplay.textContent = `${Math.round(temp)}°C`;
        descDisplay.textContent = description;
        feelsLikeDisplay.textContent = `${Math.round(feels_like)}°C`;
        humidityDisplay.textContent = `${humidity}%`;
        windDisplay.textContent = `${(speed * 3.6).toFixed(1)} km/h`;

        updateBackgroundAndIcon(weatherCondition, icon);
        
        // Mostramos la tarjeta de clima.
        weatherContent.style.display = 'block';
    }

    /**
     * Actualiza el fondo del body y el icono del clima.
     * @param {string} condition - Condición principal del clima (ej: "Clear", "Rain").
     * @param {string} iconCode - Código del icono de la API.
     */
    function updateBackgroundAndIcon(condition, iconCode) {
        const body = document.body;
        body.className = ''; // Limpiamos clases de fondo anteriores.
        
        // Mapeo de iconos de la API a Font Awesome.
        const iconMap = {
            '01d': 'fa-solid fa-sun', '01n': 'fa-solid fa-moon',
            '02d': 'fa-solid fa-cloud-sun', '02n': 'fa-solid fa-cloud-moon',
            '03d': 'fa-solid fa-cloud', '03n': 'fa-solid fa-cloud',
            '04d': 'fa-solid fa-cloud', '04n': 'fa-solid fa-cloud',
            '09d': 'fa-solid fa-cloud-showers-heavy', '09n': 'fa-solid fa-cloud-showers-heavy',
            '10d': 'fa-solid fa-cloud-rain', '10n': 'fa-solid fa-cloud-rain',
            '11d': 'fa-solid fa-bolt', '11n': 'fa-solid fa-bolt',
            '13d': 'fa-solid fa-snowflake', '13n': 'fa-solid fa-snowflake',
            '50d': 'fa-solid fa-smog', '50n': 'fa-solid fa-smog',
        };

        weatherIcon.className = `weather-icon ${iconMap[iconCode] || 'fa-solid fa-question'}`;

        // Asignamos una clase al body para el fondo dinámico.
        switch (condition) {
            case 'Clear': body.classList.add('sunny'); break;
            case 'Clouds': body.classList.add('cloudy'); break;
            case 'Rain':
            case 'Drizzle':
            case 'Thunderstorm': body.classList.add('rainy'); break;
            case 'Snow': body.classList.add('snowy'); break;
            default: body.style.background = '#34495e';
        }
    }

    /** Muestra el loader y oculta la tarjeta. */
    function showLoader() {
        loader.style.display = 'block';
        weatherCard.classList.add('hidden');
    }

    /** Oculta el loader y muestra la tarjeta. */
    function hideLoader() {
        loader.style.display = 'none';
        weatherCard.classList.remove('hidden');
    }

    /**
     * Muestra el campo de búsqueda con un mensaje de error.
     * @param {string} message - El mensaje a mostrar.
     */
    function showSearchInput(message) {
        hideLoader();
        weatherContent.style.display = 'none';
        searchContainer.style.display = 'block';
        geoErrorMsg.textContent = message;
    }

    // --- EVENT LISTENERS ---

    // Evento para el formulario de búsqueda.
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const city = cityInput.value.trim();
        if (city) {
            getWeatherByCity(city);
        }
    });
});