import Popup from "../../components/Popup.js";

let popup;
export default async function confirmationPopup(name, type, callback) {
    popup = new Popup({
        maxWidth: 'auto',
        height: 'auto',
        sizeCloseButton: '0',
        extraButtons: false,
        closeButtonStyle: 'popup-confirmation-closebutton',
        header: `
            <h3 class="popup-header-confirmation">
                Verwijderen ${type}
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

    popup.open();

    setTimeout(() => {
        document.getElementById("confirm-delete")?.addEventListener("click", async () => {
            if (callback) {
                callback();
            }
            else {
                console.error("No callback provided.");
            }

            handleUnload();
        });

        document.getElementById("cancel-delete")?.addEventListener("click", () => {
            popup.close();
        });
    }, 0);

    window.addEventListener('beforeunload', handleUnload);
    window.addEventListener('popstate', handleUnload);

    function handleUnload() {
        popup.close();
    }
}