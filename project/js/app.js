const logOutBtn = document.querySelector("#logout-btn")

logOutBtn.addEventListener("click",()=>{
   
    Swal.fire({
  title: "Are you sure you want to logout?",
  icon: "warning",
  showCancelButton: true,
  confirmButtonColor: "#3085d6",
  cancelButtonColor: "#d33",
  confirmButtonText: "Yes!"
}).then((result) => {
  if (result.isConfirmed){
Swal.fire({
    title: "Logout!",
    text: "",
    icon: "success",
    
  });
 localStorage.removeItem("currentUser")
 window.location.href="pages/login.html"
  }else{

  }

});
        
})



