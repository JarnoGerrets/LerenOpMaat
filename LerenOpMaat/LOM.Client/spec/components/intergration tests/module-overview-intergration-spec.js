import { setupModuleOverviewTestDOM, getMockModuleOverviewServices, getMockModules, getMockProfiles, mockUserRole } from "../../helpers/module-overview-integration-helper.js";

describe("moduleOverview integration", () => {

    beforeEach(() => {
        setupModuleOverviewTestDOM();
    });

    afterEach(() => {
        document.getElementById("test-root").innerHTML = "";
    });

    it("rendert layout correct", async () => {
        const { default: ModuleOverview } = await import("../../../components/module-overview.js");

        const mockedModule = getMockModules();
        const mockedProfiles = getMockProfiles();
        const mockedServices = getMockModuleOverviewServices(mockedModule, mockedProfiles);

        const el = document.querySelector('module-overview');
        await el.connectedCallback(mockedServices);

        expect(el.querySelector('h1').textContent).toContain("Module Overzicht");
        expect(el.querySelector('#searchInput')).not.toBeNull();
        expect(el.querySelector('#module-wrapper')).not.toBeNull();
    });

    it("toont module cards als data geladen wordt", async () => {
        const { default: ModuleOverview } = await import("../../../components/module-overview.js");

        const mockedModule = getMockModules();
        const mockedProfiles = getMockProfiles();
        const mockedServices = getMockModuleOverviewServices(mockedModule, mockedProfiles);

        const el = document.querySelector('module-overview');
        await el.connectedCallback(mockedServices);

        const cards = el.querySelectorAll("module-card");
        expect(cards.length).toBe(2);
    });

    it("laat add-module knop zien voor docent", async () => {
        const { default: ModuleOverview } = await import("../../../components/module-overview.js");

        mockUserRole();

        const mockedModule = getMockModules();
        const mockedProfiles = getMockProfiles();
        const mockedServices = getMockModuleOverviewServices(mockedModule, mockedProfiles);

        const el = document.querySelector('module-overview');
        await el.connectedCallback(mockedServices);

        const btn = el.querySelector("#add-module-button");
        expect(getComputedStyle(btn).display).toBe("flex");
    });
});
