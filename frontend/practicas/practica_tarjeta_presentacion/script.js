// Espera a que todo el contenido de la página se cargue
document.addEventListener('DOMContentLoaded', () => {

    // 1. Seleccionar los elementos del DOM que necesitamos
    const contactButton = document.getElementById('contact-button');
    const contactInfo = document.getElementById('contact-info');

    // 2. Añadir un "escuchador" de eventos al botón para el clic
    contactButton.addEventListener('click', () => {
        // 3. Al hacer clic, hacemos la magia
        
        // Comprueba si la información de contacto está oculta
        const isHidden = contactInfo.classList.contains('hidden');

        if (isHidden) {
            // Si está oculta, la mostramos
            contactInfo.classList.remove('hidden');
            contactButton.textContent = 'Ocultar contacto'; // Cambiamos el texto del botón
        } else {
            // Si está visible, la ocultamos
            contactInfo.classList.add('hidden');
            contactButton.textContent = 'Mostrar contacto'; // Revertimos el texto del botón
        }
    });
});