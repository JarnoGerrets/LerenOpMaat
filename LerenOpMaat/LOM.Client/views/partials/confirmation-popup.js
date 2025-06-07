import Popup from "../../components/popup.js";


let popup;
export default async function confirmationPopup(name, id, header, content, confirmationAction, hrefLink) {
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
    // slight delay to make sure all elements are part of the DOM before quering for them
    setTimeout(() => {
        document.getElementById("confirm-confirmation-popup")?.addEventListener("click", async () => {
            await confirmationAction(id);
            popup.close();
            window.location.href = hrefLink;
            
        });

        document.getElementById("cancel-confirmation-popup")?.addEventListener("click", () => {
            popup.close();
        });
    }, 0);

    window.addEventListener('beforeunload', handleUnload);
    window.addEventListener('popstate', handleUnload);

    function handleUnload() {
        popup.close();
    }
}