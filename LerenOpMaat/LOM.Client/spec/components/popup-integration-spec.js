import Popup from "../../components/Popup.js";
import { wait } from "../helpers/test-utils.js";

describe("Popup integration", () => {
    it("should render the popup into the DOM and respond to open", async () => {
        const popup = new Popup({
            header: "Test Popup",
            content: "<p>Hello World</p>",
            sizeCloseButton: "16"
        });

        const openPromise = popup.open();
        await wait(50);

        const rendered = document.body.contains(popup.overlay);
        expect(rendered).toBeTrue();

        const header = popup.popup.querySelector(".popup-header");
        expect(header.textContent).toContain("Test Popup");

        const content = popup.contentContainer.querySelector("p");
        expect(content.textContent).toBe("Hello World");

        popup.close();
        await wait(350);
        expect(document.body.contains(popup.overlay)).toBeFalse();

        await openPromise;
    });

    it("should toggle 'scrolling' class on scroll event", async () => {
        const popup = new Popup({
            content: "<div style='height:1000px'>Mock Content</div>",
            sizeCloseButton: "16"
        });

        const scrollWrapper = popup.popup.querySelector(".popup-scroll");

        scrollWrapper.dispatchEvent(new Event("scroll"));
        expect(scrollWrapper.classList.contains("scrolling")).toBeTrue();

        await wait(800);

        expect(scrollWrapper.classList.contains("scrolling")).toBeFalse();
    });

    it("should not throw and still set up scroll wrapper even without adding to DOM", async () => {
        const popup = new Popup({
            content: "<p>Scroll test content</p>",
            sizeCloseButton: "16"
        });

        const scrollWrapper = popup.popup.querySelector(".popup-scroll");
        expect(scrollWrapper).not.toBeNull();

        scrollWrapper.dispatchEvent(new Event("scroll"));
        expect(scrollWrapper.classList.contains("scrolling")).toBeTrue();

        await wait(800);
        expect(scrollWrapper.classList.contains("scrolling")).toBeFalse();
    });


});
