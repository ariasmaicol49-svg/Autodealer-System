document.addEventListener("DOMContentLoaded", () => {
  const setMessage = (element, text, type = "error") => {
    if (!element) {
      return;
    }

    element.textContent = text;
    element.className = `message show ${type}`;
    element.setAttribute("role", type === "error" ? "alert" : "status");
  };

  document.querySelectorAll("form[data-demo-form]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const message = form.querySelector(".message");
      let firstInvalid = null;

      form.querySelectorAll("[required]").forEach((input) => {
        const invalid = !input.checkValidity();
        input.setAttribute("aria-invalid", invalid ? "true" : "false");

        if (invalid && !firstInvalid) {
          firstInvalid = input;
        }
      });

      if (firstInvalid) {
        setMessage(
          message,
          "Revisa los campos marcados. Completa la información obligatoria con el formato indicado.",
          "error",
        );
        firstInvalid.focus();
        return;
      }

      if (form.id === "login-form") {
        setMessage(
          message,
          "Validación local correcta. Esta maqueta no autentica usuarios reales.",
          "success",
        );
        return;
      }

      if (form.id === "vehicle-form") {
        const year = Number(form.elements.year.value);
        const price = Number(form.elements.price.value);
        const mileage = Number(form.elements.km.value);

        if (year < 1900 || year > new Date().getFullYear() + 1) {
          form.elements.year.setAttribute("aria-invalid", "true");
          setMessage(
            message,
            "El año debe estar entre 1900 y el próximo año.",
            "error",
          );
          form.elements.year.focus();
          return;
        }

        if (price < 0 || mileage < 0) {
          setMessage(
            message,
            "Precio y kilometraje no pueden ser negativos.",
            "error",
          );
          return;
        }
      }

      setMessage(
        message,
        "Formulario validado correctamente en esta demostración. No se guardaron datos en un servidor.",
        "success",
      );
      form.reset();
    });
  });

  const search = document.querySelector("#vehicle-search");

  if (search) {
    search.addEventListener("input", () => {
      const query = search.value.toLocaleLowerCase();
      const rows = document.querySelectorAll("#vehicle-table tbody tr");

      rows.forEach((row) => {
        row.hidden = !row.innerText.toLocaleLowerCase().includes(query);
      });
    });
  }
});
