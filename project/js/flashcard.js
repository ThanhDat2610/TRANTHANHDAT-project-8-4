// ===== DATA =====
let list = JSON.parse(localStorage.getItem("list")) || [];
let currentUser = JSON.parse(localStorage.getItem("currentUser"));
console.log(list);

let vocabs = list.filter((e) => e.userId == currentUser.id);

let currentIndex = 0;
let showMeaning = false;

// ===== DOM =====
const card = document.querySelector(".card");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");
const learnBtn = document.getElementById("learnBtn");
const tableBody = document.getElementById("table-body");
const pagination = document.getElementById("pagination");
const searchInput = document.getElementById("search-bar");
const progressText = document.getElementById("progressText");
const progressBar = document.getElementById("progress");
const categorySelect = document.getElementById("select-cate");

// ===== FLASHCARD =====
const cardInner = document.getElementById("cardInner");
const cardFront = document.getElementById("cardFront");
const cardBack = document.getElementById("cardBack");

function renderCard() {
  if (vocabs.length === 0) {
    cardFront.innerText = "No words available";
    cardBack.innerText = "";
    return;
  }

  let current = vocabs[currentIndex];

  cardFront.innerText = current.name;
  cardBack.innerText = current.meaning;

  cardInner.classList.remove("flip"); // reset về mặt trước
}

// click để lật
cardInner.addEventListener("click", () => {
  cardInner.classList.toggle("flip");
});

// ===== NEXT / PREV =====
nextBtn.addEventListener("click", () => {
  if (currentIndex < vocabs.length - 1) {
    currentIndex++;
    showMeaning = false;
    renderCard();
  }
});

prevBtn.addEventListener("click", () => {
  if (currentIndex > 0) {
    currentIndex--;
    showMeaning = false;
    renderCard();
  }
});

// ===== MARK LEARNED =====
learnBtn.addEventListener("click", () => {
  if (vocabs.length === 0) return;

  let id = vocabs[currentIndex].id;

  let index = list.findIndex((e) => e.id === id);
  if (index !== -1) {
    list[index].learned = true;
  }

  localStorage.setItem("list", JSON.stringify(list));

  renderProgress();
  renderTable(vocabs);
});

// ===== PROGRESS =====
function renderProgress() {
  let learned = vocabs.filter((e) => e.learned).length;
  let total = vocabs.length;

  progressText.innerText = `${learned}/${total}`;

  let percent = total ? (learned / total) * 100 : 0;
  progressBar.style.width = percent + "%";
}

// ===== TABLE + PAGINATION =====
let currentPage = 1;
const perPage = 5;
let currentData = vocabs;

function renderTable(data) {
  currentData = data;

  let start = (currentPage - 1) * perPage;
  let end = start + perPage;

  let pageData = data.slice(start, end);

  let html = "";

  pageData.forEach((e) => {
    html += `
      <tr>
        <td>${e.name}</td>
        <td>${e.meaning}</td>
        <td>${e.learned ? "Learned" : "Not yet"}</td>
      </tr>
    `;
  });

  tableBody.innerHTML = html;

  renderPagination(data);
}

function renderPagination(data) {
  let total = Math.ceil(data.length / perPage);

  pagination.innerHTML = "";

  for (let i = 1; i <= total; i++) {
    let btn = document.createElement("button");
    btn.innerText = i;

    if (i === currentPage) {
      btn.style.background = "blue";
      btn.style.color = "white";
    }

    btn.addEventListener("click", () => {
      currentPage = i;
      renderTable(currentData);
    });

    pagination.appendChild(btn);
  }
}

// ===== SEARCH =====
searchInput.addEventListener("input", (e) => {
  let keyword = e.target.value.toLowerCase();

  let filtered = vocabs.filter((item) =>
    item.name.toLowerCase().includes(keyword),
  );

  currentPage = 1;
  renderTable(filtered);
});

// ===== CATEGORY FILTER =====
let listCate = JSON.parse(localStorage.getItem("listCate")) || [];

function renderCategory() {
  let html = `<option value="">All Categories</option>`;

  listCate.forEach((c) => {
    html += `<option value="${c.id}">${c.name}</option>`;
  });

  categorySelect.innerHTML = html;
}

categorySelect.addEventListener("change", () => {
  let id = categorySelect.value;

  if (!id) {
    vocabs = list.filter((e) => e.userId == currentUser.id);
  } else {
    vocabs = list.filter(
      (e) => e.userId == currentUser.id && e.categoryId == id,
    );
  }

  currentIndex = 0;
  currentPage = 1;

  renderCard();
  renderTable(vocabs);
  renderProgress();
});

// ===== INIT =====
renderCategory();
renderCard();
renderTable(vocabs);
renderProgress();
