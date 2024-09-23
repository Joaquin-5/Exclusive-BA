document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("tourRequestForm");
  const submitButton = form.querySelector("button[type='submit']");
  let translations;

  // Función para cargar las traducciones actuales
  const loadErrorMessages = async (lang) => {
    try {
      const response = await fetch(`./translations/translations_${lang}.json`);
      const data = await response.json();
      translations = data.index.main.form.errors;
    } catch (error) {
      console.error("Error loading error messages:", error);
    }
  };

  // Función para validar los campos
  const validateField = (field) => {
    const fieldName = field.getAttribute("name");
    let isValid = true;
    let errorMessage = "";

    switch (fieldName) {
      case "name":
        if (field.value.trim() === "") {
          errorMessage = translations.nombre.required;
          isValid = false;
        }
        break;
      case "email":
        if (field.value.trim() === "") {
          errorMessage = translations.email.required;
          isValid = false;
        } else if (!validateEmail(field.value)) {
          errorMessage = translations.email.invalid;
          isValid = false;
        }
        break;
      case "numPeople":
        if (field.value === "") {
          errorMessage = translations.cantidadPersonas.required;
          isValid = false;
        }
        break;
      case "tourDate":
        if (field.value === "") {
          errorMessage = translations.fechaTour.required;
          isValid = false;
        } else if (new Date(field.value) < new Date()) {
          errorMessage = translations.fechaTour.invalid;
          isValid = false;
        }
        break;
      case "hotel":
        if (field.value.trim() === "") {
          errorMessage = translations.hotel.required;
          isValid = false;
        }
        break;
      case "message":
        if (field.value.trim() === "") {
          errorMessage = translations.detalleTour.required;
          isValid = false;
        } else if (field.value.length < 10) {
          errorMessage = translations.detalleTour.minLength.replace(
            "{minLength}",
            10
          );
          isValid = false;
        }
        break;
    }

    const errorSpan = field.nextElementSibling;
    if (!isValid) {
      field.classList.add("invalid");
      errorSpan.textContent = errorMessage;
    } else {
      field.classList.remove("invalid");
      errorSpan.textContent = "";
    }

    return isValid;
  };

  // Validar el formulario completo
  const validateForm = () => {
    const formFields = document.querySelectorAll(
      "#tourRequestForm input, #tourRequestForm textarea, #tourRequestForm select"
    );
    let formIsValid = true;

    formFields.forEach((field) => {
      const isValid = validateField(field);
      if (!isValid) {
        formIsValid = false;
      }
    });

    submitButton.disabled = !formIsValid;
    return formIsValid;
  };

  // Evento blur para validar cada campo al perder el foco
  document
    .querySelectorAll(
      "#tourRequestForm input, #tourRequestForm textarea, #tourRequestForm select"
    )
    .forEach((field) => {
      field.addEventListener("blur", () => {
        validateField(field);
        validateForm();
      });
    });

  // Validar el formulario al enviarlo
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (validateForm()) {
      console.log("Formulario válido, enviando datos...");
      

      const formData = Object.fromEntries(new FormData(event.target));
    } else {
      console.log("Formulario no válido, por favor corrige los errores.");
    }
  });

  // Cargar mensajes de error en el idioma seleccionado
  const persistedLang = localStorage.getItem("selectedLang") || "es";
  loadErrorMessages(persistedLang);
});

// Función para validar el formato del email
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}
