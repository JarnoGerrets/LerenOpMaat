import Popup from "../../../components/popup.js";
import { wait } from "../../helpers/test-utils.js";

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

    it("should create a popup with header, controls, and content", () => {
        const popup = new Popup({ header: "Test Header", content: "<p>Test Content</p>", sizeCloseButton: "16" });

        expect(popup.popup.querySelector(".popup-header").textContent).toContain("Test Header");
        expect(popup.popup.querySelector(".popup-controls")).not.toBeNull();
        expect(popup.contentContainer.innerHTML).toContain("Test Content");
    });

    it("should render close button SVG with correct size", () => {
        spyOn(document.body, "appendChild").and.callFake(() => { })

        const popup = new Popup({ sizeCloseButton: "20" });
        const svg = popup.popup.querySelector("svg");

        expect(svg.getAttribute("viewBox")).toBe("0 0 20 20");
    });


    it("should append overlay to DOM on open", async () => {
        const popup = new Popup({});
        const promise = popup.open();

        expect(document.body.contains(popup.overlay)).toBeTrue();
        popup.close();
        await promise;
    });

    it("should remove overlay from DOM and resolve result on close", async () => {
        spyOn(document.body, "appendChild").and.callFake(() => { })
        const popup = new Popup({});
        const promise = popup.open();
        popup.close("someResult");

        const result = await promise;
        expect(result).toBe("someResult");
        expect(document.body.contains(popup.overlay)).toBeFalse();
    });

    it("should render extra buttons and call their onClick handlers", async () => {
        const onClickSpy = jasmine.createSpy("extraBtnClick");

        const popup = new Popup({
            extraButtons: true,
            buttons: [{ text: "Confirm", onClick: onClickSpy }],
            sizeCloseButton: "16"
        });

        const button = popup.popup.querySelector(".popup-btn");
        expect(button.textContent).toContain("Confirm");

        button.click();
        expect(onClickSpy).toHaveBeenCalled();
    });

    it("should apply provided class names to close button and title wrapper", () => {
        const popup = new Popup({
            closeButtonStyle: "custom-close",
            titleWrapperClass: "custom-title",
            sizeCloseButton: "16"
        });

        const closeBtn = popup.popup.querySelector(".popup-close-btn");
        expect(closeBtn.classList.contains("custom-close")).toBeTrue();

        const titleWrapper = popup.popup.querySelector(".popup-title");
        expect(titleWrapper.classList.contains("custom-title")).toBeTrue();
    });

    it("should close popup when clicking outside", async () => {
        const popup = new Popup({});
        const openPromise = popup.open();
        await wait(50);

        document.body.appendChild(popup.overlay);
        spyOn(popup, "close").and.callThrough();

        await wait(30);

        const outsideClick = new MouseEvent("click", { bubbles: true });
        document.dispatchEvent(outsideClick);

        await wait(350);
        expect(popup.close).toHaveBeenCalled();
        await openPromise;
    });

    it("should safely handle multiple calls to close()", async () => {
        const popup = new Popup({});
        const openPromise = popup.open();
        await wait(50);

        expect(() => {
            popup.close();
            popup.close();
        }).not.toThrow();

        await openPromise;
    });


});
