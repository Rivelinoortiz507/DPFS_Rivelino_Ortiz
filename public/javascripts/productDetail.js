document.addEventListener('DOMContentLoaded', () => {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const messageDiv = document.getElementById('message');

    addToCartButtons.forEach(button => {
        button.addEventListener('click', async (event) => {
            event.preventDefault(); // Evitar la redirección predeterminada

            const productId = button.getAttribute('data-product-id');

            try {
                const response = await fetch('/cart/add', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ productId }),
                });

                const data = await response.json();

                // Mostrar el mensaje en el contenedor
                messageDiv.innerText = response.ok ? data.message : (data.message || 'Error al añadir al carrito');
                messageDiv.style.display = 'block';

                // Ocultar el mensaje después de 3 segundos
                setTimeout(() => {
                    messageDiv.style.display = 'none';
                }, 3000);
                
            } catch (error) {
                console.error('Error al añadir producto al carrito:', error);
                messageDiv.innerText = 'Error al añadir al carrito';
                messageDiv.style.display = 'block';
            }
        });
    });
});
