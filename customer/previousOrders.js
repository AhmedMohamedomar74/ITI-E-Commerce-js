var userId = getCookieByName("userId")
var orderReq = new XMLHttpRequest()
var Orders = []

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



function requestOrders() {
    var orderQuery = `http://localhost:3000/orders?user_id=${userId}&status=accepted`
    orderReq.open("GET", orderQuery)
    orderReq.send()
    handleRecievedOrders()
}

function handleRecievedOrders() {
    orderReq.addEventListener("readystatechange", () => {
        if ((orderReq.status == 200) && (orderReq.readyState == 4)) {
            Orders = JSON.parse(orderReq.response)
            console.log(Orders)
            renderOrders(Orders,`orders-list`)
        }
    })
}


// Function to create an order container
function createOrderContainer(order) {
  const container = document.createElement('div');
  container.className = 'order-container';
  
  // Add header
  container.appendChild(createOrderHeader(order));
  
  // Add shipping info
  container.appendChild(createShippingInfo(order.shipping_method));
  
  // Add products
  container.appendChild(createProductsGrid(order.products));
  
  // Add total price
  container.appendChild(createTotalPrice(order.total_price));
  
  return container;
}

// Function to create order header
function createOrderHeader(order) {
  const header = document.createElement('div');
  header.className = 'order-header';
  
  const orderId = document.createElement('div');
  orderId.className = 'order-id';
  orderId.textContent = `Order #${order.id}`;
  
  const orderStatus = document.createElement('div');
  orderStatus.className = `order-status status-${order.status}`;
  orderStatus.textContent = order.status.charAt(0).toUpperCase() + order.status.slice(1);
  
  header.appendChild(orderId);
  header.appendChild(orderStatus);
  
  return header;
}

// Function to create shipping info section
function createShippingInfo(shippingMethod) {
  const shippingInfo = document.createElement('div');
  shippingInfo.className = 'shipping-info';
  
  const method = document.createElement('div');
  method.className = 'shipping-method';
  method.textContent = shippingMethod.name;
  
  const description = document.createElement('div');
  description.textContent = shippingMethod.description;
  
  const price = document.createElement('div');
  price.textContent = `Shipping cost: $${shippingMethod.price}`;
  
  shippingInfo.appendChild(method);
  shippingInfo.appendChild(description);
  shippingInfo.appendChild(price);
  
  return shippingInfo;
}

// Function to create products grid
function createProductsGrid(products) {
  const container = document.createElement('div');
  container.className = 'products-container';
  
  products.forEach(product => {
    container.appendChild(createProductCard(product));
  });
  
  return container;
}

// Function to create individual product card
function createProductCard(product) {
  const card = document.createElement('div');
  card.className = 'product-card';
  
  const image = document.createElement('img');
  image.className = 'product-image';
  image.src = product.image;
  image.alt = product.title;
  
  const title = document.createElement('div');
  title.className = 'product-title';
  title.textContent = product.title;
  
  const price = document.createElement('div');
  price.className = 'product-price';
  price.textContent = `$${product.price}`;
  
  // Add quantity display
  const quantity = document.createElement('div');
  quantity.className = 'product-quantity';
  quantity.textContent = `Quantity: ${product.quantity || 1}`;
  
  card.appendChild(image);
  card.appendChild(title);
  card.appendChild(price);
  card.appendChild(quantity);
  
  return card;
}

// Function to create total price section
function createTotalPrice(totalPrice) {
  const container = document.createElement('div');
  container.className = 'total-price';
  container.textContent = `Total: ${totalPrice}`;
  return container;
}

// Function to render all orders
function renderOrders(orders, targetElementId) {
  const targetElement = document.getElementById(targetElementId);
  
  if (!targetElement) {
    console.error(`Target element with ID ${targetElementId} not found`);
    return;
  }
  
  // Clear existing content
  targetElement.innerHTML = '';
  
  // Add a heading
  const heading = document.createElement('h1');
  heading.textContent = 'Your Orders';
  targetElement.appendChild(heading);
  
  // Create and append each order
  orders.forEach(order => {
    targetElement.appendChild(createOrderContainer(order));
  });
}

// Example usage with your JSON data:
// Assuming you have a div with id="orders-list" in your HTML
// renderOrders(ordersData, 'orders-list');

requestOrders()