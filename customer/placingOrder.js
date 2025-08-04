/**
 * add chipping method
 *      in DB then reterive and price
 * add cuppon
 * make a putton to confirm and send to DB
 */


/**
 * on enter cuppn send get request
 *      if valid supstract the price and chnage the total price
 *      else print in the span not valid
 *
 */
var OrderDetailsContainer = document.getElementById("OrderDetailsContianer")
var ChippingListContainerDiv = document.getElementById("ChippingListContainer")
var ButtonContainer = document.getElementById("ButtonContainer")
var priceAndCupponContainer = document.getElementById("PriceAndCupponContainer")
var totalPriceElement = document.querySelector("#totalPriceContainer p")
var httpGetShippingMethods = new XMLHttpRequest()
var cupponReq = new XMLHttpRequest()
var submitOrderReq = new XMLHttpRequest()
var discounValue = 0
var chippingMethodsList = []
var allProcutsInCart



function getCookieByName(name) {
    const nameEQ = name + "="; // Append an equals sign to the cookie name
    const ca = document.cookie.split(';'); // Split the document.cookie string into an array of individual cookies

    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') { // Remove leading spaces from the cookie string
            c = c.substring(1, c.length);
        }
        if (c.indexOf(nameEQ) === 0) { // Check if the cookie starts with the desired name
            return c.substring(nameEQ.length, c.length); // Return the cookie's value
        }
    }
    return null; // Return null if the cookie is not found
}


function checkCuppon(couponCode) {
    cupponReq.open("GET", `http://localhost:3000/coupons?code=${couponCode}`)
    cupponReq.send()
    cupponReq.onreadystatechange = function () {
        if ((cupponReq.status == 200) && (cupponReq.readyState == 4)) {
            var coupon = JSON.parse(cupponReq.response)
            console.log({ coupon })
            if (coupon.length) {
                var spanCupponResult = document.querySelector("#cupponContainer span")
                spanCupponResult.innerHTML = `Valid coupon`
                discounValue = coupon[0].price
                printTotalPrice(formatPrice(getTotalPrice() - discounValue))
            }
            else {
                var spanCupponResult = document.querySelector("#cupponContainer span")
                spanCupponResult.innerHTML = `Not valid coupon`
            }
        }
    }
}

function initSendCupon() {
    var couponButton = document.querySelector("#cupponContainer button")
    couponButton.addEventListener("click", () => {
        var inputCoupon = document.querySelector("#cupponContainer input").value
        checkCuppon(inputCoupon)
    })
}

function handleOnShippingChange() {
    var listShippingElment = ChippingListContainerDiv.querySelector("select")
    listShippingElment.addEventListener("change", () => {
        printTotalPrice(formatPrice(getTotalPrice() - discounValue))
    })

}

function getCartData() {
    const cartData = localStorage.getItem("cart");
    return cartData ? JSON.parse(cartData) : [];
}

function calculateProductTotal(price, quantity = 1) {
    return price * quantity;
}

function formatPrice(price) {
    return `$${price.toFixed(2)}`;
}

function createProductCard(product) {
    const card = document.createElement("div");
    card.setAttribute("class", "cardProduct")
    card.dataset.productPrice = product.price
    card.dataset.productId = product.id

    const quantity = product.quantity || 1;
    const totalProductPrice = calculateProductTotal(product.price, quantity);

    card.innerHTML = `
        <img src="${product.image}" alt="${product.title}">
        <div>
            <h3>${product.title}</h3>
            <p>${formatPrice(product.price)}</p>
            <span>Qunatity :${quantity}</span>
        </div>
        <span>Total price: ${formatPrice(totalProductPrice)}</span>
    `;

    return card;
}

function renderProducts(products) {
    OrderDetailsContainer.innerHTML = '';
    for (const element of products) {
        OrderDetailsContainer.appendChild(createProductCard(element));
    }
}

