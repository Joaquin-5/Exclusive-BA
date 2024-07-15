document.addEventListener("DOMContentLoaded", () => {
  const menuContainer = document.querySelector(".header__menu-container");
  const hamburguerMenu = document.querySelector(".header__menu-toggle");
  const languageSelector = document.getElementById("languageSelector");
  const htmlElement = document.documentElement;
  const copyrightElement = document.querySelector(".footer__copyright");

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
