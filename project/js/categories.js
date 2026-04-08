let list = JSON.parse(localStorage.getItem("listCate")) || [
  {
    id: 1,
    name: "Cay coi",
    descirption: "cai coi",
  },
];

let currentUser = JSON.parse(localStorage.getItem("currentUser"));
console.log(currentUser.id);
let categories = list.filter((e) => e.userId == currentUser.id);

let nextId = list.length ? list[list.length - 1].id + 1 : 1;

const tableBody = document.querySelector("#table-body");
const addNewBtn = document.querySelector("#add-new");
const pagination = document.querySelector("#pagination");
const logOutBtn = document.querySelector("#logout-btn");
const searchBar = document.querySelector("#search-bar");

let currentPage = 1;
const itemsPerPage = 5;

const renderPagination = (data) => {
  const totalPages = Math.ceil(data.length / itemsPerPage);

  if (totalPages === 0) {
    pagination.innerHTML = "";
    return;
  }

  let buttons = "";

  buttons = `
    <button class="page-btn ${currentPage === 1 ? "disabled" : ""}" data-page="prev">
      &laquo; Prev
    </button>
  `;

  for (let i = 1; i <= totalPages; i++) {
    buttons += `
      <button onclick="changePage(${i})"
        style="margin:5px; padding:6px 12px; border-radius:6px;
        ${i === currentPage ? "background:#3b82f6;color:white;" : ""}">
        ${i}
      </button>
    `;
  }

  buttons += `
    <button class="page-btn ${currentPage === totalPages ? "disabled" : ""}" data-page="next">
      Next &raquo;
    </button>
  `;
  pagination.innerHTML = buttons;
};

const renderData = (data) => {
  let newRender = "";

  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;

  const paginatedData = data.slice(start, end);

  paginatedData.forEach((e, index) => {
    newRender += `
    <tr>
      <td>${e.name}</td>
      <td>${e.descirption}</td>
      <td>
        <a class="edit-btn" onclick="editItem(${start + index})" href="#">Edit</a>
        <a class="delete-btn" onclick="deleteItem(${start + index})">Delete</a>
      </td>
    </tr>
    `;
  });

  tableBody.innerHTML = newRender;
  categories = list.filter((e) => e.userId == currentUser.id);
  renderPagination(data);
};
renderData(categories);

const changePage = (page) => {
  currentPage = page;
  renderData(categories);
};

async function openPopup() {
  const { value } = await Swal.fire({
    title: "Add New Categories",
    html: `
      <div class="addnew">
      <div>
      <label>Word</label>
      <input id="word" class="swal2-input" placeholder="Enter word">
      <span class="red" id="word-alert"></span>
      </div>
      <div>
      <label>Meaning</label>
      <textarea id="meaning" class="swal2-textarea" placeholder="Enter meaning"></textarea>  
      <span class="red" id="meaning-alert"></span>
      </div>
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: "Save",
    reverseButtons: true,
    customClass: {
      actions: "my-actions",
    },
    preConfirm: () => {
      let isValidate = true;
      const word = document.getElementById("word").value.trim();
      const meaning = document.getElementById("meaning").value.trim();
      const wordAlert = document.querySelector("#word-alert");
      const meaningAlert = document.querySelector("#meaning-alert");
      if (!word) {
        wordAlert.innerText = "Word input can not blank";
        isValidate = false;
      }
      if (!meaning) {
        meaningAlert.innerText = "Meaning input can not blank";
        isValidate = false;
      }
      let wordSearch = categories.find((e) => e.name == word);

      if (wordSearch) {
        meaningAlert.innerText = "This word is already in categories list";
        isValidate = false;
      }

      if (isValidate == false) {
        return false;
      }
      // if (!word || !meaning) {
      //   Swal.showValidationMessage("Please fill all fields!");
      //   return false;
      // }

      return { word, meaning };
    },
  });

  return value;
}

const handleAdd = (data) => {
  const newItem = {
    id: nextId++,
    name: data.word,
    descirption: data.meaning,
    userId: currentUser.id,
  };

  list.unshift(newItem);
  let categories = list.filter((e) => e.userId == currentUser.id);
  localStorage.setItem("listCate", JSON.stringify(list));
  currentPage = 1;
  renderData(categories);
};
renderData(categories);

const editItem = async (index) => {
  const current = categories[index];

  const { value: formValues } = await Swal.fire({
    title: "Edit Category",
    html: `
      <div class="form-edit">
      <div>
      <input id="word" class="swal2-input" value="${current.name}">
      <span class="red" id="word-edit-alert"></span>
      </div>
      <div>
      <textarea id="meaning" class="swal2-textarea">${current.descirption}</textarea>
      <span class="red" id="meaning-edit-alert"></span>
      </div>
      </div>
      
    `,
    showCancelButton: true,
    confirmButtonText: "Save",
    reverseButtons: true,
    customClass: {
      actions: "my-actions",
    },

    preConfirm: () => {
      let isValidate = true;
      const word = document.getElementById("word").value.trim();
      const meaning = document.getElementById("meaning").value.trim();
      const wordAlert = document.querySelector("#word-edit-alert");
      const meaningAlert = document.querySelector("#meaning-edit-alert");
      if (!word) {
        wordAlert.innerText = "Word input can not blank";
        isValidate = false;
      }
      if (!meaning) {
        meaningAlert.innerText = "Meaning input can not blank";
        isValidate = false;
      }
      // let wordSearch = list.find((e) => e.name == word);

      // if(wordSearch){
      //   meaningAlert.innerText="This word id already in categories list"
      //   isValidate=false;
      // }

      if (isValidate == false) {
        return false;
      }

      return { word, meaning };
    },
  });

  if (formValues) {
    const id = categories[index].id;

    const realIndex = list.findIndex((e) => e.id === id);

    list[realIndex] = {
      ...list[realIndex],
      name: formValues.word,
      descirption: formValues.meaning,
    };

    localStorage.setItem("listCate", JSON.stringify(list));
    categories = list.filter((e) => e.userId == currentUser.id);
    renderData(categories);
  }
};

const deleteItem = (index) => {
  Swal.fire({
    title: "Are you sure?",
    icon: "warning",
    showCancelButton: true,
  }).then((result) => {
    if (result.isConfirmed) {
      const id = categories[index].id;

      list = list.filter((e) => e.id !== id);

      categories = list.filter((e) => e.userId !== id);

      localStorage.setItem("listCate", JSON.stringify(list));
      renderData(categories);
    }
  });
};

addNewBtn.addEventListener("click", async () => {
  const data = await openPopup();

  if (data) {
    handleAdd(data);
  }
});
renderData(categories);

searchBar.addEventListener("input", (e) => {
  const keyword = e.target.value;
  const filteredList = categories.filter((item) => {
    return item.name.toLowerCase().includes(keyword.toLowerCase());
  });
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

if (!currentUser) {
  window.location.href = "../pages/login.html";
}

pagination.addEventListener("click", (e) => {
  const pageBtn = e.target.closest(".page-btn");
  if (!pageBtn || pageBtn.classList.contains("disabled")) return;

  const action = pageBtn.dataset.page;

  if (action === "prev") {
    currentPage--;
  } else if (action === "next") {
    currentPage++;
  }

  renderData(categories);
  renderPagination(categories);
});