function reteriveShippingMethods() {
    httpGetShippingMethods.open("GET", "http://localhost:3000/shipping_methods")
    httpGetShippingMethods.send()
}

function handleSubmitOrder() {
    var submitBtn = document.querySelector(".button-container .submit-btn")
    submitBtn.addEventListener("click", () => {
        var shippingMethodId = document.querySelector("#ChippingListContainer select").value
        var shippingMethodOpject = chippingMethodsList.find((shippingMethod) => {
            return shippingMethod.id == shippingMethodId
        })


        var total_price = getTotalPrice()
        var Order = {
            products: allProcutsInCart,
            shipping_method: shippingMethodOpject,
            total_price: formatPrice(total_price),
            user_id: getCookieByName("userId"),
        }

        Order.status = "pendding"

        console.log({ Order })
        submitOrderReq.open("POST", "http://localhost:3000/orders")
        submitOrderReq.setRequestHeader('Content-Type', 'application/json')


        submitOrderReq.send(JSON.stringify(Order));
        // httpGetShippingMethods.send(JSON.stringify(Order))
        // localStorage.removeItem("cart")
        // history.back()
    })
}

function handleCancelOrder() {
    var cancelBtn = document.querySelector(".button-container .cancel-btn")
    cancelBtn.addEventListener("click", () => {
        history.back()
    })
}

function addActionButtons() {
    const buttonContainer = document.createElement("div");
    buttonContainer.className = "button-container";

    buttonContainer.innerHTML = `
        <button class="cancel-btn">Cancel</button>
        <button class="submit-btn">Submit Order</button>
    `;

    ButtonContainer.appendChild(buttonContainer);
    handleSubmitOrder();
    handleCancelOrder()
}

function printTotalPrice(totalprice) {
    totalPriceElement.innerHTML = `$${totalprice}`
}

function getTotalPrice() {
    var totalPrice = 0
    allProcutsInCart = getCartData()
    // allProcutsInCart = JSON.parse(allproductString)
    console.log({ "allproducts": allProcutsInCart })

    var shippingMethodId = document.querySelector("#ChippingListContainer select").value
    var shippingMethodOpject = chippingMethodsList.find((shippingMethod) => {
        return shippingMethod.id == shippingMethodId
    })


    for (const element of allProcutsInCart) {
        totalPrice += element.price
    }
    return totalPrice += shippingMethodOpject.price
}


httpGetShippingMethods.addEventListener("readystatechange", () => {
    if ((httpGetShippingMethods.readyState == 4) && (httpGetShippingMethods.status == 200)) {
        chippingMethodsList = JSON.parse(httpGetShippingMethods.response)
        console.log(chippingMethodsList)
        var label = document.createElement("label")
        label.setAttribute("for", "ShippinMethod")
        label.innerHTML = `Choose Shipping Method  `
        var selectElement = document.createElement("select")
        for (const element of chippingMethodsList) {
            var option = document.createElement("option")
            option.innerText = element.name
            option.setAttribute("value", `${element.id}`)
            console.log({ "id": element.id })
            selectElement.appendChild(option)
        }
        ChippingListContainerDiv.append(label, selectElement)

        printTotalPrice(formatPrice(getTotalPrice()))
        handleOnShippingChange()
    }
})



submitOrderReq.addEventListener("readystatechange",()=>
{
    if (submitOrderReq.readyState == 4) {
        if (submitOrderReq.status == 200 || submitOrderReq.status == 201) {
            // Success - clear cart and go back
            localStorage.removeItem("cart");
            console.log({order : "send"})
            // history.back();
            location.assign("./Home.html")
        } else {
            // Handle error
            console.error("Order submission failed:", submitOrderReq.statusText);
            alert("Failed to submit order. Please try again.");
        }
    }
})
reteriveShippingMethods()
var products = getCartData()
renderProducts(products)

addActionButtons()

initSendCupon()


// console.log(getCookieByName("userId"))