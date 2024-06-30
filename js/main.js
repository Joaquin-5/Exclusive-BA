document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".header");
  const menuContainer = document.querySelector(".header__menu-container");
  const hamburguerMenu = document.querySelector(".header__menu-toggle");
  const languageSelector = document.getElementById("languageSelector");
  const copyright = document.querySelector(".footer__copyright");

  // Toggle el div con la clase header__menu-container
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
    if (
      menuContainer.style.display === "none" ||
      menuContainer.style.display === ""
    )
      menuContainer.style.display = "flex";
    else menuContainer.style.display = "none";
  });

  // Traductor
  const loadTranslations = async (lang) => {
    const response = await fetch(`./translations/translations_${lang}.json`);
    const translations = await response.json();
    applyTranslations(translations);
  };

  const applyTranslations = (translations) => {
    document.querySelectorAll("[data-translate]").forEach((element) => {
      const key = element.getAttribute("data-translate");
      const translation = key
        .split(".")
        .reduce((obj, i) => obj[i], translations);
      if (translation) {
        element.textContent = translation;
      }
    });
  };

  languageSelector.addEventListener("change", (event) => {
    const selectedLang = event.target.value;
    loadTranslations(selectedLang);
  });

  // Carga el lenguaje
  loadTranslations(languageSelector.value);

  // Copyright Year
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  copyright.textContent = `© ${currentYear} Exclusive BA. Todos los derechos reservados.`;
});
