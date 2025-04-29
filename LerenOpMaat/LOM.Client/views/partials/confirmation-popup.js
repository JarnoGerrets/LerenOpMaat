import Popup from "../../components/Popup.js";
import { deleteModule } from "../../client/api-client.js";

let mijnPopup;


export default async function confirmationPopup(id) {
    mijnPopup = new Popup({
        maxWidth: 'auto',
        height: '250px',
        header: `
            <h3 class="popup-header-confirmation">
                Wil je dit echt verwijderen?
            </h3>
        `,
        content: `
            <div class="popup-buttons">
                <button id="confirm-delete" class="btn btn-danger">Ja</button>
                <button id="cancel-delete" class="btn btn-secondary">Annuleren</button>
            </div>
        `
    });

    mijnPopup.open();

    setTimeout(() => {
        document.getElementById("confirm-delete")?.addEventListener("click", async () => {
            await deleteModule(id);
            mijnPopup.close();
            window.location.href = "/";
        });

        document.getElementById("cancel-delete")?.addEventListener("click", () => {
            mijnPopup.close();
        });
    }, 0);
}
