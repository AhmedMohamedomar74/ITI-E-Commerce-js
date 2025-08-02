const ordersUrl = "http://localhost:3000/orders";
const shippingUrl = "http://localhost:3000/shipping_methods";

const ordersContainer = document.getElementById("orders-container");
const tabs = document.querySelectorAll(".tab-btn");
let shippingMethods = [];
let allOrders = [];
let currentFilter = "all";

// fetch shipping
function fetchShippingMethods(callback) {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", shippingUrl, true);
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4 && xhr.status === 200) {
      shippingMethods = JSON.parse(xhr.responseText) || [];
      if (callback) callback();
    }
  };
  xhr.send();
}

// fetch orders
function fetchOrders() {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", ordersUrl, true);
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4 && xhr.status === 200) {
      allOrders = JSON.parse(xhr.responseText) || [];
      renderOrders(currentFilter);
    }
  };
  xhr.send();
}

// render orders with filter
function renderOrders(filter) {
  ordersContainer.innerHTML = "";

  const filteredOrders =
    filter === "all" ? allOrders : allOrders.filter((o) => o.status === filter);

  filteredOrders.forEach((order) => {
    const card = document.createElement("div");
    card.className = "order-card";

    const total =
      order.total_price ||
      (order.products || []).reduce((sum, p) => sum + p.price * p.quantity, 0);

    const shipping =
      shippingMethods.find((s) => s.id === order.shipping_method?.id) ||
      order.shipping_method;

    const productsHTML = (order.products || [])
      .map(
        (p) => `
        <div class="product-item" style="display:flex; align-items:center; gap:8px; margin-bottom:5px;">
          <img src="${p.image}" alt="${
          p.title
        }" style="width:40px; height:40px; object-fit:cover; border-radius:5px;">
          <p style="margin:0;">${p.title} (x${p.quantity}) - $${p.price.toFixed(
          2
        )}</p>
        </div>`
      )
      .join("");

    card.innerHTML = `
      <h3>Order #${order.id}</h3>
      <p><strong>User ID:</strong> ${order.user_id || "Unknown"}</p>
      <div class="order-products" style="max-height:200px; overflow-y:auto; border:1px solid #ccc; padding:8px; border-radius:5px;">
        ${productsHTML || "<p>No products</p>"}
      </div>
      <p><strong>Total:</strong> $${total.toFixed(2)}</p>
      <p><strong>Shipping:</strong> ${shipping?.name || "N/A"} - $${
      shipping?.price || 0
    }</p>
      <p><strong>Status:</strong> ${order.status || "pending"}</p>
      <div class="order-actions">
        ${
          order.status === "pending"
            ? `
          <button class="accept-btn" data-id="${order.id}" data-action="accepted">Accept</button>
          <button class="reject-btn" data-id="${order.id}" data-action="rejected">Reject</button>
          `
            : ""
        }
      </div>
    `;

    ordersContainer.appendChild(card);
  });

  // Attach events again
  document.querySelectorAll(".accept-btn, .reject-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = e.target.dataset.id;
      const action = e.target.dataset.action;
      updateStatus(id, action);
    });
  });
}

// update order
function updateStatus(id, newStatus) {
  const xhr = new XMLHttpRequest();
  xhr.open("PATCH", `${ordersUrl}/${id}`, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4 && xhr.status === 200) {
      fetchOrders(); // reload after update
    }
  };
  xhr.send(JSON.stringify({ status: newStatus }));
}

// tab buttons events
tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");
    currentFilter = tab.dataset.status;
    renderOrders(currentFilter);
  });
});

fetchShippingMethods(fetchOrders);
