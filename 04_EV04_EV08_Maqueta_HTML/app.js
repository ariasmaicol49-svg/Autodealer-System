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

  const search = document.querySelector("#vehicle-search, #usuario-search");

  if (search) {
    search.addEventListener("input", () => {
      const query = search.value.toLocaleLowerCase();
      const rows = document.querySelectorAll("#vehicle-table tbody tr, #usuario-table tbody tr");
      

      rows.forEach((row) => {
        row.hidden = !row.innerText.toLocaleLowerCase().includes(query);
      });
    });
  }



  const creditForm = document.querySelector("#credit-form");

  if (creditForm) {
    const creditMessage = document.querySelector("#credit-message");
    const financedOutput = document.querySelector("#financiado");
    const paymentOutput = document.querySelector("#cuota");
    const clearButton = document.querySelector("#credit-clear");

    const formatCurrency = (value) =>
      `$${Math.round(value).toLocaleString("es-CO")}`;

    creditForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const valor = Number(creditForm.elements.valor.value);
      const cuotaInicial = Number(creditForm.elements.cuotaInicial.value);
      const plazo = Number(creditForm.elements.plazo.value);
      const tasa = Number(creditForm.elements.tasa.value);

      if (!creditForm.checkValidity()) {
        setMessage(
          creditMessage,
          "Completa todos los campos obligatorios para simular el crédito.",
          "error",
        );
        return;
      }

      if (valor <= 0 || cuotaInicial < 0 || cuotaInicial > 100 || plazo <= 0 || tasa < 0) {
        setMessage(
          creditMessage,
          "Verifica los valores ingresados. Revisa monto, porcentaje, plazo y tasa.",
          "error",
        );
        return;
      }

      const inicial = valor * (cuotaInicial / 100);
      const financiado = valor - inicial;
      const tasaMensual = (tasa / 100) / 12;

      let cuotaMensual = 0;

      if (tasaMensual === 0) {
        cuotaMensual = financiado / plazo;
      } else {
        cuotaMensual =
          (financiado * tasaMensual) /
          (1 - Math.pow(1 + tasaMensual, -plazo));
      }

      financedOutput.textContent = formatCurrency(financiado);
      paymentOutput.textContent = formatCurrency(cuotaMensual);
      setMessage(creditMessage, "Simulación calculada correctamente.", "success");
    });

    clearButton.addEventListener("click", () => {
      creditForm.reset();
      financedOutput.textContent = "$0";
      paymentOutput.textContent = "$0";
      creditMessage.className = "message";
      creditMessage.textContent = "";
      creditMessage.removeAttribute("role");
    });
  }
});

