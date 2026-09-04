document.addEventListener("DOMContentLoaded", () => {

  let currentType = "url";

  const typeButtons = document.querySelectorAll(".type-btn");

  const fields = {
    url: document.getElementById("url-field"),
    text: document.getElementById("text-field"),
    phone: document.getElementById("phone-field"),
    email: document.getElementById("email-field"),
    wifi: document.getElementById("wifi-field")
  };

  const qrContainer = document.getElementById("qr-container");
  const generateBtn = document.getElementById("generate-btn");
  const downloadBtn = document.getElementById("download-btn");
  const status = document.getElementById("status");

  const qrColor = document.getElementById("qr-color");
  const bgColor = document.getElementById("bg-color");
  const qrSize = document.getElementById("qr-size");
  const sizeValue = document.getElementById("size-value");

  typeButtons.forEach(button => {
    button.addEventListener("click", () => {

      typeButtons.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");

      currentType = button.dataset.type;

      Object.values(fields).forEach(field => {
        field.classList.add("hidden");
      });

      fields[currentType].classList.remove("hidden");
    });
  });

  qrSize.addEventListener("input", () => {
    sizeValue.textContent = qrSize.value;
  });

  function escapeWifi(value) {
    return value
      .replace(/\\/g, "\\\\")
      .replace(/;/g, "\\;")
      .replace(/,/g, "\\,")
      .replace(/:/g, "\\:");
  }

  function getContent() {

    if (currentType === "url") {
      const value = document.getElementById("url-input").value.trim();

      if (!value) return "";

      return value;
    }

    if (currentType === "text") {
      return document.getElementById("text-input").value.trim();
    }

    if (currentType === "phone") {
      const value = document.getElementById("phone-input").value.trim();

      if (!value) return "";

      return "tel:" + value;
    }

    if (currentType === "email") {
      const value = document.getElementById("email-input").value.trim();

      if (!value) return "";

      return "mailto:" + value;
    }

    if (currentType === "wifi") {

      const name = document.getElementById("wifi-name").value.trim();
      const password = document.getElementById("wifi-password").value;
      const security = document.getElementById("wifi-security").value;

      if (!name) return "";

      return `WIFI:T:${security};S:${escapeWifi(name)};P:${escapeWifi(password)};;`;
    }

    return "";
  }

  function generateQR() {

    const content = getContent();

    if (!content) {
      status.textContent = "Introduce un dato para generar tu QR.";
      downloadBtn.disabled = true;
      return;
    }

    qrContainer.innerHTML = "";

    new QRCode(qrContainer, {
      text: content,
      width: Number(qrSize.value),
      height: Number(qrSize.value),
      colorDark: qrColor.value,
      colorLight: bgColor.value,
      correctLevel: QRCode.CorrectLevel.H
    });

    status.textContent = "¡Código QR generado correctamente!";
    downloadBtn.disabled = false;
  }

  generateBtn.addEventListener("click", generateQR);

  [qrColor, bgColor, qrSize].forEach(element => {
    element.addEventListener("input", () => {

      if (getContent()) {
        generateQR();
      }

    });
  });

  downloadBtn.addEventListener("click", () => {

    const canvas = qrContainer.querySelector("canvas");
    const image = qrContainer.querySelector("img");

    let url = "";

    if (canvas) {
      url = canvas.toDataURL("image/png");
    } else if (image) {
      url = image.src;
    }

    if (!url) return;

    const link = document.createElement("a");
    link.href = url;
    link.download = "mi-codigo-qr.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });

  document.addEventListener("keydown", event => {

    if (event.key === "Enter" && event.target.tagName !== "TEXTAREA") {
      generateQR();
    }

  });

});
