/**
 * Reterive Date 
 * make card for each product 
 *      make delte and qunatity 
 * handle two requests cancle and supmit 
 */

var cartContainer = document.getElementById("cartContainer")

function ReteriveData() {
    productCartString = localStorage.getItem("cart")
    productCartJSONs = JSON.parse(productCartString)
    return productCartJSONs
}

var products = ReteriveData()
console.log(products)

function cartCard(products) {
    for (const element of products) {
        // create parentDiv (card Product)
        var cardProduct = document.createElement("div")
        cardProduct.setAttribute("data-productPrice", `${element.price}`)
        cardProduct.setAttribute("data-productID", `${element.id}`)
        cardProduct.setAttribute("class", "cardProduct")
        //add image
        var imgPrduct = document.createElement("img")
        imgPrduct.src = element.image
        // add title
        var title = document.createElement("h3")
        title.innerText = element.title
        // add price
        var price = document.createElement("p")
        price.innerText = `$${element.price}`
        // add input to quantity
        var textPox = document.createElement("input")
        textPox.type = "number"
        textPox.setAttribute("min", 1)
        if (element.hasOwnProperty("quantity")) {
            textPox.value = element.quantity
        }
        else {
            textPox.value = 1
        }
        // add totlal price
        var totalprice = document.createElement("span")
        if (element.hasOwnProperty("quantity")) {
            totalprice.innerText = `totlal peice : $${element.quantity * element.price}`
        }
        else {
            totalprice.innerText = `totlal peice : $${element.price}`
        }
        // add delete elemets 
        var deleteButton = document.createElement("button")
        deleteButton.setAttribute("class", "delete-btn")
        deleteButton.innerText = "Delete"
        //add all elemets in card product 
        cardProduct.append(imgPrduct, title, price, textPox, deleteButton, totalprice)
        // add card product to cartContainer
        cartContainer.appendChild(cardProduct)
    }
}

cartCard(products)


var totalPriceElemnts = document.querySelectorAll(`.cardProduct input[type="number"]`)
console.log(totalPriceElemnts)
for (const element of totalPriceElemnts) {
    element.addEventListener("change", (event) => {
        console.log("on input trigger")
        console.log(element.value)
        var ParentDiv = event.target.parentElement
        var spanEle = ParentDiv.querySelector("span")
        var productPrice = ParentDiv.getAttribute("data-ProductPrice")
        spanEle.innerText = `totlal peice : $${productPrice * element.value}`
        // Remove totlal price span before create it again
        var totlaPriceSpan = document.querySelector("#TotalPrcieContainet span")
        totlaPriceSpan.remove()
        addPrice()
    })

}


var deleteButtons = document.querySelectorAll(`.cardProduct .delete-btn`)
console.log(deleteButtons)

for (const element of deleteButtons) {
    element.addEventListener("click", (event) => {
        console.log("deletButton trigger")
        var parentElement = event.target.parentElement
        console.log({ "parent": parentElement })
        var productRemoveIndex = products.findIndex((product) => {
            console.log({ "ProductIdArr": product.id, "RequiredID": parentElement.getAttribute("data-productid") })
            return product.id == parentElement.getAttribute("data-productid")
        })
        console.log({ "buttonRquired": productRemoveIndex })
        products.splice(productRemoveIndex, 1)
        localStorage.removeItem("cart")
        localStorage.setItem("cart", JSON.stringify(products))
        parentElement.remove()
    })
}


function addSumpitButton() {
    var submitButton = document.createElement("button")
    submitButton.setAttribute("class", "submit-btn")
    submitButton.innerText = `Submit`
    cartContainer.appendChild(submitButton)
}


function addButtonsOrders() {
    var buttonContainer = document.createElement("div");
    buttonContainer.setAttribute("class", "button-container");

    var submitButton = document.createElement("button");
    submitButton.setAttribute("class", "submit-btn");
    submitButton.innerText = `Submit Order`;

    var cancelButton = document.createElement("button");
    cancelButton.setAttribute("class", "cancel-btn");
    cancelButton.innerText = `Cancel`;

    buttonContainer.append(cancelButton, submitButton);
    cartContainer.appendChild(buttonContainer);
}
addButtonsOrders()


function addPrice() {
    var priceElments = document.querySelectorAll(".cardProduct span")
    var sum = 0
    for (const element of priceElments) {
        console.log(element.innerHTML)
        var lastIndexbeforeNumber = element.innerHTML.indexOf("$")
        var priceOneCard = element.innerHTML.substring(lastIndexbeforeNumber + 1, element.innerHTML.length)
        console.log({ priceOneCard })
        sum += Number(priceOneCard)
    }
    var totalPriceELement = document.createElement("span")
    totalPriceELement.innerText = `total Price : ${sum}`
    var TotalPrcieContainet = document.getElementById("TotalPrcieContainet")
    TotalPrcieContainet.appendChild(totalPriceELement)
}

addPrice()
// document.querySelector()



var submitButton = document.querySelector(".button-container")

submitButton.addEventListener("click", () => {
    var qunatities = []
    console.log("Event trigger")
    var quantityElments = document.querySelectorAll(`.cardProduct input[type="number"]`)

    for (const element of quantityElments) {
        qunatities.push(element.value)
    }

    var allproductsString = localStorage.getItem("cart")
    var allproducts = JSON.parse(allproductsString)
    for (let index = 0; index < allproducts.length; index++) {
        allproducts[index].quantity = Number(qunatities[index])
    }
    localStorage.removeItem("cart")
    localStorage.setItem("cart",JSON.stringify(allproducts))
    location.assign("./placingOrder.html")
})



