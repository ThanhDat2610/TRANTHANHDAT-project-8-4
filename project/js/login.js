const emailInput = document.querySelector("#user-email");
const passwordInput = document.querySelector("#user-password");
const emailAlert = document.querySelector("#email-alert");
const psAlert = document.querySelector("#ps-alert");

const form = document.querySelector("#login-form");



form.addEventListener("submit", (e) => {
  e.preventDefault();
  let isValid = true;
  const users = JSON.parse(localStorage.getItem("users")) || [];
  if (
    emailInput.value.trim() === "" ||
    !/^\S+@\S+\.\S+$/.test(emailInput.value)
  ) {
    emailAlert.style.display = "block";
    isValid = false;
  } else {
    emailAlert.style.display = "none";
  }

  if (passwordInput.value.trim() === "" || passwordInput.value.length < 8) {
    psAlert.style.display = "block";
    isValid = false;
  } else {
    psAlert.style.display = "none";
  }

  if (!isValid) return;

  let emailSearch = users.find((u) => u.email == emailInput.value);
  
  if (emailSearch) {
    if (passwordInput.value == emailSearch.password) {
      Swal.fire({
        title: "Login success",
        icon: "success",
      });
      setTimeout(() => {
        window.location.href = "../index.html";
      }, 1500);
      localStorage.setItem("currentUser", JSON.stringify(emailSearch));
    } else {
      psAlert.style.display = "block";
      psAlert.innerText = "Password wrong";
    }
  } else {
    emailAlert.style.display = "block";
    emailAlert.innerText = "*Your email is not registered in our website yet";
  }
});

// const users = JSON.parse(localStorage.getItem("users")) || [];
// let test = users.find((e) => e.email == "thanhdat123@gmail.com.vn");

// console.log(test.password);


let currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (currentUser) {
  window.location.href = "../index.html";
}