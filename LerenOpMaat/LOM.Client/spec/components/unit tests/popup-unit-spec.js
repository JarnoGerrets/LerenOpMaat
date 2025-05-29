import Popup from "../../../components/Popup.js";

describe("Popup unit", () => {
    it("should initialize with default dimensions and classes", () => {
        const popup = new Popup({});
        expect(popup.popup.classList.contains("popup")).toBeTrue();
        expect(popup.overlay.classList.contains("popup-overlay")).toBeTrue();
        expect(popup.popup.style.minWidth).toBe("auto");
        expect(popup.popup.style.minHeight).toBe("auto");
    });

    it("should apply custom dimensions passed to constructor", () => {
        const popup = new Popup({
            minwidth: "200px",
            minheight: "150px",
            maxWidth: "800px",
            maxHeight: "600px"
        });

        expect(popup.popup.style.minWidth).toBe("200px");
        expect(popup.popup.style.minHeight).toBe("150px");
        expect(popup.popup.style.maxWidth).toBe("800px");
        expect(popup.popup.style.maxHeight).toBe("600px");
    });

    it("should create header and title wrapper with given header text", () => {
        const popup = new Popup({ header: "My Header" });
        const header = popup.popup.querySelector(".popup-header");
        expect(header.textContent).toBe("My Header");
    });

    it("should include title wrapper class if provided", () => {
        const popup = new Popup({ titleWrapperClass: "custom-title" });
        const titleWrapper = popup.popup.querySelector(".popup-title");
        expect(titleWrapper.classList.contains("custom-title")).toBeTrue();
    });

    it("should render content into content container", () => {
        const popup = new Popup({ content: "<p>Hello</p>" });
        expect(popup.contentContainer.innerHTML).toContain("Hello");
    });

    it("should create extra buttons if extraButtons is true", () => {
        const spy = jasmine.createSpy("btnClick");
        const popup = new Popup({
            extraButtons: true,
            buttons: [{ text: "Confirm", onClick: spy }]
        });

        const button = popup.popup.querySelector(".popup-btn");
        expect(button).not.toBeNull();
        expect(button.textContent).toBe("Confirm");

        button.click();
        expect(spy).toHaveBeenCalled();
    });

    it("should hide button container if extraButtons is true but buttons are empty", () => {
        const popup = new Popup({ extraButtons: true });
        const container = popup.popup.querySelector(".popup-button-container");
        expect(container.style.display).toBe("none");
    });

    it("should bind close button events and call close on click", () => {
        const popup = new Popup({});
        spyOn(popup, "close");
        const closeBtn = popup.popup.querySelector(".popup-close-btn");
        closeBtn.click();
        expect(popup.close).toHaveBeenCalled();
    });

    it("should handle outside clicks by closing the popup", () => {
        const popup = new Popup({});
        spyOn(popup, "close");

        document.body.appendChild(popup.overlay);

        const event = new MouseEvent("click", { bubbles: true });
        Object.defineProperty(event, "target", { value: document.body });
        popup._handleOutsideClick(event);

        expect(popup.close).toHaveBeenCalled();
        popup.overlay.remove();
    });

    it("should not close on inside clicks", () => {
        const popup = new Popup({});
        spyOn(popup, "close");

        const event = new MouseEvent("click", { bubbles: true });
        Object.defineProperty(event, "target", { value: popup.popup });
        popup._handleOutsideClick(event);

        expect(popup.close).not.toHaveBeenCalled();
    });
});
