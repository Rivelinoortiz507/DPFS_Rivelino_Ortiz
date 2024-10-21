document.addEventListener("DOMContentLoaded", function () {
    const registrationForm = document.getElementById("registrationForm");
    const loginForm = document.getElementById("loginForm"); // Suponiendo que tienes un formulario para el login

    // Limpiar mensajes de error al cargar
    const errorDivs = document.querySelectorAll(".error-message");
    errorDivs.forEach(div => div.innerHTML = ""); // Limpia los mensajes de error

    // Validación del formulario de registro
    registrationForm.addEventListener("submit", function (event) {
        let hasError = false;

        // Validar el nombre
        const nameInput = registrationForm.querySelector('input[name="name"]');
        const nameErrorDiv = document.getElementById("nameError");
        if (nameInput.value.length < 2) {
            hasError = true;
            nameErrorDiv.innerHTML = "El nombre debe tener al menos 2 caracteres.";
        } else {
            nameErrorDiv.innerHTML = ""; // Limpiar mensaje si no hay error
        }

        // Validar el email (usando expresión regular)
        const emailInput = registrationForm.querySelector('input[name="email"]');
        const emailErrorDiv = document.getElementById("emailError");
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // Regex mejorado
        if (!emailPattern.test(emailInput.value)) {
            hasError = true;
            emailErrorDiv.innerHTML = "El formato del correo electrónico no es válido.";
        } else {
            emailErrorDiv.innerHTML = ""; // Limpiar mensaje si no hay error
        }

        // Validar la contraseña
        const passwordInput = registrationForm.querySelector('input[name="password"]');
        const passwordErrorDiv = document.getElementById("passwordError");
        if (passwordInput.value.length < 8) {
            hasError = true;
            passwordErrorDiv.innerHTML = "La contraseña debe tener al menos 8 caracteres.";
        } else {
            passwordErrorDiv.innerHTML = ""; // Limpiar mensaje si no hay error
        }

        // Validar confirmación de contraseña
        const confirmPasswordInput = registrationForm.querySelector('input[name="confirmPassword"]');
        const confirmPasswordErrorDiv = document.getElementById("confirmPasswordError");
        if (confirmPasswordInput.value !== passwordInput.value) {
            hasError = true;
            confirmPasswordErrorDiv.innerHTML = "Las contraseñas no coinciden.";
        } else {
            confirmPasswordErrorDiv.innerHTML = ""; // Limpiar mensaje si no hay error
        }

        // Mostrar errores si existen
        if (hasError) {
            event.preventDefault(); // Prevenir el envío del formulario
        }
    });

    // Validación del formulario de login
    if (loginForm) {
        loginForm.addEventListener("submit", function (event) {
            let hasError = false;

            // Validar el email (usando expresión regular)
            const emailInput = loginForm.querySelector('input[name="email"]');
            const emailErrorDiv = document.getElementById("emailError");
            if (!emailPattern.test(emailInput.value)) {
                hasError = true;
                emailErrorDiv.innerHTML = "El formato del correo electrónico no es válido.";
            } else {
                emailErrorDiv.innerHTML = ""; // Limpiar mensaje si no hay error
            }

            // Validar la contraseña
            const passwordInput = loginForm.querySelector('input[name="password"]');
            const passwordErrorDiv = document.getElementById("passwordError");
            if (passwordInput.value.trim() === "") {
                hasError = true;
                passwordErrorDiv.innerHTML = "La contraseña es obligatoria.";
            } else {
                passwordErrorDiv.innerHTML = ""; // Limpiar mensaje si no hay error
            }

            // Mostrar errores si existen
            if (hasError) {
                event.preventDefault(); // Prevenir el envío del formulario
            }
        });
    }
});
