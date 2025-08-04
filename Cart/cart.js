const cartContainer = document.getElementById("cartContainer");
const totalPriceContainer = document.getElementById("TotalPrcieContainet");

// Reterive Data
function getCartData() {
    const cartData = localStorage.getItem("cart");
    return cartData ? JSON.parse(cartData) : [];
}

function calculateProductTotal(price, quantity = 1) {
    console.log({price,quantity})
    return price * quantity;
}

function formatPrice(price) {
    return `$${price.toFixed(2)}`;
}

function createProductCard(product) {
    const card = document.createElement("div");
    card.setAttribute("class","cardProduct")
    card.dataset.productPrice = product.price
    // card.setAttribute("data-productPrice",`${product.price}`)
    card.dataset.productId = product.id
    // card.setAttribute("data-productId",`${product.id}`)

    const quantity = product.quantity || 1;
    const totalPrice = calculateProductTotal(product.price, quantity);
    
    card.innerHTML = `
        <img src="${product.image}" alt="${product.title}">
        <div>
            <h3>${product.title}</h3>
            <p>${formatPrice(product.price)}</p>
            <button class="delete-btn">Delete</button>
        </div>
        <input type="number" min="1" value="${quantity}">
        
        <h5>Total price: ${formatPrice(totalPrice)}</h5>
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


function updateCartTotal() {
    const priceElements = document.querySelectorAll(".cardProduct h5");
    let total = 0;
    
    // priceElements.forEach(element => {
    //     const priceText = element.textContent;
    //     const priceValue = parseFloat(priceText.match(/\d+\.\d{2}/)[0]);
    //     total += priceValue;
    // });

    for (const element of priceElements) {
        // var priceString = element.innerHTML
        // console.log({priceString})
        var lastIndexbeforeNumber = element.innerHTML.indexOf("$")
        var priceOneCard = element.innerHTML.substring(lastIndexbeforeNumber + 1, element.innerHTML.length)
        total += Number(priceOneCard)
    }
    
    totalPriceContainer.innerHTML = `<span>Total Price: ${formatPrice(total)}</span>`;
}

function addActionButtons() {
    const buttonContainer = document.createElement("div");
    buttonContainer.className = "button-container";
    
    buttonContainer.innerHTML = `
        <button class="cancel-btn">Cancel</button>
        <button class="submit-btn">Submit Order</button>
    `;
    
    cartContainer.appendChild(buttonContainer);
    setupEventListeners();
}


function setupEventListeners() {
    setupQuantityListeners();
    setupDeleteListeners();
    setupSubmitListener();
    setupCancelListener();
}


function setupQuantityListeners() {
    document.querySelectorAll('.cardProduct input[type="number"]').forEach(input => {
        input.addEventListener('change', (e) => {
            console.log("Qunatity event trigger")
            const parentCard = e.target.closest('.cardProduct');
            const price = parseFloat(parentCard.dataset.productPrice);
            const quantity = parseInt(e.target.value);
            const totalSpan = parentCard.querySelector('span');
            
            totalSpan.textContent = `Total price: ${formatPrice(calculateProductTotal(price, quantity))}`;
            console.log(totalSpan.textContent)
            updateCartTotal();
        });
    });
}

function setupDeleteListeners() {
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const parentCard = e.target.closest('.cardProduct');
            const productId = parentCard.dataset.productId;
            
            let products = getCartData();
            products = products.filter(product => product.id != productId);
            
            localStorage.removeItem("cart")
            localStorage.setItem("cart", JSON.stringify(products));
            parentCard.remove();
            updateCartTotal();
        });
    });
}



function setupSubmitListener() {
    document.querySelector('.submit-btn')?.addEventListener('click', () => {
        const quantities = [];
        document.querySelectorAll('.cardProduct input[type="number"]').forEach(input => {
            quantities.push(parseInt(input.value));
        });
        
        let products = getCartData();
        for (let index = 0; index < products.length; index++) {
            products[index].quantity = quantities[index];
        }
        localStorage.removeItem("cart")
        localStorage.setItem("cart", JSON.stringify(products));
        window.location.href = "./placingOrder.html";
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
    renderProducts(products);
    updateCartTotal();
}

initCart()