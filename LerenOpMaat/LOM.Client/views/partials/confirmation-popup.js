import Popup from "../../components/Popup.js";
import { deleteModule, deleteRoute } from '../../client/api-client.js';
let popup;
export default async function confirmationPopup(name, type, id, callback) {
    let isDelete = (type === "delete" || name === "de leerroute");
    popup = new Popup({
        maxWidth: 'auto',
        height: 'auto',
        sizeCloseButton: '0',
        extraButtons: false,
        closeButtonStyle: 'popup-confirmation-closebutton',
        header: `
                    <h3 class="popup-header-confirmation">
                        ${isDelete ? "Verwijderen leerroute" : "Deactiveren module"}
                    </h3>
                `,
        content: `
                    <div class="confirmation-popup-content">
                    <p>Weet u zeker dat u ${name} wilt ${isDelete ? "verwijderen" : "deactiveren"}?</p>
                    <div class="confirmation-popup-buttons"> 
                        <button id="${isDelete ? "confirm-delete" : "confirm-deactivate"}" class="confirmation-accept-btn">Ja</button>
                        <button id="${isDelete ? "cancel-delete" : "cancel-deactivate"}" class="confirmation-deny-btn">Nee</button>
                    </div>
                    </div>
                `
    });

    popup.open();

    setTimeout(() => {
        if (isDelete) {
            document.getElementById("confirm-delete")?.addEventListener("click", async () => {
                try {
                    const isDeleted = await deleteRoute(id);
                    if (isDeleted) {
                        window.location.reload();
                    } else {
                        console.error("Fout bij het verwijderen van de leerroute.");
                    }
                } catch (error) {
                    console.error("Fout bij het verwijderen van de leerroute:", error.message);
                }
            });
            document.getElementById("cancel-delete")?.addEventListener("click", () => {
                popup.close();
            });
        } else {
            document.getElementById("confirm-deactivate")?.addEventListener("click", async () => {
                await deleteModule(id);
                window.location.href = "/";
            });
            document.getElementById("cancel-deactivate")?.addEventListener("click", () => {
                popup.close();
            });
        }
    }, 0);

    window.addEventListener('beforeunload', handleUnload);
    window.addEventListener('popstate', handleUnload);

    function handleUnload() {
        popup.close();
    }
}