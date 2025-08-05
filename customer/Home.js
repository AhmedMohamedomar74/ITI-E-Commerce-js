const datalist = document.getElementById("categories");
const categoryInput = document.getElementById("categoryInput");
const productsContainer = document.getElementById("products");
let bars =document.getElementById('bars');
  let navLinks = document.getElementById('navLinks');
  let categoryBox = document.getElementById('categoryBox');
  let iconsBox = document.getElementById('iconsBox');
  // let navbar_=document.getElementById('navbar_');
bars.addEventListener('click',function(){
 navLinks.classList.toggle('d-hide');
    categoryBox.classList.toggle('d-hide');
    iconsBox.classList.toggle('d-hide');
 
      navbar_.style.display='block'
   
})
//  تحميل الكاتيجوري
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

//  عند اختيار كاتيجوري
categoryInput.addEventListener("change", function () {
  const selectedCategory = this.value;

  const xhrFind = new XMLHttpRequest();
  xhrFind.open("GET", "http://localhost:3000/categories", true);
  xhrFind.send();

  xhrFind.onreadystatechange = function () {
    if (xhrFind.readyState === 4 && xhrFind.status === 200) {
      const categories = JSON.parse(xhrFind.responseText);
      const foundCategory = categories.find(cat => cat.name === selectedCategory);

      if (foundCategory) {
        showSingleCategory(foundCategory);
      }
    }
  };
});

// عرض كونتينر واحد للكاتيجوري المختارة
function showSingleCategory(category) {
  showLoading()
  const xhr = new XMLHttpRequest();
  xhr.open("GET", `http://localhost:3000/products?category=${category.id}`, true);
  xhr.send();

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      hideLoading()
      const products = JSON.parse(xhr.responseText);

      //  مسح الصفحة بالكامل
      productsContainer.innerHTML = "";

      //  إنشاء سكشن واحد
      const section = document.createElement("div");
      section.classList.add("category-section");

      // العنوان
      const title = document.createElement("h2");
      title.textContent = category.name;
      section.appendChild(title);

      // المنتجات
      const grid = document.createElement("div");
      grid.classList.add("category-products");

      products.forEach(product => {
        const card = document.createElement("div");
        card.className = "card";

        const img = document.createElement("img");
        img.src = product.image;
        img.alt = product.title;

        const productTitle = document.createElement("h5");
        productTitle.textContent = product.title;

        const price = document.createElement("p");
        price.textContent = `${product.price}$`;

        const link = document.createElement("a");
        link.href = `product-details.html?id=${product.id}`;
        link.textContent = "View Details";
        link.className = "details-link";

        card.appendChild(img);
        card.appendChild(productTitle);
        card.appendChild(price);
        card.appendChild(link);
        grid.appendChild(card);
      });

      section.appendChild(grid);
      productsContainer.appendChild(section);
    }
  };
}

//  تحميل كل الكاتيجوري + 4 منتجات لكل فئة (عند فتح الصفحة)
function loadCategoriesWithProducts() {
  showLoading()
  const xhr = new XMLHttpRequest();
  xhr.open("GET", "http://localhost:3000/categories", true);

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      const categories = JSON.parse(xhr.responseText);
      productsContainer.innerHTML = "";

      categories.forEach(category => {
        const section = document.createElement("div");
        section.classList.add("category-section");

        const title = document.createElement("h2");
        title.textContent = category.name;
        section.appendChild(title);

        const grid = document.createElement("div");
        grid.classList.add("category-products");
        section.appendChild(grid);

        // تحميل 4 منتجات
        const xhrProducts = new XMLHttpRequest();
        xhrProducts.open("GET", `http://localhost:3000/products?category=${category.id}`, true);
        xhrProducts.send();
        xhrProducts.onreadystatechange = function () {
          if (xhrProducts.readyState === 4 && xhrProducts.status === 200) {
            hideLoading()
            const products = JSON.parse(xhrProducts.responseText);

            products.slice(0, 4).forEach(product => {
              const card = document.createElement("div");
              card.className = "card";

              const img = document.createElement("img");
              img.src = product.image;
              img.alt = product.title;

              const productTitle = document.createElement("h5");
              productTitle.textContent = product.title;

              const price = document.createElement("p");
              price.textContent = `${product.price}$`;

              const link = document.createElement("a");
              link.href = `product-details.html?id=${product.id}`;
              link.textContent = "View Details";
              link.className = "details-link";
              card.appendChild(img);
              card.appendChild(productTitle);
              card.appendChild(price);
              card.appendChild(link);
              grid.appendChild(card);
            });
          }
        };
        productsContainer.appendChild(section);
      });
    }
  };

  xhr.send();
}
//loading
const loading = document.getElementById("loading");
function showLoading() {
  loading.style.display = "block";
}

function hideLoading() {
  loading.style.display = "none";
}

loadCategoriesWithProducts();
