// --- EJECUCIÓN CUANDO EL DOM ESTÁ LISTO ---
document.addEventListener('DOMContentLoaded', () => {

    // --- ANIMACIÓN DE FADE-IN AL HACER SCROLL ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 }); // Se activa cuando el 10% del elemento es visible

    // Observar todos los elementos con la clase .hidden
    document.querySelectorAll('.hidden').forEach(el => observer.observe(el));


    // --- VALIDACIÓN DEL FORMULARIO ---
    const form = document.getElementById('contact-form');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    
    form.addEventListener('submit', (e) => {
        e.preventDefault(); // Evita que el formulario se envíe de la forma tradicional
        if (validateForm()) {
            // Si el formulario es válido, mostramos el modal y el confeti
            showSuccessModal();
            launchConfetti();
            form.reset(); // Limpiamos el formulario
        }
    });

    // Función para validar todo el formulario
    function validateForm() {
        let isValid = true;
        // Limpia errores previos
        clearErrors();

        // 1. Validar Nombre
        if (nameInput.value.trim() === '') {
            showError(nameInput, 'El nombre no puede estar vacío.');
            isValid = false;
        }

        // 2. Validar Email
        if (emailInput.value.trim() === '') {
            showError(emailInput, 'El correo electrónico no puede estar vacío.');
            isValid = false;
        } else if (!isValidEmail(emailInput.value.trim())) {
            showError(emailInput, 'Por favor, introduce un correo válido.');
            isValid = false;
        }

        // 3. Validar Mensaje
        if (messageInput.value.trim() === '') {
            showError(messageInput, 'El mensaje no puede estar vacío.');
            isValid = false;
        }

        return isValid;
    }

    // Función para mostrar un mensaje de error
    function showError(inputElement, message) {
        const formGroup = inputElement.parentElement;
        const errorElement = formGroup.querySelector('.error-message');
        
        inputElement.classList.add('invalid');
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }

    // Función para limpiar todos los errores
    function clearErrors() {
        const errorMessages = document.querySelectorAll('.error-message');
        const invalidInputs = document.querySelectorAll('.invalid');
        
        errorMessages.forEach(msg => {
            msg.textContent = '';
            msg.style.display = 'none';
        });
        
        invalidInputs.forEach(input => input.classList.remove('invalid'));
    }

    // Función de ayuda para validar formato de email con Regex
    function isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }


    // --- LÓGICA DEL MODAL DE ÉXITO ---
    const modal = document.getElementById('success-modal');
    const closeModalButton = document.getElementById('close-modal');

    function showSuccessModal() {
        modal.classList.add('visible');
    }

    closeModalButton.addEventListener('click', () => {
        modal.classList.remove('visible');
    });


    // --- ANIMACIÓN DE CONFETI ---
    function launchConfetti() {
        const confettiContainer = document.getElementById('confetti-container');
        const confettiCount = 15; // Número de piezas de confeti
        const colors = ['#6a5acd', '#f06292', '#4fc3f7', '#a5d6a7', '#ffd54f'];

        for (let i = 0; i < confettiCount; i++) {
            const confettiPiece = document.createElement('div');
            confettiPiece.classList.add('confetti-piece');
            
            // Estilos aleatorios
            const color = colors[Math.floor(Math.random() * colors.length)];
            const xEnd = (Math.random() - 0.5) * 400 + 'px'; // Destino horizontal aleatorio
            const animDuration = (Math.random() * 2 + 1) + 's'; // Duración aleatoria
            
            confettiPiece.style.background = color;
            confettiPiece.style.setProperty('--x-end', xEnd);
            confettiPiece.style.animationDuration = animDuration;

            confettiContainer.appendChild(confettiPiece);

            // Eliminar la pieza del DOM después de que termine la animación
            setTimeout(() => {
                confettiPiece.remove();
            }, 3000);
        }
    }
});