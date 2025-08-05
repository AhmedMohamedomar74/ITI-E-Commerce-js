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

document.addEventListener("DOMContentLoaded", () => {
  var params = new URLSearchParams(window.location.search);
  var productId = params.get("id");
  var xhr = new XMLHttpRequest();
  xhr.open("GET", `http://localhost:3000/products/${productId}`);
  xhr.send();
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      var product = JSON.parse(xhr.response);
      console.log(product);
      displayProductDetails(product);
    }
  };
});
function displayProductDetails(product) {
  var container = document.querySelector(".product-details-container");
  container.innerHTML = `
    <div class="product-details-card">
      <img src="${product.image}" alt="${product.title}">
      <div class="details">
        <h2>${product.title}</h2>
        <p class="price">${product.price}$</p>
        <p class="description">${product.description}</p>
        <div class="buttons">
          <button class="btn-cart">Add to Cart</button>
          <button class="btn-wishlist">♡ Wishlist</button>
        </div>
      </div>
    </div>
  `;

  container.querySelector(".btn-cart").addEventListener("click", () => addToCart(product));
  container.querySelector(".btn-wishlist").addEventListener("click", () => addToWishlist(product));
}
function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let existingProduct = cart.find(item => item.id === product.id);

  if (existingProduct) {
    existingProduct.quantity += 1; 
  } else {
    product.quantity = 1;
    cart.push(product);
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  alert(`Added to cart`);
}
function addToWishlist(product) {
  let wishList = JSON.parse(localStorage.getItem("wishList")) || [];
  let existingProduct = wishList.find(item => item.id === product.id);
  if (existingProduct) {
    alert(`Product is already in your wishlist`);
  } else {
    wishList.push(product);
    localStorage.setItem("wishList", JSON.stringify(wishList));
    alert(`Added to wishlist`);
  }
}
