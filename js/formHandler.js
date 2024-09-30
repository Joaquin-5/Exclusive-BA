document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("tourRequestForm");
  const submitButton = form.querySelector("button[type='submit']");
  let translations;
  const touchedFields = new Set(); // Almacena los campos en los que se ha hecho foco

  // Cargar mensajes de error ocultos al inicio
  document.querySelectorAll(".form__error-message").forEach((div) => {
    div.classList.add("form__error-message--hidden");
  });

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

  // Función para actualizar todos los mensajes de error
  const updateErrorMessages = () => {
    // Limpiar el estado de los mensajes de error antes de revalidar
    document
      .querySelectorAll(
        "#tourRequestForm input, #tourRequestForm textarea, #tourRequestForm select"
      )
      .forEach((field) => {
        const errorMessageContainer = field.nextElementSibling;
        const errorTextSpan =
          errorMessageContainer.querySelector(".form__error-text");
        const label = form.querySelector(`label[for="${field.id}"]`);

        label.classList.remove("form__label--error");
        field.classList.remove("form__input--error");
        errorTextSpan.textContent = ""; // Limpiar el mensaje de error
        errorMessageContainer.classList.add("form__error-message--hidden"); // Ocultar el mensaje de error
      });

    // Revalidar cada campo para mostrar el mensaje correspondiente
    document
      .querySelectorAll(
        "#tourRequestForm input, #tourRequestForm textarea, #tourRequestForm select"
      )
      .forEach((field) => {
        validateField(field); // Válida cada campo para actualizar el mensaje
      });
  };

  // Función para validar los campos
  const validateField = (field) => {
    const fieldName = field.getAttribute("name");
    let isValid = true;
    let errorMessage = "";

    // Obtener el label correspondiente
    const label = form.querySelector(`label[for="${field.id}"]`);

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

    const errorMessageContainer = field.nextElementSibling;
    const errorTextSpan =
      errorMessageContainer.querySelector(".form__error-text");

    if (!isValid && touchedFields.has(fieldName)) {
      // Mostrar el mensaje de error si el campo fue tocado y no es válido
      label.classList.add("form__label--error");
      field.classList.add("form__input--error");
      errorTextSpan.textContent = errorMessage; // Insertar solo el mensaje de error en el span
      errorMessageContainer.classList.remove("form__error-message--hidden"); // Mostrar el mensaje de error
    } else {
      label.classList.remove("form__label--error");
      field.classList.remove("form__input--error");
      errorTextSpan.textContent = ""; // Limpiar el mensaje de error
      errorMessageContainer.classList.add("form__error-message--hidden"); // Ocultar el mensaje de error
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
      if (!isValid && touchedFields.has(field.getAttribute("name"))) {
        formIsValid = false;
      }
    });

    submitButton.disabled = !formIsValid;
    return formIsValid;
  };

  // Evento blur para marcar un campo como tocado y validar al perder el foco
  document
    .querySelectorAll(
      "#tourRequestForm input, #tourRequestForm textarea, #tourRequestForm select"
    )
    .forEach((field) => {
      field.addEventListener("blur", () => {
        touchedFields.add(field.getAttribute("name")); // Marcar el campo como tocado
        validateField(field);
        validateForm();
      });

      field.addEventListener("input", () => {
        validateField(field); // Validar en tiempo real
        validateForm();
      });
    });

  // Validar el formulario al enviarlo
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (validateForm()) {
      console.log("Formulario válido, enviando datos...");
      const formData = Object.fromEntries(new FormData(event.target));
      // Aquí enviarías los datos del formulario
    } else {
      console.log("Formulario no válido, por favor corrige los errores.");
    }
  });

  // Cargar mensajes de error en el idioma seleccionado
  const persistedLang = localStorage.getItem("selectedLang") || "es";
  loadErrorMessages(persistedLang);

  // Ejemplo de un evento para cambiar el idioma
  document
    .getElementById("languageSelector")
    .addEventListener("change", (event) => {
      const selectedLang = event.target.value; // Suponiendo que tienes un select con este id
      localStorage.setItem("selectedLang", selectedLang);
      loadErrorMessages(selectedLang).then(updateErrorMessages); // Cargar y actualizar los mensajes de error
    });
});

// Función para validar el formato del email
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}
