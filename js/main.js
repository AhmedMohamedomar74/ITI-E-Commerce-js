let productTitle = document.getElementById("title");
let price = document.getElementById("price");
let taxes = document.getElementById("taxes");
let ads = document.getElementById("ads");
let total = document.getElementById("total");
let count = document.getElementById("count");
let search = document.getElementById("search");
let discount = document.getElementById("discount");
let tbody = document.querySelector("tbody");
let Create = document.getElementById("Create");
let DeleteAllData = document.querySelector(".DeleteAll");
let mod = "Create";
let temp;
let ProductData;
if (localStorage.getItem("Myproduct") !== null) {
  ProductData = JSON.parse(localStorage.getItem("Myproduct"));
  // all data
  display(ProductData);
} else {
  ProductData = [];
  display(ProductData);
}

let category = document.getElementById("category");
//calc product price after taxes ads discount
function calcPrice() {
  if (price.value != "") {
    let results =
      Number(price.value) +
      Number(taxes.value) +
      Number(ads.value) -
      Number(discount.value);
    total.innerHTML = "Total:" + results;
    total.style.background = "rgb(73, 244, 54)";
  } else {
    total.innerHTML = "Total:";
    total.style.background = "rgb(244, 54, 54)";
  }
}
price.addEventListener("keyup", calcPrice);
taxes.addEventListener("keyup", calcPrice);
ads.addEventListener("keyup", calcPrice);
discount.addEventListener("keyup", calcPrice);
Create.addEventListener("click", creatProduct);
DeleteAllData.addEventListener("click", DeleteAll);
// creat product

function creatProduct() {
  if (productTitle.value != '' && price.value != '' && count.value != '' && category.value !='' ) {
    let product = {
    title: productTitle.value,
    price: price.value,
    taxes: taxes.value,
    ads: ads.value,
    count: count.value,
    discount: discount.value,
    total: total.innerHTML,
    category: category.value,
  };

  if (mod === "Create") {
    if (product.count > 1) {
      for (let i = 0; i < product.count; i++) {
        ProductData.push(product);
      }
    } else {
      ProductData.push(product);
    }
  } else {
    ProductData[temp] = product;
    Create.innerHTML = "Create";
    mod = "Create";
    count.style.display = "inline";
  }

  localStorage.setItem("Myproduct", JSON.stringify(ProductData));
  clearData();
  display(ProductData);
  }
  
}
//clear inputs
function clearData() {
  productTitle.value = "";
  price.value = "";
  ads.value = "";
  taxes.value = "";
  discount.value = "";
  total.innerHTML = "Total";
  category.value = "";
  count.value = "";
}
///display products
function display(data) {
  let table = "";
  for (let i = 0; i < data.length; i++) {
    table += `
<tr>
  <td>${i + 1}</td>
  <td>${data[i].title}</td>
  <td>${data[i].price}</td>
  <td>${data[i].taxes}</td>
  <td>${data[i].ads}</td>
  <td>${data[i].discount}</td>
  <td>${data[i].total}</td>
  <td>${data[i].category}</td>
  <td><button onclick='updateProduct(${i})'  class=" btn btn-outline-warning rounded-pill">Update</button></td>
  <td><button onclick='deleteProduct(${i})' class="btn btn-outline-danger rounded-pill deleteOneProduct" >Delete</button></td>
</tr>

    `;
  }
  tbody.innerHTML = table;
  if (data.length > 0) {
    DeleteAllData.classList.remove("d-none");
    DeleteAllData.classList.add("d-inline");
    DeleteAllData.innerHTML = `Delete All (${data.length})`;
  } else {
    DeleteAllData.classList.remove("d-inline");
    DeleteAllData.classList.add("d-none");
  }
}
//Delete Product
function deleteProduct(i) {
  ProductData.splice(i, 1);
  localStorage.setItem("Myproduct", JSON.stringify(ProductData));
  display(ProductData);
}

// Delete All Data
function DeleteAll() {
  ProductData.length = 0;
  localStorage.removeItem("Myproduct");

  DeleteAllData.classList.add("d-none");
  display(ProductData);
}
// update product
function updateProduct(i) {
  temp = i;
  mod = "Update";

  productTitle.value = ProductData[i].title;
  price.value = ProductData[i].price;
  taxes.value = ProductData[i].taxes;
  ads.value = ProductData[i].ads;
  discount.value = ProductData[i].discount;
  category.value = ProductData[i].category;
  calcPrice();
  count.style.display = "none";
  Create.innerHTML = "Update";
  scroll({
    top: 0,
    behavior: "smooth",
  });
}
let moodSeach = "";
function modSearch(id) {
  console.log(id);
}

////Search
//create mode for choose between title or category

let SearchByCategory = document.getElementById("Search by category");
let SearchByTitle = document.getElementById("Search by title");
let searchMood = "title";
SearchByCategory.addEventListener("click", (e) => {
  modSearch(e.target.id);
});
SearchByTitle.addEventListener("click", (e) => {
  modSearch(e.target.id);
});
function modSearch(id) {
  if (id == "Search by title") {
    searchMood = "title";
  } else {
    searchMood = "category";
  }
  search.focus();
  search.placeholder = `${id}`;
}
search.addEventListener("keyup", () => {
  searchProduct(search.value);
});
// function search
function searchProduct(word) {
  let dataSearch = [];
  for (let i = 0; i < ProductData.length; i++) {
    if (searchMood == "title") {
      if (ProductData[i].title.toLowerCase().includes(word.toLowerCase())) {
        dataSearch.push(ProductData[i]);
      }
      display(dataSearch);
    } else {
      if (ProductData[i].category.toLowerCase().includes(word.toLowerCase())) {
        dataSearch.push(ProductData[i]);
      }
      display(dataSearch);
    }
  }
}
