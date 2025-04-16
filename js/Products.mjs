import { renderListWithTemplate, getParam } from "./utils.mjs";
const parentListElement = document.getElementById("parent-list");

function productListCardTemplate(product) {
    return `
    <li class='product-list-card'>
        <a href='../product-pages/index.html?id=${product.id}'>
            <img src='${product.image}' alt='Image of ${product.name}' />
            <h2 class='card__brand'>${product.name}</h2>
        </a>
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
    return `
    <section class="product-detail"> <h3>${product.name}</h3>
        <h2 class="divider">${product.name}</h2>
        <img
          class="divider"
          src="${product.image}"
          alt="${product.name}"
        />
        <div class="product-detail__add">
          <button id="addToCart" data-id="${product.id}">Add to Cart</button>
        </div></section>`;
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
        console.log(list);
        renderListWithTemplate(productListCardTemplate, parentListElement, list);
    }
    async renderProductById() {
        const id = getParam("id");
        console.log("id from URL:", id);

        const product = await getProductById(id);
        console.log("product fetched:", product);

        const template = productDetailsTemplate(product);
        parentProductElement.innerHTML = template;
    }

}