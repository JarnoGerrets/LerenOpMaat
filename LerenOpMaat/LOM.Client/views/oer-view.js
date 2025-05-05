import Popup from "../../components/Popup.js";
import { uploadOerPdf } from "../../client/api-client.js";

export default async function oerView() {
  const response = await fetch("/templates/Oer.html");
  const html = await response.text();

  const template = document.createElement("template");
  template.innerHTML = html;
  const fragment = template.content.cloneNode(true);

  const objectElement = fragment.querySelector("object");
  if (objectElement) {
    objectElement.setAttribute("data", "/api/oer/current");
  }

  const uploadBtn = fragment.getElementById("uploadBtn");

  uploadBtn?.addEventListener("click", () => {
    const popup = new Popup({
      maxWidth: "500px",
      sizeCloseButton: "0",
      closeButtonStyle: 'popup-confirmation-closebutton',
      extraButtons: false,
      titleWrapperClass: "popup-title-confirmation",
      content: `
        <div class="confirmation-popup-content">
          <p>Sleep een PDF-bestand hierheen of kies een bestand:</p>
          <p id="upload-status" style="color: red;"></p>
          <input type="file" id="fileInput" accept="application/pdf" />
          <div class="confirmation-popup-buttons" style="margin-top: 1rem;">
            <button id="confirm-upload" class="confirmation-accept-btn">Upload</button>
            <button id="cancel-upload" class="confirmation-deny-btn">Annuleren</button>
          </div>
        </div>
      `
    });

    popup.open();

    setTimeout(() => {
      const fileInput = document.getElementById("fileInput");
      const status = document.getElementById("upload-status");

      document.getElementById("confirm-upload")?.addEventListener("click", async () => {
        const file = fileInput.files[0];
        const userId = 1;

        if (!file) {
          status.textContent = "Geen bestand geselecteerd.";
          return;
        }

        if (!userId) {
          status.textContent = "Gebruiker onbekend (userId ontbreekt).";
          return;
        }

        try {
          status.textContent = "Uploaden...";
          await uploadOerPdf(file, userId);

          status.textContent = "Upload succesvol!";
          objectElement.setAttribute("data", "/api/oer/current?rand=" + Date.now());
          popup.close();
        } catch (err) {
          status.textContent = "Upload mislukt: " + err.message;
          console.error(err);
        }
      });

      document.getElementById("cancel-upload")?.addEventListener("click", () => {
        popup.close();
      });
    }, 0);

    window.addEventListener("beforeunload", () => popup.close());
    window.addEventListener("popstate", () => popup.close());
  });

  return { fragment, init: () => null };
}
