// const isUserAdmin = sessionStorage.getItem("isadmin");
// if (!isUserAdmin || isUserAdmin === "false") {
//   window.location.href = "../products.html";
// }

const urlProducts = "http://localhost:3000/products";
const urlCategories = "http://localhost:3000/categories";

const productForm = document.getElementById("productForm");
const productList = document.getElementById("productList");

const productId = document.getElementById("productId");
const productTitle = document.getElementById("productTitle");
const productPrice = document.getElementById("productPrice");
const productImage = document.getElementById("productImage");
const productDesc = document.getElementById("productDesc");
const productCategory = document.getElementById("productCategory");

// Fetch categories and populate the select dropdown
function loadCategories() {
  const xhhtp = new XMLHttpRequest();
  xhhtp.open("GET", urlCategories, true);
  xhhtp.addEventListener("readystatechange", () => {
    if (xhhtp.readyState === 4 && xhhtp.status === 200) {
      const categories = JSON.parse(xhhtp.responseText);
      productCategory.innerHTML = "";
      categories.forEach((cat) => {
        const option = document.createElement("option");
        option.value = cat.id;
        option.textContent = cat.name;
        productCategory.appendChild(option);
      });
    }
  });
  xhhtp.send();
}

// show products
function fetchProducts() {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", urlProducts, true);
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4 && xhr.status === 200) {
      const products = JSON.parse(xhr.responseText);
      productList.innerHTML = "";

      products.forEach((prod) => {
        const card = document.createElement("div");
        card.className = "product-card";
        card.dataset.id = prod.id;

        card.innerHTML = `
        <img src="${prod.image}" alt="${prod.title}">
          <h3>${prod.title}</h3>
          <p>${prod.price}</p>
          <button class="edit-btn">Edit</button>
          <button class="delete-btn">Delete</button>
        `;
        productList.appendChild(card);
      });
    }
  };
  xhr.send();
}

//add product
function addProduct(product) {
  // Check if product already exists
  const xhrCheck = new XMLHttpRequest();
  xhrCheck.open("GET", urlProducts, true);
  xhrCheck.onreadystatechange = () => {
    if (xhrCheck.readyState === 4 && xhrCheck.status === 200) {
      const products = JSON.parse(xhrCheck.responseText);

      const exists = products.some(
        (p) =>
          p.title.toLowerCase() === product.title.toLowerCase() &&
          p.category == product.category
      );

      if (exists) {
        alert("product already exists in this category!");
        return;
      }

      // If not exists → Add new product
      const xhr = new XMLHttpRequest();
      xhr.open("POST", urlProducts, true);
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && xhr.status === 201) {
          fetchProducts();
        }
      };
      xhr.send(JSON.stringify(product));
    }
  };
  xhrCheck.send();
}

//update Product
function updateProduct(id, product) {
  const xhr = new XMLHttpRequest();
  xhr.open("PUT", `${urlProducts}/${id}`, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4 && xhr.status === 200) {
      fetchProducts();
    }
  };
  xhr.send(JSON.stringify(product));
}

//delete product
function deleteProduct(id) {
  const xhr = new XMLHttpRequest();
  xhr.open("DELETE", `${urlProducts}/${id}`, true);
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4 && xhr.status === 200) {
      fetchProducts();
    }
  };
  xhr.send();
}

// set up for buttons edit , delete
productList.addEventListener("click", (e) => {
  const card = e.target.closest(".product-card");
  if (!card) return;

  if (e.target.classList.contains("edit-btn")) {
    productId.value = card.dataset.id;

    //get data and add it in the form
    const xhr = new XMLHttpRequest();
    xhr.open("GET", `${urlProducts}/${card.dataset.id}`, true);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 && xhr.status === 200) {
        const prod = JSON.parse(xhr.responseText);
        productTitle.value = prod.title;
        productPrice.value = prod.price;
        productImage.value = prod.image;
        productDesc.value = prod.description;
        productCategory.value = prod.category;
      }
    };
    xhr.send();
  }

  if (e.target.classList.contains("delete-btn")) {
    if (confirm("Are you Sure?")) {
      deleteProduct(card.dataset.id);
    }
  }
});

//send to form
productForm.addEventListener("submit", (e) => {
  e.preventDefault();

  if (productTitle.value.trim() === "") {
    alert("Product title is required!");
    return;
  }

  if (isNaN(productPrice.value) || parseFloat(productPrice.value) <= 0) {
    alert("Price must be a number greater than 0!");
    return;
  }

  if (!productImage.value.startsWith("http")) {
    alert("Image URL must start with http!");
    return;
  }

  if (productDesc.value.trim().length < 10) {
    alert("Description must be at least 10 characters!");
    return;
  }

  const productData = {
    title: productTitle.value,
    price: parseFloat(productPrice.value),
    description: productDesc.value,
    category: productCategory.value,
    image: productImage.value,
    rating: { rate: 0, count: 0 },
  };

  if (productId.value) {
    updateProduct(productId.value, productData);
  } else {
    addProduct(productData);
  }

  productForm.reset();
  productId.value = "";
});

loadCategories();
fetchProducts();

window.addEventListener("categoriesUpdated", () => {
  loadCategories();
});
