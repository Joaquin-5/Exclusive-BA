document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".header");
  const menuContainer = document.querySelector(".header__menu-container");
  const hamburguerMenu = document.querySelector(".header__menu-toggle");

  // Toggle el header__menu-container 
  const adjustMenuContainer = () => {
    if (window.innerWidth >= 768) {
      while (menuContainer.firstChild) {
        header.appendChild(menuContainer.firstChild);
      }
      menuContainer.remove();
    } else {
      if (!document.querySelector(".header__menu-container")) {
        const newMenuContainer = document.createElement("div");
        newMenuContainer.classList.add("header__menu-container");
        while (header.children.length > 2) {
          newMenuContainer.appendChild(header.children[2]);
        }
        header.appendChild(newMenuContainer);
      }
    }
  };

  adjustMenuContainer();

  window.addEventListener("resize", adjustMenuContainer);

  // Toggle menú hamburguesa
  hamburguerMenu.addEventListener("click", () => {
    if (menuContainer.style.display === "none")
      menuContainer.style.display = "flex";
    else menuContainer.style.display = "none";
  });
});
