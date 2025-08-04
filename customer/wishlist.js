const cartContainer = document.getElementById("wishlistContainer");
// Reterive Data
function getCartData() {
    const cartData = localStorage.getItem("wishList");
    return cartData ? JSON.parse(cartData) : [];
}

function formatPrice(price) {
    return `$${price.toFixed(2)}`;
}

function createProductCard(product) {
    const card = document.createElement("div");
    card.setAttribute("class","cardwishlist")
    // card.setAttribute("data-productPrice",`${product.price}`)
    card.dataset.productId = product.id
    // card.setAttribute("data-productId",`${product.id}`)    
    card.innerHTML = `
        <img src="${product.image}" alt="${product.title}">
        <div>
            <h3>${product.title}</h3>
            <p>${formatPrice(product.price)}</p>
        </div>
        <button class="delete-btn">Delete</button>
    `;
    
    return card;
}


function renderProducts(products) {
    cartContainer.innerHTML = '';
    for (const element of products) {
        cartContainer.appendChild(createProductCard(element));
    }
    addActionButtons();
}




function addActionButtons() {
    const buttonContainer = document.createElement("div");
    buttonContainer.className = "button-container";
    
    buttonContainer.innerHTML = `
        <button class="cancel-btn">Cancel</button>
    `;
    
    cartContainer.appendChild(buttonContainer);
    setupEventListeners();
}


function setupEventListeners() {
    setupDeleteListeners();
    setupCancelListener();
}




function setupDeleteListeners() {
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const parentCard = e.target.closest('.cardwishlist');
            const productId = parentCard.dataset.productId;
            console.log(productId)
            
            let products = getCartData();
            products = products.filter(product => product.id != productId);
            
            localStorage.removeItem("wishlist")
            localStorage.setItem("wishlist", JSON.stringify(products));
            parentCard.remove();
        });
    });
}




function setupCancelListener() {
    document.querySelector('.cancel-btn')?.addEventListener('click', () => {
        console.log("Order canceled");
        // Add any cancel functionality here
        // it should go back from history
        history.back()
    });
}


function initCart() {
    const products = getCartData();
    console.log(products)
    renderProducts(products);

}

initCart()