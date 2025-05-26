import Popup from "../../components/Popup.js";


let popup;
export default async function confirmationPopup(name, id, header, content, confirmationAction) {
    popup = new Popup({
        maxWidth: 'auto',
        height: 'auto',
        sizeCloseButton: '0',
        extraButtons: false,
        closeButtonStyle: 'popup-confirmation-closebutton',
        header: header,
        titleWrapperClass: 'popup-title-confirmation',
        content: content
    });

    popup.open();

    setTimeout(() => {
        document.getElementById("confirm-deactivate")?.addEventListener("click", async () => {
            await confirmationAction(id);
            popup.close();
            window.location.href = "#module-overview";
            
        });

        document.getElementById("cancel-deactivate")?.addEventListener("click", () => {
            popup.close();
        });
    }, 0);

    setTimeout(() => {
        document.getElementById("confirm-delete")?.addEventListener("click", async () => {
            if (id && name === "de leerroute") { // Controleer of het om een leerroute gaat
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
            }
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