const navBar = document.querySelector(".header__menu-container");
const hamburguerMenu = document.querySelector(".header__menu-toggle");

hamburguerMenu.addEventListener("click", () => {
  if (navBar.style.display === "none") navBar.style.display = "flex";
  else navBar.style.display = "none";
});
