import { getLocalStorage, setLocalStorage } from "./utils.mjs";


const STORAGE_KEY = "so-cart";
const listEl = document.querySelector('.product-list');
const footerEl = document.querySelector('.list-footer');
const totalEl = document.querySelector('.list-total');

// Helpers to get/set cart in localStorage
function getCartItems() {
    return getLocalStorage(STORAGE_KEY) || [];
}

function setCartItems(items) {
    setLocalStorage(STORAGE_KEY, items);
    renderCart();
}

// Remove item by id
function removeFromCart(id) {
    let items = getCartItems();
    items = items.filter(item => item.id !== id);
    setCartItems(items);
}

// Change quantity by delta (+1 or -1)
function changeQuantity(id, delta) {
    const items = getCartItems();
    const item = items.find(i => i.id === id);
    if (!item) return;
    item.quantity = Math.max(1, (item.quantity || 1) + delta);
    setCartItems(items);
}

// Render cart contents
function renderCart() {
    const items = getCartItems();
    listEl.innerHTML = '';

    if (!items.length) {
        listEl.innerHTML = '<p>Your cart is empty.</p>';
        footerEl.classList.add('hide');
        return;
    }

    items.forEach(item => {
        const li = document.createElement('li');
        li.className = 'doctor-list-card';
        li.innerHTML = `
      <img src="${item.image}" alt="${item.name}" />
      <h2>${item.name}</h2>
      <p>Price: $${item.price.toFixed(2)}</p>
      <p class="quantity-control">
        <button class="decrease" data-id="${item.id}">-</button>
        <span>${item.quantity || 1}</span>
        <button class="increase" data-id="${item.id}">+</button>
      </p>
      <button class="remove" data-id="${item.id}">Remove</button>
    `;
        listEl.appendChild(li);
    });

    // Update total
    const total = items.reduce((sum, i) => sum + i.price * (i.quantity || 1), 0);
    totalEl.textContent = `Total: $${total.toFixed(2)}`;
    footerEl.classList.remove('hide');

    // Attach listeners
    document.querySelectorAll('.remove').forEach(btn =>
        btn.addEventListener('click', () => removeFromCart(btn.dataset.id))
    );
    document.querySelectorAll('.decrease').forEach(btn =>
        btn.addEventListener('click', () => changeQuantity(btn.dataset.id, -1))
    );
    document.querySelectorAll('.increase').forEach(btn =>
        btn.addEventListener('click', () => changeQuantity(btn.dataset.id, 1))
    );
}

// Initial render
renderCart();
