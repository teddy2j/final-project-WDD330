// Make initMap globally accessible for Google Maps API
window.initMap = function () {
    const mapOptions = {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 8
    };

    const map = new google.maps.Map(document.getElementById('map'), mapOptions);

    new google.maps.Marker({
        position: { lat: -34.397, lng: 150.644 },
        map: map,
        title: "Online Medical Center"
    });
};

// Load featured products
window.onload = function () {
    fetch('json/products.json')
        .then(response => response.json())
        .then(products => {
            const featuredContainer = document.querySelector('.featured-products');
            const randomProducts = getRandomProducts(products);

            featuredContainer.innerHTML = '';

            randomProducts.forEach(product => {
                const productElement = document.createElement('div');
                productElement.classList.add('featured-product');

                productElement.innerHTML = `<a href="product-pages/index.html?id=${product.id}">
              <img src="${product.image}" alt="${product.name}">
            </a>
            <p>${product.name}</p>
            <p>$${product.price}</p>`;

                featuredContainer.appendChild(productElement);
            });
        })
        .catch(error => console.error('Error loading products:', error));

    function getRandomProducts(products) {
        const randomProducts = [];
        const usedIndexes = [];

        while (randomProducts.length < 3) {
            const randomIndex = Math.floor(Math.random() * products.length);
            if (!usedIndexes.includes(randomIndex)) {
                usedIndexes.push(randomIndex);
                randomProducts.push(products[randomIndex]);
            }
        }

        return randomProducts;
    }
};
