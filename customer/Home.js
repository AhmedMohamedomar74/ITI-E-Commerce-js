const datalist = document.getElementById("categories");
const categoryInput = document.getElementById("categoryInput");
const xhr = new XMLHttpRequest();
xhr.open("GET", "http://localhost:3000/categories", true);
xhr.send();
xhr.onreadystatechange = function () {
  if (xhr.readyState === 4 && xhr.status === 200) {
    const categories = JSON.parse(xhr.responseText);

    categories.forEach(cat => {
      const option = document.createElement("option");
      option.value = cat.name;
      datalist.appendChild(option);
    });
  }
};

const productsContainer = document.getElementById("products");
function loadCategoriesWithProducts() {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", "http://localhost:3000/categories", true);

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      const categories = JSON.parse(xhr.responseText);
      productsContainer.innerHTML = "";
      categories.forEach(category => {
        const section = document.createElement("div");
        section.classList.add("category-section");

        // العنوان
        const title = document.createElement("h2");
        title.textContent = category.name;
        section.appendChild(title);

        // حاوية المنتجات
        const grid = document.createElement("div");
        grid.classList.add("category-products");
        section.appendChild(grid);

        // تحميل أول 4 منتجات فقط من الفئة
        loadProductsByCategory(category.id, grid);
        productsContainer.appendChild(section);
      });
    }
  };

  xhr.send();
}

function loadProductsByCategory(categoryId, container) {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", `http://localhost:3000/products?category=${categoryId}`, true);

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      const products = JSON.parse(xhr.responseText);
console.log(products[1].image);

      // نعرض فقط 4 منتجات
    products.slice(0, 4).forEach(product => {
  const card = document.createElement("div");
  card.className = "card";

  const img = document.createElement("img");
  img.src = product.image;
  img.alt = product.title;

  const title = document.createElement("h5");
  title.textContent = product.title;

  const price = document.createElement("p");
  price.textContent = `${product.price}$`;

  const link = document.createElement("a");
  link.href = `product-details.html?id=${product.id}`;
  link.textContent = "View Details";
  link.className = "details-link";
  card.appendChild(img);
  card.appendChild(title);
  card.appendChild(price);
  card.appendChild(link);
  container.appendChild(card);
});
    }
  };
  xhr.send();
}

loadCategoriesWithProducts();





;




