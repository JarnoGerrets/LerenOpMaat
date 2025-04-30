import Popup from "../../components/Popup.js";
import { deleteModule } from "../../client/api-client.js";

let mijnPopup;


export default async function confirmationPopup(id, name) {
    mijnPopup = new Popup({
        maxWidth: 'auto',
        height: '250px',
        sizeCloseButton: '0',
        closeButtonStyle: 'popup-confirmation-closebutton',
        header: `
            <h3 class="popup-header-confirmation">
                Wilt u '${name}' verwijderen?
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
            window.location.href = "/";
        });

        document.getElementById("cancel-delete")?.addEventListener("click", () => {
            mijnPopup.close();
        });
    }, 0);

    window.addEventListener('beforeunload', handleUnload);
    window.addEventListener('popstate', handleUnload);

    function handleUnload() {
        mijnPopup.close();
    }


}

