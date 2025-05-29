import { initModuleInfoServices } from "../../../scripts/utils/importServiceProvider.js";
import { setupModuleInfoTestDOM, getMockModuleData, getMockServices } from "../../helpers/module-info-intergration-helper.js";

describe("initModuleInfo integration", () => {
    let mockServices, moduleData;

    beforeEach(() => {
        setupModuleInfoTestDOM();

    });

    afterEach(() => {
        document.getElementById("test-root").innerHTML = "";
    });

    it("renders module-card and requirements-card with correct data", async () => {
        const { default: initModuleInfo } = await import("../../../scripts/initModuleInfo.js");

        await initModuleInfo("42", mockServices);

        const moduleCard = document.querySelector("module-card");
        const reqCard = document.querySelector("requirements-card");
        const textArea = document.getElementById("moduleTextArea");

        expect(moduleCard).not.toBeNull();
        expect(reqCard).not.toBeNull();
        expect(textArea.value).toBe("Beschrijving test");
        expect(mockServices.setupButtons).toHaveBeenCalledWith(jasmine.any(Object), textArea, true);
    });
});
