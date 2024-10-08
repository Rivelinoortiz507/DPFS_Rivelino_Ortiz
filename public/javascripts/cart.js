function decreaseQuantity(button) {
    let input = button.nextElementSibling;  // Obtiene el input relacionado al botón
    if (input.value > 1) {  // Evitar valores menores a 1
        input.value = parseInt(input.value) - 1;
        updateTotal();  // Llama a la función para actualizar el total
    }
}

function increaseQuantity(button) {
    let input = button.previousElementSibling;  // Obtiene el input relacionado al botón
    input.value = parseInt(input.value) + 1;
    updateTotal();  // Llama a la función para actualizar el total
}

  function updateTotal() {
      let total = 0;
      const cartItems = document.querySelectorAll('.cart-item');
      
      cartItems.forEach(item => {
          const price = parseFloat(item.querySelector('.cart-item-details p').innerText.replace('Precio: $', ''));
          const quantity = parseInt(item.querySelector('input[name="quantity"]').value);
          total += price * quantity;
      });

      const itbms = total * 0.07;
      const grandTotal = total + itbms;

      document.getElementById('total').innerText = 'Subtotal: $' + total.toFixed(2);
      document.getElementById('itbms').innerText = 'ITBMS (7%): $' + itbms.toFixed(2);
      document.getElementById('grand-total').innerHTML = '<strong>Total: $' + grandTotal.toFixed(2) + '</strong>';
  }

