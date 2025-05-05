import Popup from "../../components/Popup.js";
import { uploadOerPdf, getCurrentOerPdf } from "../../client/api-client.js";

export default async function oerView() {
  const response = await fetch("/templates/Oer.html");
  const html = await response.text();

  const template = document.createElement("template");
  template.innerHTML = html;
  const fragment = template.content.cloneNode(true);

  const objectElement = fragment.querySelector("object");

  try {
    const pdfBlob = await getCurrentOerPdf();
    const pdfUrl = URL.createObjectURL(pdfBlob);

    if (objectElement) {
      objectElement.setAttribute("data", pdfUrl);
    }
  } catch (err) {
    console.error("PDF ophalen mislukt:", err.message);
    if (objectElement) {
      objectElement.replaceWith("Geen OER beschikbaar.");
    }
  }

  const uploadBtn = fragment.getElementById("uploadBtn");

  uploadBtn?.addEventListener("click", () => {
    const popup = new Popup({
      maxWidth: "500px",
      sizeCloseButton: "0",
      closeButtonStyle: "popup-confirmation-closebutton",
      extraButtons: false,
      content: `
        <div class="confirmation-popup-content">
          <div id="dropzone" class="dropzone">
            <img src="/images/UploadIcon.svg" alt="Upload Icon" class="upload-icon" />
            <p class="upload-instruction">Sleep een PDF-bestand hierheen</p>
            <p class="upload-or">of</p>
            <input type="file" id="fileInput" accept="application/pdf" class="file-input-styled" />
          </div>
          <p id="upload-status" class="upload-status" style="color: red;"></p>
          <div class="confirmation-popup-buttons">
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
      const dropzone = document.getElementById("dropzone");

      ["dragenter", "dragover"].forEach(event => {
        dropzone.addEventListener(event, e => {
          e.preventDefault();
          e.stopPropagation();
          dropzone.classList.add("dragover");
        });
      });

      ["dragleave", "drop"].forEach(event => {
        dropzone.addEventListener(event, e => {
          e.preventDefault();
          e.stopPropagation();
          dropzone.classList.remove("dragover");
        });
      });

      dropzone.addEventListener("drop", e => {
        const files = e.dataTransfer.files;
        if (files.length > 0 && files[0].type === "application/pdf") {
          fileInput.files = files;
        } else {
          status.textContent = "Alleen PDF-bestanden zijn toegestaan.";
        }
      });


      document.getElementById("confirm-upload")?.addEventListener("click", async () => {
        const file = fileInput.files[0];

        if (!file) {
          status.textContent = "Geen bestand geselecteerd.";
          return;
        }

        try {
          status.textContent = "Uploaden...";
          await uploadOerPdf(file);

          status.textContent = "Upload succesvol!";

          const newBlob = await getCurrentOerPdf();
          const newUrl = URL.createObjectURL(newBlob);
          objectElement.setAttribute("data", newUrl);

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
