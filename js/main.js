document.addEventListener("DOMContentLoaded", () => {
  const htmlElement = document.documentElement;
  const menuContainer = document.querySelector(".header__menu-container");
  const hamburguerMenu = document.querySelector(".header__menu-toggle");
  const languageSelectors = document.querySelectorAll(
    ".custom-select__wrapper"
  );
  const selectTriggers = document.querySelectorAll(".custom-select__trigger");
  const customOptions = document.querySelectorAll(".custom-select__options");
  const customOptionsList = document.querySelectorAll(".custom-select__option");
  const reviewsContainer = document.querySelector(".reviews-section");
  const copyrightElement = document.querySelector(".footer__copyright");

  // Toggle menú hamburguesa
  hamburguerMenu.addEventListener("click", () => {
    menuContainer.classList.toggle("header__menu-container--visible");
    menuContainer.classList.toggle("header__menu-container--hidden");
  });

  selectTriggers.forEach((trigger) => {
    trigger.addEventListener("click", function () {
      this.nextElementSibling.classList.toggle("custom-select__options--open");
    });
  });

  customOptionsList.forEach((option) => {
    option.addEventListener("click", function () {
      const trigger = this.closest(".custom-select").querySelector(
        ".custom-select__trigger .custom-select__label"
      );
      trigger.innerHTML = this.innerHTML;
      this.closest(".custom-select__options")
        .querySelector(".custom-select__option--selected")
        .classList.remove("custom-select__option--selected");
      this.classList.add("custom-select__option--selected");
      this.closest(".custom-select__options").classList.remove(
        "custom-select__options--open"
      );

      const selectedLang = this.getAttribute("data-value");
      handleLanguageChange(selectedLang);
    });
  });

  document.addEventListener("click", (e) => {
    customOptions.forEach((option) => {
      if (!option.previousElementSibling.contains(e.target)) {
        option.classList.remove("custom-select__options--open");
      }
    });
  });

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
        element.innerHTML =
          element.tagName.toLowerCase() === "p"
            ? translation.replace(/\n\n/g, "<br><br>")
            : translation;
      }
    });
  };

  const handleLanguageChange = (lang) => {
    localStorage.setItem("selectedLang", lang);
    loadTranslations(lang);
    updateSelectors(lang);
  };

  const updateSelectors = (lang) => {
    languageSelectors.forEach((selector) => {
      const options = selector.querySelectorAll(".custom-select__option");
      options.forEach((option) => {
        if (option.getAttribute("data-value") === lang) {
          option.classList.add("custom-select__option--selected");
          option
            .closest(".custom-select")
            .querySelector(".custom-select__label").innerHTML =
            option.innerHTML;
        } else {
          option.classList.remove("custom-select__option--selected");
        }
      });
    });
  };

  const persistedLang = localStorage.getItem("selectedLang") || "es";
  handleLanguageChange(persistedLang);

  if (document.URL.includes("resenas.html")) {
    fetch("/data/reviews.json")
      .then((response) => response.json())
      .then((reviews) => {
        reviews.forEach((review) => {
          let starsHTML = "";
          for (let i = 0; i < 5; i++) {
            starsHTML +=
              i < review.stars
                ? '<i class="fa fa-star checked"></i>'
                : '<i class="fa fa-star"></i>';
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
                <p>${review.description}</p>
              </div>
            </div>
          `;
          reviewsContainer.insertAdjacentHTML("beforeend", reviewHTML);
        });
      })
      .catch((error) => console.error("Error fetching reviews:", error));
  }

  const updateCopyright = (copyrightText) => {
    const year = new Date().getFullYear();
    if (copyrightElement && copyrightText) {
      copyrightElement.textContent = copyrightText.replace("{year}", year);
    }
  };
});
