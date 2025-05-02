import Popup from "../../components/Popup.js";
import { deleteModule } from "../../client/api-client.js";

let mijnPopup;


export default async function confirmationPopup(id, name) {
    mijnPopup = new Popup({
        maxWidth: 'auto',
        height: 'auto',
        sizeCloseButton: '0',
        extraButtons: false,
        closeButtonStyle: 'popup-confirmation-closebutton',
        header: `
            <h3 class="popup-header-confirmation">
                Verwijderen module
            </h3>
        `,
        titleWrapperClass: 'popup-title-confirmation',
        content: `
            <div class="confirmation-popup-content">
            <p>Weet u zeker dat u ${name} wilt verwijderen?</p>
            <div class="confirmation-popup-buttons"> 
                <button id="confirm-delete" class="confirmation-accept-btn">Ja</button>
                <button id="cancel-delete" class="confirmation-deny-btn">Nee</button>
                </div>
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

