let list = JSON.parse(localStorage.getItem("list")) || [];
let currentUser = JSON.parse(localStorage.getItem("currentUser"));
let vocabs = list.filter((e) => e.userId == currentUser.id);
console.log(vocabs);

const addNewBtn = document.querySelector("#add-new");
const deleteBtn = document.querySelector(".delete");
const tableBody = document.querySelector("#table-body");
const searchBar = document.querySelector("#search-bar");
const selectBar = document.querySelector("#select-cate");
const logOutBtn = document.querySelector("#logout-btn");
const pagination = document.getElementById("pagination");

let currentPage = 1;
const itemsPerPage = 5;
let currentData = vocabs;
let listCate = JSON.parse(localStorage.getItem("listCate")) || [];

list = list.filter((item) =>
  listCate.some((cate) => cate.id == item.categoryId),
);
localStorage.setItem("list", JSON.stringify(list));

addNewBtn.addEventListener("click", async () => {
  const { value: formValues } = await Swal.fire({
    title: "Add New Word",
    html: `
      <div class="addnew">
      <div>
      <label>Word</label>
      <input id="word" class="swal2-input" placeholder="Enter Word">
      <span class="red" id="word-alert"></span>
      </div>
      <div>
      <label>Meaning</label>
      <textarea id="meaning" class="swal2-textarea" placeholder="Enter Meaning"></textarea>
      <span class="red" id="meaning-alert"></span>
      <select id="category" class="swal2-select"></select>
      <span class="red" id="select-alert"></span>
      <span class="red" id="duplicate-alert"></span>
      </div>
      </div>
    `,
    showCancelButton: true,
    reverseButtons: true,
    buttonsStyling: true,
    customClass: {
      actions: "my-actions",
    },

    didOpen: () => {
      const select = document.getElementById("category");

      let option = `<option value="">Select Category</option>`;
      listCate.forEach((cate) => {
        option += `<option value="${cate.id}">${cate.name}</option>`;
      });

      select.innerHTML = option;
    },

    preConfirm: () => {
      let isValidate = true;
      const word = document.getElementById("word").value.trim();
      const meaning = document.getElementById("meaning").value.trim();
      const categoryId = document.getElementById("category").value;
      const wordAlert = document.querySelector("#word-alert");
      const meaningAlert = document.querySelector("#meaning-alert");
      const selectAlert = document.querySelector("#select-alert");
      const duplicateAlert = document.querySelector("#duplicate-alert");

      if (!word) {
        wordAlert.innerText = "Word input can not blank";
        isValidate = false;
      }
      if (!meaning) {
        meaningAlert.innerText = "Meaning input can not blank";
        isValidate = false;
      }
      if (!categoryId) {
        selectAlert.innerText = "Select input can not blank";
        isValidate = false;
      }
      let wordSearch = list.find((e) => e.name == word);

      if (wordSearch) {
        duplicateAlert.innerText = "This word id already in words list";
        isValidate = false;
      }

      if (isValidate == false) {
        return false;
      }

      // if (!word || !meaning || !categoryId) {
      //   Swal.showValidationMessage("Please fill all fields!");
      //   return false;
      // }

      return { word, meaning, categoryId };
    },
  });

  if (formValues) {
    let item = {
      id: Date.now(),
      name: formValues.word,
      meaning: formValues.meaning,
      categoryId: formValues.categoryId,
      userId: currentUser.id,
    };

    list.unshift(item);
    localStorage.setItem("list", JSON.stringify(list));
    vocabs = list.filter((e) => e.userId == currentUser.id);

    renderData(vocabs);
  }
});

const renderPagination = (data) => {
  const totalPages = Math.ceil(data.length / itemsPerPage);

  if (totalPages === 0) {
    pagination.innerHTML = "";
    return;
  }

  let html = "";

  html += `
    <button class="page-btn ${currentPage === 1 ? "disabled" : ""}" data-page="prev">
      &laquo; Prev
    </button>
  `;

  for (let i = 1; i <= totalPages; i++) {
    html += `
      <button class="page-btn ${i === currentPage ? "active" : ""}" onclick="changePage(${i})" data-page="${i}">
        ${i}
      </button>
    `;
  }

  html += `
    <button class="page-btn ${currentPage === totalPages ? "disabled" : ""}" data-page="next">
      Next &raquo;
    </button>
  `;

  pagination.innerHTML = html;
};

const getCategoryName = (id) => {
  const cate = listCate.find((c) => c.id == id);
  return cate ? cate.name : "Unknown";
};

const changePage = (page) => {
  currentPage = page;
  renderData(categories);
};
const renderData = (data) => {
  currentData = data;

  let newRender = "";

  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;

  const pageData = data.slice(start, end);

  pageData.forEach((e, index) => {
    newRender += `
    <tr>
      <td>${e.name}</td>
      <td>${e.meaning}</td>
      <td>${getCategoryName(e.categoryId)}</td>
      <td>
        <a class="edit-btn" onclick="editItem(${start + index})">Edit</a>
        <a class="delete-btn" onclick="deleteItem(${start + index})">Delete</a>
      </td>
    </tr>
    `;
  });

  tableBody.innerHTML = newRender;

  renderPagination(data);
};

