import { renderListWithTemplate, getParam, getLocalStorage, setLocalStorage } from "./utils.mjs";
const parentListElement = document.getElementById("parent-list");

function productListCardTemplate(product) {
  return `<li class='product-list-card'>
    <a href='../product-pages/index.html?id=${product.id}'>
      <img src='${product.image}' alt='Image of ${product.name}' />
      <h2 class='card__brand'>${product.name}</h2>
    </a>
    <p class="product-price">$${product.price.toFixed(2)}</p>
    <button id="quickAddToCart" data-id="${product.id}">Add to Cart</button>
  </li>`;
}

async function getList() {
  const response = await fetch("../json/products.json");
  const data = await response.json();
  return data;
}

const parentProductElement = document.getElementById("product-details");

function productDetailsTemplate(product) {
  return `<section class="product-detail-container">
    <div class="product-image">
      <img src="${product.image}" alt="${product.name}" />
    </div>
    <div class="product-info">
      <h1>${product.name}</h1>
      <p class="price">$${product.price.toFixed(2)}</p>
      <p class="description">${product.description}</p>
      <button id="addToCart" data-id="${product.id}">Add to Cart</button>
    </div>
  </section>`
    ;
}

async function getProductById(id) {
  const response = await fetch("../json/products.json");
  const data = await response.json();
  return data.find(product => product.id === id);
}


export default class Products {
  constructor() {

  }
  async renderProducts() {
    const list = await getList();
    renderListWithTemplate(productListCardTemplate, parentListElement, list);

    // Add event listeners to all "Add to Cart" buttons
    const buttons = parentListElement.querySelectorAll("#quickAddToCart");
    buttons.forEach(button => {
      button.addEventListener("click", async (e) => {
        const id = e.target.dataset.id;
        const product = list.find(item => item.id === id);
        if (product) {
          this.addToCart(product);
        }
      });
    });
  }
  async renderProductById() {
    const id = getParam("id");

    const product = await getProductById(id);

    const template = productDetailsTemplate(product);
    parentProductElement.innerHTML = template;
    document
      .getElementById("addToCart")
      .addEventListener("click", () => this.addToCart(product));


  }

  addToCart(product) {
    let cartItems = getLocalStorage("so-cart");

    // Ensure cartItems is an array
    if (!Array.isArray(cartItems)) {
      cartItems = []; // If it's not an array, set it to an empty array
    }
    let isDuplicate = false;
    for (const item of cartItems) {
      if (item.id === product.id) {
        item.quantity = (item.quantity || 1) + 1;
        isDuplicate = true;
      }
    }
    if (!isDuplicate) {
      cartItems.push(product); // Add the current product to the array
    }
    setLocalStorage("so-cart", cartItems);

  }

}