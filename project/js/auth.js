let currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (currentUser) {
  window.location.href = "../index.html";
}

const form = document.querySelector("#register-form");
const firstNameInput = document.querySelector("#user-first-name");
const lastNameInput = document.querySelector("#user-last-name");
const emailInput = document.querySelector("#user-email");
const passwordInput = document.querySelector("#user-password");
const confirmPasswordInput = document.querySelector("#user-password-cf");
// const registerBtn = document.querySelector(".btn-sign-up");
const fnAlert = document.querySelector("#fn-alert");
const lnAlert = document.querySelector("#ln-alert");
const emailAlert = document.querySelector("#email-alert");
const psAlert = document.querySelector("#ps-alert");
const confirmPsAlert = document.querySelector("#confirm-ps-alert");
const loginBtn = document.querySelector("#gs-btn")




form.addEventListener("submit", (e) => {
  e.preventDefault();

  const users = JSON.parse(localStorage.getItem("users")) || [];
  const email = emailInput.value.trim();
  let isValid = true;

  if (firstNameInput.value.trim() === "") {
    fnAlert.style.display = "block";
    isValid = false;
  } else {
    fnAlert.style.display = "none";
  }

  if (lastNameInput.value.trim() === "") {
    lnAlert.style.display = "block";
    isValid = false;
  } else {
    lnAlert.style.display = "none";
  }

  if (emailInput.value.trim() === ""||!/^\S+@\S+\.\S+$/.test(emailInput.value)) {
    emailAlert.style.display = "block";
    isValid = false;
  } else {
    emailAlert.style.display = "none";
  }

  if (passwordInput.value.trim() === ""||passwordInput.value.length<8) {
    psAlert.style.display = "block";
    isValid = false;
  } else {
    psAlert.style.display = "none";
  }

  if (confirmPasswordInput.value.trim() === "") {
    confirmPsAlert.style.display = "block";
    isValid = false;
  } else if (confirmPasswordInput.value !== passwordInput.value) {
    confirmPsAlert.style.display = "block";
    confirmPsAlert.innerText = "Password doesnt match";
    isValid = false;
  } else {
    confirmPsAlert.style.display = "none";
  }

  if (!isValid) return;

const isExist = users.find((u) => u.email === email);

  if (isExist) {
    Swal.fire("Email is already exist!");
    return;
  }


  const user = {
    id:Math.random()*10,
    firstName: firstNameInput.value,
    lastName: lastNameInput.value,
    email: emailInput.value,
    password: passwordInput.value,
  };
  
  users.push(user);

  localStorage.setItem("users", JSON.stringify(users));

  Swal.fire({
    title: "Register success",
    icon: "success",
  });

  setTimeout(() => {
    window.location.href = "login.html";
  }, 1500);
});


const toggle1 = document.getElementById("togglePassword");
const toggle2 = document.getElementById("toggleConfirm");

// password
toggle1.addEventListener("click", () => {
  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    toggle1.innerHTML = `<img src="../open-eye.png">`;
  } else {
    passwordInput.type = "password";
    toggle1.innerHTML = `<img src="../icons8-closed-eye-30.png">`;
  }
});

// confirm password
toggle2.addEventListener("click", () => {
  if (confirmPasswordInput.type === "password") {
    confirmPasswordInput.type = "text";
    toggle2.innerHTML = `<img src="../open-eye.png">`;
  } else {
    confirmPasswordInput.type = "password";
    toggle2.innerHTML = `<img src="../icons8-closed-eye-30.png">`;
  }
});



loginBtn.addEventListener("click", ()=>{
    window.location.href = "login.html";
})

