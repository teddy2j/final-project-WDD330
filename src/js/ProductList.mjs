import { renderListWithTemplate, getLocalStorage, setLocalStorage } from "./utils.mjs";

function productCardTemplate(product) {
  return `
    <li class='product-card'>
        <a href='/product_pages/index.html?product=${product.Id}'>
            <img src='${product.Images.PrimaryMedium}' alt='Image of ${product.Name}' />
            <h2 class='card__brand'>${product.Brand.Name}</h2>
            <h3 class='card_name'>${product.NameWithoutBrand}</h3>
            <p class='product-card__price'>$${product.ListPrice.toFixed(2)}</p>
        </a>
        <button id="quickAddToCart" data-id="${product.Id}">Add to Cart</button>
    </li>`;
}

export default class ProductList {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
    this.list = [];
  }

  async init() {
    this.list = await this.dataSource.getData(this.category);
    const list = await this.dataSource.getData(this.category);
    this.insertSortControl();
    this.renderList(this.list);
    this.renderList(list);
    document.querySelector(".title").textContent = this.category;
    document.querySelectorAll("#quickAddToCart").forEach((button) => {
      button.addEventListener("click", (event) => this.addToCart(event));
    });
    this.attachSortListener();
    this.searchInput();
  }

  searchInput() {
    const searchInput = document.getElementById("searchBar");
    searchInput.addEventListener("input", (e) => {
      const searchTerm = e.target.value.toLowerCase();
      if (!searchTerm) {
        this.renderList(this.list);
        return;
      }
      const filteredList = this.list.filter((product) =>
        product.NameWithoutBrand.toLowerCase().includes(searchTerm)
      );
      if (filteredList.length === 0) {
        this.listElement.innerHTML = `<p>No products found matching "${searchTerm}"</p>`;
        return;
      }
      this.renderList(filteredList);
    });

  }

  insertSortControl() {
    const container =
      document.querySelector(".product-list-container") ||
      this.listElement.parentElement;
    if (!document.getElementById("sortOptions")) {
      const sortControl = document.createElement("div");
      sortControl.classList.add("sort-control");
      sortControl.innerHTML = `
        <label for="sortOptions">Sort by: </label>
        <select id="sortOptions">
          <option value="">-- Select --</option>
          <option value="name">Name</option>
          <option value="price">Price</option>
        </select>`;
      container.insertBefore(sortControl, this.listElement);
    }
  }

  attachSortListener() {
    const sortSelect = document.getElementById("sortOptions");
    if (sortSelect) {
      sortSelect.addEventListener("change", (e) => {
        const sortBy = e.target.value;
        this.sortList(sortBy);
      });
    }
  }

  sortList(sortBy) {
    let sortedList = [...this.list];
    if (sortBy === "name") {
      sortedList.sort((a, b) => a.NameWithoutBrand.localeCompare(b.NameWithoutBrand));
    } else if (sortBy === "price") {
      sortedList.sort((a, b) => a.ListPrice - b.ListPrice);
    }
    this.renderList(sortedList);
  }

  addToCart(event) {
    // Get ID from button's data
    const productId = event.target.getAttribute("data-id");

    // Find the product data
    this.dataSource.findProductById(productId).then((product) => {

      let cartItems = getLocalStorage("so-cart");

      if (!Array.isArray(cartItems)) {
        cartItems = [];
      }

      let isDuplicate = false;
      for (const item of cartItems) {
        if (item.Id === product.Id) {
          item.quantity = (item.quantity || 1) + 1;
          isDuplicate = true;
        }
      }
      if (!isDuplicate) {
        cartItems.push(product); // Add the current product to the array
      }
      setLocalStorage("so-cart", cartItems);

      // cartItems.push(product);
      // setLocalStorage("so-cart", cartItems);
    });
  }

  renderList(list) {
    renderListWithTemplate(productCardTemplate, this.listElement, list);
    renderListWithTemplate(productCardTemplate, this.listElement, list, "afterbegin", true);
  }
}
