/**
 * add chipping method
 *      in DB then reterive and price
 * add cuppon
 * make a putton to confirm and send to DB
 */


/**
 * {
 *      "Products" : 
 *                  {
 *                      { "id" : ,
 *                         "name" : ,
 *                          "Qunatity" :
 *                         }
 *                      }
 * }
 */
var ChippingListContainerDiv = document.getElementById("ChippingListContainer")
var ButtonContainer = document.getElementById("ButtonContainer")
var httpGetShippingMethods = new XMLHttpRequest()
var chippingMethodsList = []
function reteriveShippingMethods()
{
    httpGetShippingMethods.open("GET","http://localhost:3000/shipping_methods")
    httpGetShippingMethods.send()
}


httpGetShippingMethods.addEventListener("readystatechange",()=>
{
    if ((httpGetShippingMethods.readyState == 4) && (httpGetShippingMethods.status == 200)) {
        chippingMethodsList = JSON.parse(httpGetShippingMethods.response)
        console.log(chippingMethodsList)
        var label = document.createElement("label")
        label.setAttribute("for","ShippinMethod")
        label.innerHTML = `Choose SHipping Method  `
        var selectElement = document.createElement("select")
        for (const element of chippingMethodsList) {
            var option = document.createElement("option")
            option.innerText =  element.name
            option.setAttribute("value",`${element.id}`)
            console.log({"id" : element.id})
            selectElement.appendChild(option)
        }
        ChippingListContainerDiv.append(label,selectElement)
    }
})

reteriveShippingMethods()


var sendOrderButton = document.createElement("button")
sendOrderButton.innerHTML = "sumbit"
ButtonContainer.appendChild(sendOrderButton)

sendOrderButton.addEventListener("click",()=>
{
    var shippingMethodId = document.querySelector("#ChippingListContainer select").value
    var shippingMethodOpject = chippingMethodsList.find((shippingMethod)=>
    {
        return shippingMethod.id == shippingMethodId
    })

    var allProcutsInCart = JSON.parse(localStorage.getItem("cart"))
    var totalPrice = 0
    for (const element of allProcutsInCart) {
        totalPrice += element.price
    }
    totalPrice +=shippingMethodOpject.price
    // console.log({shippingMethodOpject , allProcutsInCart , totalPrice , "UserID":Math.floor(Math.random() * 10) + 1})
    // var Order = JSON({shippingMethodOpject , allProcutsInCart , totalPrice , "UserID":Math.floor(Math.random() * 10) + 1})
    // console.log(Order)
    var Order = {
        products : allProcutsInCart,
        shipping_method : shippingMethodOpject,
        total_price : totalPrice,
        user_id : Math.floor(Math.random() * 10) + 1
    }
    console.log(Order)
    httpGetShippingMethods.open("POST","http://localhost:3000/orders")
    httpGetShippingMethods.setRequestHeader('Content-Type', 'application/json')
    httpGetShippingMethods.send(JSON.stringify(Order))
})