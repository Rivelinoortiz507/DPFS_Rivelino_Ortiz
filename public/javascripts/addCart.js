document.addEventListener('DOMContentLoaded', () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsContainer = document.querySelector('.cart-items');
    const itbmsElement = document.getElementById('itbms');
    const totalElement = document.getElementById('total');

    let total = 0;

    cartItemsContainer.innerHTML = ''; // Vaciar el contenedor antes de añadir elementos

    cart.forEach(item => {
        const itemPrice = parseFloat(item.price); // Convertir a número
        const itemTotal = itemPrice * item.quantity;

        const itemElement = document.createElement('div');
        itemElement.classList.add('cart-item');
        itemElement.innerHTML = `
            <span>${item.name} (x${item.quantity})</span>
            <span>$${itemTotal.toFixed(2)}</span>
        `;
        cartItemsContainer.appendChild(itemElement);

        total += itemTotal;
    });

    const itbms = total * 0.07;
    const totalWithItbms = total + itbms;

    if (itbmsElement) {
        itbmsElement.textContent = `$${itbms.toFixed(2)}`;
    }
    if (totalElement) {
        totalElement.textContent = `$${totalWithItbms.toFixed(2)}`;
    }
});



 // Lógica para vaciar el carrito
 const emptyCartButton = document.querySelector('.empty-cart-btn');
    
 emptyCartButton.addEventListener('click', () => {
     // Vaciar el carrito en el local storage
     localStorage.removeItem('cart');
     
     // Actualizar la interfaz del carrito (vaciarla)
     const cartItemsContainer = document.querySelector('.cart-items');
     cartItemsContainer.innerHTML = ''; // Elimina todos los productos mostrados

     // Actualizar el total y ITBMS
     document.querySelector('.cart-itbms span:nth-child(2)').textContent = '$0.00';
     document.querySelector('.cart-total span:nth-child(2)').textContent = '$0.00';

     alert('El carrito ha sido vaciado.');
 });
