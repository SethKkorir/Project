const menuIcon = document.getElementById("menuicn");
const nav = document.querySelector(".nav");

menuIcon.addEventListener("click", () => {
    nav.classList.toggle("nav-active");
});
