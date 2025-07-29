const url = "http://localhost:3000/categories";
const categoryForm = document.getElementById("categoryForm");
const categoryName = document.getElementById("categoryName");
const categoryId = document.getElementById("categoryId");
const categoryList = document.getElementById("categoryList");

function fetchCategories() {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.addEventListener("readystatechange", () => {
    if (xhr.readyState === 4 && xhr.status === 200) {
      const categories = JSON.parse(xhr.responseText);
      categoryList.innerHTML = "";
      categories.forEach((cat) => {
        const card = document.createElement("div");
        card.className = "category-card";
        card.dataset.id = cat.id;
        card.dataset.name = cat.name;
        card.innerHTML = `
        <h3>${cat.name}</h3>
          <button class="edit-btn">Edit</button>
          <button class="delete-btn">Delete</button>`;
        categoryList.appendChild(card);
      });
    }
  });
  xhr.send();
}

//add category
function addCategory(name) {
  const xhrCheck = new XMLHttpRequest();
  xhrCheck.open("GET", url, true);
  xhrCheck.onreadystatechange = () => {
    if (xhrCheck.readyState === 4 && xhrCheck.status === 200) {
      const categories = JSON.parse(xhrCheck.responseText);

      const exists = categories.some(
        (cat) => cat.name.toLowerCase() === name.toLowerCase()
      );

      if (exists) {
        alert("Category already exists!");
        return;
      }
      // If not exists, proceed to add
      const xhr = new XMLHttpRequest();
      xhr.open("POST", url, true);
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && xhr.status === 201) {
          fetchCategories();
          window.dispatchEvent(new Event("categoriesUpdated"));
        }
      };
      xhr.send(JSON.stringify({ name }));
    }
  };
  xhrCheck.send();
}

//update category
function updateCategory(id, name) {
  const xhr = new XMLHttpRequest();
  xhr.open("PUT", `${url}/${id}`, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.addEventListener("readystatechange", () => {
    if (xhr.readyState === 4 && xhr.status === 200) {
      fetchCategories();
      window.dispatchEvent(new Event("categoriesUpdated"));
    }
  });
  xhr.send(JSON.stringify({ id, name }));
}

//delete category
function deleteCategory(id) {
  const xhr = new XMLHttpRequest();
  xhr.open("DELETE", `${url}/${id}`, true);
  xhr.addEventListener("readystatechange", () => {
    if (xhr.readyState === 4 && xhr.status === 200) {
      fetchCategories();
      window.dispatchEvent(new Event("categoriesUpdated"));
    }
  });
  xhr.send();
}

//event listeners to buttons
categoryList.addEventListener("click", (e) => {
  const card = e.target.closest(".category-card");
  if (e.target.classList.contains("edit-btn")) {
    categoryId.value = card.dataset.id;
    categoryName.value = card.dataset.name;
  }
  if (e.target.classList.contains("delete-btn")) {
    if (confirm("Are you sure?")) deleteCategory(card.dataset.id);
  }
});

//send form data
categoryForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (categoryId.value) {
    updateCategory(categoryId.value, categoryName.value);
  } else {
    addCategory(categoryName.value);
  }
  categoryForm.reset();
});

fetchCategories();
