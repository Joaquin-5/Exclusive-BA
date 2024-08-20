document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("tourRequestForm");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      numPeople: formData.get("numPeople"),
      tourDate: formData.get("tourDate"),
      hotel: formData.get("hotel"),
      message: formData.get("message"),
    };

    console.log("Name:", data.name);
    console.log("Email:", data.email);
    console.log("Tour Date:", data.tourDate);
    console.log("Hotel:", data.hotel);
    console.log("Number of People:", data.numPeople);
    console.log("Message:", data.message); 

    // Envio de formulario usando EmailJS
    emailjs
      .send("service_uofbir8", "template_88g8hfr", {
        name: data.name,
        email: data.email,
        numPeople: data.numPeople,
        hotel: data.hotel,
        tourDate: data.tourDate,
        message: data.message,
      })
      .then((response) => {
        console.log("Email enviado con éxito!", response.status, response.text);
      })
      .catch((error) => {
        console.error("Error al enviar el email:", error);
      });
  });
});
