import { getLocalStorage, setLocalStorage } from "./utils.mjs";
import { getParam } from "./utils.mjs";
import Products from "./Products.mjs";

// Adds event listener to the "Add to Cart" button
export async function attachAddToCartListener() {
    const button = document.getElementById("addToCart");

    if (!button) {
        console.error("Add to Cart button not found.");
        return;
    }

    const id = getParam("id");
    const product = await new Products()._getProductById(id); // or reuse a shared function

    if (!product) {
        console.error("Product not found.");
        return;
    }

    button.addEventListener("click", () => {
        let cart = getLocalStorage("so-cart") || [];

        const existingItem = cart.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.quantity = (existingItem.quantity || 1) + 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }

        setLocalStorage("so-cart", cart);
        alert("Added to cart!");
    });
}
