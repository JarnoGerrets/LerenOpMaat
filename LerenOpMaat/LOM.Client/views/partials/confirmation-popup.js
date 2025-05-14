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
                Deactiveren module
            </h3>
        `,
        titleWrapperClass: 'popup-title-confirmation',
        content: `
            <div class="confirmation-popup-content">
            <p>Weet u zeker dat u ${name} wilt deactiveren?</p>
            <div class="confirmation-popup-buttons"> 
                <button id="confirm-deactivate" class="confirmation-accept-btn">Ja</button>
                <button id="cancel-deactivate" class="confirmation-deny-btn">Nee</button>
                </div>
            </div>
        `
    });

    mijnPopup.open();

    setTimeout(() => {
        document.getElementById("confirm-deactivate")?.addEventListener("click", async () => {
            await deleteModule(id);
            window.location.href = "/";
        });

        document.getElementById("cancel-deactivate")?.addEventListener("click", () => {
            mijnPopup.close();
        });
    }, 0);

    window.addEventListener('beforeunload', handleUnload);
    window.addEventListener('popstate', handleUnload);

    function handleUnload() {
        mijnPopup.close();
    }


}

