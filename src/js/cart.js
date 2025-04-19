import {
  getLocalStorage,
  setLocalStorage,
  loadHeaderFooter,
} from "./utils.mjs";

loadHeaderFooter();

const products = document.querySelector(".products");

function getCartItems() {
  return JSON.parse(localStorage.getItem("so-cart")) || [];
}

function setCartItems(cartItems) {
  localStorage.setItem("so-cart", JSON.stringify(cartItems));
  renderCartContents();
}

// Need a Function to remove an item from the cart
function removeFromCart(productId) {
  let cartItems = getLocalStorage("so-cart");

  // Ensure cartItems is an array
  if (!Array.isArray(cartItems)) {
    cartItems = []; // If it's not an array, set it to an empty array
  }

  // Filter out the item you want to remove from the cart
  // New!! I used findIndex function instead of filter
  const index = cartItems.findIndex((item) => item.Id === productId);
  // const index = cartItems.findIndex((item) => item.Id === productId);

  if (index !== -1) {
    cartItems.splice(index, 1); // Remove only one occurrence
  }

  // Update the cart in localStorage and re-render
  setLocalStorage("so-cart", cartItems);
  renderCartContents();
}

function renderCartContents() {
  let cartItems = getLocalStorage("so-cart");
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  products.querySelector(".product-list").innerHTML = htmlItems.join("");
  renderCartTotal(cartItems);
  //console.log(cartItems.quantity);
  //console.log(cartItems);
  

  // Add event listeners to the "Remove" buttons after rendering the items
  document.querySelectorAll(".remove").forEach((button) => {
    button.addEventListener("click", () => {
      removeFromCart(button.getAttribute("data-id"));
      // console.log(button.getAttribute("data-id"));
    });
  });

  // Add event listeners to the quantity change after rendering the items
  // Event Listener for Increase
  document.querySelectorAll(".increase").forEach((button) => {
    button.addEventListener("click", () => {
      let cartItems = getCartItems();
      const id = button.getAttribute("data-id");
      const item = cartItems.find((item) => item.Id === id);
      
      if (item){
        item.quantity = (item.quantity || 1) + 1;
        item.listPrice = item.listPrice || 0;
        //console.log(`Item: ${item.Name}, Quantity: ${item.quantity}, Unit Price: ${item.listPrice}`);
        item.listPrice = item.listPrice || item.ListPrice; 
        item.FinalPrice = item.listPrice * item.quantity;
      } 
      
      setCartItems(cartItems);
    });
  });

  // Event Listener for Decrease
  document.querySelectorAll(".decrease").forEach((button) => {
    button.addEventListener("click", () => {
      let cartItems = getCartItems();
      const id = button.getAttribute("data-id");
      const item = cartItems.find((item) => item.Id === id);
      
      if (item && item.quantity > 1) {
        item.quantity = (item.quantity || 1) - 1;
        item.listPrice = item.listPrice || 0;
        //console.log(`Item: ${item.Name}, Quantity: ${item.quantity}, Unit Price: ${item.listPrice}`);
        item.listPrice = item.listPrice || item.ListPrice; // Fallback to ListPrice
        item.FinalPrice = item.listPrice * item.quantity;
      } 
      
      setCartItems(cartItems);
    });
  }); 

  

  renderCartTotal(cartItems);
}

function cartItemTemplate(item) {
  const newItem = `
  <li class="cart-card divider">
  <a href="#" class="cart-card__image">
    <img
      src="${item.Images.PrimaryMedium}"
      alt="${item.Name}"
    />
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors[0].ColorName}</p>
  <p class="cart-card__quantity">
  <button class = "decrease" data-id = "${item.Id}">-</button>
  <span>${item.quantity || 1}</span>
  <button class = "increase" data-id = "${item.Id}">+</button></p>
  <p class="cart-card__price">$${item.FinalPrice.toFixed(2)}</p>
  <button class="remove" data-id="${item.Id}">X</button>
</li>`;

  return newItem;
}


function renderCartTotal(cartItems) {

  const listFooter = document.querySelector(".list-footer");
  let cartSubtotal = document.querySelector(".list-total");
  const cartProducts = document.querySelector(".products")

  const cartTotal = function (items) {
    let total = items.reduce((sum, item) => sum + item.FinalPrice, 0);

    if (cartSubtotal) {
      cartSubtotal.textContent = `Total: $${total.toFixed(2)}`;
    }

    if (cartItems.length > 0) {
      listFooter.classList.remove("hide");
    } else {
      listFooter.classList.add("hide");
    }
  };

  cartTotal(cartItems);
  displayLinksIfEmptyCart(cartItems, cartProducts);
}

function displayLinksIfEmptyCart(cartItems, cartProducts) {
  let linksContainer = document.querySelector(".cart_links-container");

  if (cartItems.length === 0 && !linksContainer) {
    linksContainer = document.createElement("div");
    linksContainer.setAttribute("class", "cart_links-container");
    linksContainer.innerHTML = `
    <h1>Your cart is empty but don't worry, tell me what you need:</h1>
    <ul>
      <li>
        <a href="/product_listing/index.html?category=tents">Tents</a>
      </li>
      <li>
        <a href="/product_listing/index.html?category=backpacks">Backpacks</a>
      </li>
      <li>
        <a href="/product_listing/index.html?category=sleeping-bags">Sleeping Bags</a>
      </li>
      <li>
        <a href="/product_listing/index.html?category=hammocks">Hammocks</a>
      </li>
    </ul>
    `;

    cartProducts.append(linksContainer);
  }
}

renderCartContents();

