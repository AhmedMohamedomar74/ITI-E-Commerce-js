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
function reteriveShippingMethods()
{
    httpGetShippingMethods.open("GET","http://localhost:3000/shipping_methods")
    httpGetShippingMethods.send()
}


httpGetShippingMethods.addEventListener("readystatechange",()=>
{
    if ((httpGetShippingMethods.readyState == 4) && (httpGetShippingMethods.status == 200)) {
        var chippingList = JSON.parse(httpGetShippingMethods.response)
        console.log(chippingList)
        var label = document.createElement("label")
        label.setAttribute("for","ShippinMethod")
        label.innerHTML = `Choose SHipping Method  `
        var selectElement = document.createElement("select")
        for (const element of chippingList) {
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

ButtonContainer.addEventListener("click",()=>
{
    var shippingMethod = document.querySelector("#ChippingListContainer select").value
    console.log(shippingMethod)
})