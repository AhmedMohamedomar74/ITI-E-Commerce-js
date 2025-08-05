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

const productsContainer = document.getElementById("allProductsContainer");

const xhr = new XMLHttpRequest();
xhr.open("GET", "http://localhost:3000/products", true);
xhr.send();
xhr.onreadystatechange = function () {
  if (xhr.readyState === 4) {
    if (xhr.status === 200) {
      const products = JSON.parse(xhr.responseText);

      // لو مفيش منتجات
      if (!products.length) {
        productsContainer.innerHTML = "<p>No products available.</p>";
        return;
      }

      // إنشاء كارت لكل منتج
      products.forEach((product) => {
        const card = document.createElement("div");
        card.className = "card";

        const img = document.createElement("img");
        img.src = product.image;
        img.alt = product.title;

        const title = document.createElement("h5");
        title.textContent = product.title;

        
        const price = document.createElement("p");
        price.textContent = `${product.price}$`;

        // زر التفاصيل
        const link = document.createElement("a");
        link.href = `product-details.html?id=${product.id}`;
        link.textContent = "View Details";
        link.className = "details-link";

        card.appendChild(img);
        card.appendChild(title);
        card.appendChild(price);
        card.appendChild(link);

        productsContainer.appendChild(card);
      });
    } else {
      productsContainer.innerHTML = "<p>Failed to load products.</p>";
    }
  }
};
