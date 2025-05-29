import { initModuleInfoServices } from "../../../scripts/utils/importServiceProvider.js";
import { setupModuleInfoTestDOM, getMockModuleData, getMockServices } from "../../helpers/module-info-intergration-helper.js";

describe("initModuleInfo integration", () => {

    beforeEach(() => {
        setupModuleInfoTestDOM();

    });

    afterEach(() => {
        document.getElementById("test-root").innerHTML = "";
    });

    it("renders module-card and requirements-card with correct data", async () => {
        const { default: initModuleInfo } = await import("../../../scripts/initModuleInfo.js");
        const mockedModule = getMockModuleData();
        const mockedServices = getMockServices(mockedModule);

        window.userData = Promise.resolve({ Role: "SLBer" });

        await initModuleInfo("42", mockedServices);

        const moduleCard = document.querySelector("module-card");
        const reqCard = document.querySelector("requirements-card");
        const textArea = document.getElementById("moduleTextArea");

        expect(moduleCard).not.toBeNull();
        expect(reqCard).not.toBeNull();
        expect(textArea.value).toBe("Beschrijving test");
        expect(mockedServices.setupButtons).toHaveBeenCalledWith(jasmine.any(Object), textArea, true);
    });
});
