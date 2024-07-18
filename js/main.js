document.addEventListener("DOMContentLoaded", () => {
  const htmlElement = document.documentElement;
  const menuContainer = document.querySelector(".header__menu-container");
  const hamburguerMenu = document.querySelector(".header__menu-toggle");
  const languageSelectorDesktop = document.getElementById(
    "languageSelectorDesktop"
  );
  const languageSelectorMobile = document.getElementById(
    "languageSelectorMobile"
  );
  const reviewsContainer = document.querySelector(".reviews-section");
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
    languageSelectorDesktop.value = lang;
    languageSelectorMobile.value = lang;
    document.documentElement.lang = lang; // Cambia el atributo lang en la etiqueta html
  };

  // Cargar el idioma persistido o usar un valor por defecto
  const persistedLang = localStorage.getItem("selectedLang") || "es";
  languageSelectorDesktop.value = persistedLang;
  languageSelectorMobile.value = persistedLang;
  loadTranslations(persistedLang);

  // Añadir un evento de cambio a ambos selectores de idioma
  languageSelectorDesktop.addEventListener("change", (event) => {
    const selectedLang = event.target.value;
    handleLanguageChange(selectedLang);
  });

  languageSelectorMobile.addEventListener("change", (event) => {
    const selectedLang = event.target.value;
    handleLanguageChange(selectedLang);
  });

  // fetch de las reseñas
  // Asumiendo que el archivo JSON está en la ruta '/data/reviews.json'
  fetch("/data/reviews.json")
    .then((response) => response.json())
    .then((reviews) => {
      reviews.forEach((review) => {
        let starsHTML = "";
        for (let i = 0; i < 5; i++) {
          if (i < review.stars) {
            starsHTML += '<i class="fa fa-star checked"></i>';
          } else {
            starsHTML += '<i class="fa fa-star"></i>';
          }
        }

        const reviewHTML = `
        <div class="review-card">
          <div class="review-card__header">
          ${
            review.image
              ? `<img src="${review.image}" alt="${review.name}" class="review-card__image" />`
              : `<img src="https://www.freeiconspng.com/thumbs/profile-icon-png/profile-icon-9.png" alt="${review.name}" class="review-card__image" />`
          }
            <div class="review-card__details">
              <h2 class="review-card__name">${review.name}</h2>
              <div class="review-card__stars">${starsHTML}</div>
            </div>
          </div>
          <hr class="review-card__separator" />
          <div class="review-card__content">
            <p>
              ${review.description}
            </p>
          </div>
        </div>
        `;
        reviewsContainer.insertAdjacentHTML("beforeend", reviewHTML);
      });
    })
    .catch((error) => console.error("Error fetching reviews:", error));
});
