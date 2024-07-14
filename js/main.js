document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".header");
  const hamburguerMenu = document.querySelector(".header__menu-toggle");
  const languageSelector = document.getElementById("languageSelector");
  const htmlElement = document.documentElement;
  const copyrightElement = document.querySelector(".footer__copyright");

  // Toggle el div con la clase header__menu-container
  /* const adjustMenuContainer = () => {
    const menuContainer = document.querySelector(".header__menu-container");
    if (window.innerWidth >= 768) {
      if (menuContainer) {
        while (menuContainer.firstChild) {
          header.appendChild(menuContainer.firstChild);
        }
        menuContainer.remove();
      }
    } else {
      if (!menuContainer) {
        const newMenuContainer = document.createElement("div");
        newMenuContainer.classList.add("header__menu-container");
        while (header.children.length > 2) {
          newMenuContainer.appendChild(header.children[2]);
        }
        header.appendChild(newMenuContainer);
      }
    }
  }; */

  adjustMenuContainer();
  window.addEventListener("resize", adjustMenuContainer);

  // Toggle menú hamburguesa
  hamburguerMenu.addEventListener("click", () => {
    const menuContainer = document.querySelector(".header__menu-container");
    if (
      menuContainer.style.display === "none" ||
      menuContainer.style.display === ""
    )
      menuContainer.style.display = "flex";
    else menuContainer.style.display = "none";
  });

  // Traductor
  const loadTranslations = async (lang) => {
    try {
      const response = await fetch(`./translations/translations_${lang}.json`);
      const translations = await response.json();
      applyTranslations(translations);
      updateCopyright(translations.footer.copyright);
      htmlElement.setAttribute("lang", lang);
    } catch (error) {
      console.error("Error loading translations:", error);
    }
  };

  const applyTranslations = (translations) => {
    document.querySelectorAll("[data-translate]").forEach((element) => {
      const key = element.getAttribute("data-translate");
      const translation = key
        .split(".")
        .reduce((obj, i) => obj[i], translations);
      if (translation) {
        // Reemplaza \n\n por <br><br> si el elemento es un párrafo
        if (element.tagName.toLowerCase() === "p") {
          element.innerHTML = translation.replace(/\n\n/g, "<br><br>");
        } else {
          element.textContent = translation;
        }
      }
    });
  };

  // Actualizar el copyright con el año actual
  const updateCopyright = (copyrightText) => {
    const year = new Date().getFullYear();
    if (copyrightElement && copyrightText) {
      copyrightElement.textContent = copyrightText.replace("{year}", year);
    }
  };

  // Manejar el cambio de idioma y persistir la selección
  const handleLanguageChange = (lang) => {
    localStorage.setItem("selectedLang", lang);
    loadTranslations(lang);
  };

  // Cargar el idioma persistido o usar un valor por defecto
  const persistedLang = localStorage.getItem("selectedLang") || "es";
  languageSelector.value = persistedLang;
  loadTranslations(persistedLang);

  // Añadir un evento de cambio al selector de idioma
  languageSelector.addEventListener("change", (event) => {
    const selectedLang = event.target.value;
    handleLanguageChange(selectedLang);
  });
});