renderData(vocabs);

const deleteItem = (index) => {
  Swal.fire({
    title: "Are you sure?",
    icon: "warning",
    showCancelButton: true,
  }).then((result) => {
    if (result.isConfirmed) {
      let id = currentData[index].id;

      list = list.filter((item) => item.id !== id);
      vocabs = list.filter((e) => e.userId == currentUser.id);

      localStorage.setItem("list", JSON.stringify(list));

      renderData(vocabs);
    }
  });
};

const editItem = async (index) => {
  const current = vocabs[index];
  const { value: formValues } = await Swal.fire({
    title: "Edit Word",
    html: `
      <div class="form-edit">
      <input id="word" class="swal2-input" placeholder="Enter Word" value="${current.name}">
      <span class="red" id="word-edit-alert"></span>
      <textarea id="meaning" class="swal2-textarea" placeholder="Enter Meaning">${current.meaning}</textarea>
      <span class="red" id="meaning-edit-alert"></span>
      <select id="category" class="swal2-select" value="">
        <option value="">Select Category</option>
      </select>
      <span class="red" id="category-edit-alert"></span>
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: "Save",
    cancelButtonText: "Cancel",
    reverseButtons: true,
    buttonsStyling: true,
    customClass: {
      actions: "my-actions",
    },
    didOpen: () => {
      const select = document.getElementById("category");

      let option = `<option value="">Select Category</option>`;
      listCate.forEach((cate) => {
        option += `<option value="${cate.name}">${cate.name}</option>`;
      });

      select.innerHTML = option;
      select.value = getCategoryName(current.categoryId);
      console.log();
    },

    preConfirm: () => {
      let isValidate = true;
      const word = document.getElementById("word").value.trim();
      const meaning = document.getElementById("meaning").value.trim();
      const category = document.getElementById("category").value;
      const wordAlert = document.querySelector("#word-edit-alert");
      const meaningAlert = document.querySelector("#meaning-edit-alert");
      const categoryAlert = document.querySelector("#category-edit-alert");

      if (!word) {
        wordAlert.innerText = "Word input can not blank";
        isValidate = false;
      }
      if (!meaning) {
        meaningAlert.innerText = "Meaning input can not blank";
        isValidate = false;
      }
      if (!category) {
        categoryAlert.innerText = "Select input can not blank";
        isValidate = false;
      }
      // let wordSearch = list.find((e) => e.name == word);

      // if(wordSearch){
      //   duplicateAlert.innerText="This word id already in words list"
      //   isValidate=false;
      // }

      if (isValidate == false) {
        return false;
      }

      // if (!word || !meaning || !category) {
      //   Swal.showValidationMessage("Please fill all fields!");
      //   return false;
      // }

      return { word, meaning, category };
    },
  });

  if (formValues) {
    console.log(formValues);

    Swal.fire({
      title: "Saved!",
      text: "Word edited successfully",
      icon: "success",
    });

    vocabs[index] = {
      ...vocabs[index],
      name: formValues.word,
      meaning: formValues.meaning,
      category: formValues.category,
    };

    localStorage.setItem("list", JSON.stringify(vocabs));

    renderData(vocabs);
  }
};

searchBar.addEventListener("input", (e) => {
  const keyword = e.target.value.toLowerCase();

  const filteredList = vocabs.filter((item) =>
    item.name.toLowerCase().includes(keyword),
  );

  currentPage = 1;
  renderData(filteredList);
});

const renderCategories = () => {
  let option = `<option value="">All Categories</option>`;

  listCate.forEach((cate) => {
    option += `<option value="${cate.id}">${cate.name}</option>`;
  });

  selectBar.innerHTML = option;
};

renderCategories();

selectBar.addEventListener("change", (e) => {
  const cateId = e.target.value;

  let filteredList;

  if (cateId) {
    filteredList = vocabs.filter((item) => item.categoryId == cateId);
  
  } else {
      filteredList = vocabs;
  }

  currentPage = 1;
  renderData(filteredList);
});

logOutBtn.addEventListener("click", () => {
  Swal.fire({
    title: "Are you sure you want to logout?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes!",
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: "Logout!",
        text: "",
        icon: "success",
      });
      localStorage.removeItem("currentUser");
      window.location.href = "login.html";
    } else {
    }
  });
});

pagination.addEventListener("click", (e) => {
  const btn = e.target.closest(".page-btn");
  if (!btn || btn.classList.contains("disabled")) return;

  const action = btn.dataset.page;

  const totalPages = Math.ceil(currentData.length / itemsPerPage);

  if (action === "prev") {
    currentPage--;
  } else if (action === "next") {
    currentPage++;
  }

  // chặn vượt trang
  if (currentPage < 1) currentPage = 1;
  if (currentPage > totalPages) currentPage = totalPages;

  renderData(currentData);
});

if (!currentUser) {
  window.location.href = "../pages/login.html";
}
