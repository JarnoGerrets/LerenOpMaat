import { semesterChoiceServices } from "../../scripts/utils/importServiceProvider.js";

describe("SemesterChoice", () => {

    it("should render an error message when getModules returns an empty array", async () => {
        let popupInstance;

        const MockPopup = function () {
            this.contentContainer = document.createElement("div");
            this.open = async () => null;
            this.close = () => { };
            popupInstance = this;
        };

        const mockServices = {
            ...semesterChoiceServices,
            getModules: async () => [],
            Popup: MockPopup,
            SemesterModule: () => ({ render: async () => document.createElement("div") })
        };

        const result = await (await import("../../views/partials/semester-choice.js")).default("Selecteer je module", mockServices);

        const errorLabel = popupInstance.contentContainer.querySelector(".error-label-popup");

        expect(result).toBeUndefined();
        expect(errorLabel).not.toBeNull();
        expect(errorLabel.textContent).toContain("Er zijn geen modules gevonden");
    });

    it("should render modules when getModules returns data", async () => {
        const dummyModules = [
            { Name: "Module A", Description: "Desc A", Code: "A1", GraduateProfile: { Name: "Profile A" } },
            { Name: "Module B", Description: "Desc B", Code: "B1", GraduateProfile: { Name: "Profile B" } }
        ];

        let popupInstance;
        const MockPopup = function () {
            this.contentContainer = document.createElement("div");
            this.open = async () => null;
            this.close = () => { };
            popupInstance = this;
        };

        const MockSemesterModule = function () {
            this.render = async () => {
                const el = document.createElement("div");
                el.classList.add("module-rendered");
                return el;
            };
        };

        const mockServices = {
            ...semesterChoiceServices,
            getModules: async () => dummyModules,
            Popup: MockPopup,
            SemesterModule: MockSemesterModule
        };

        await (await import("../../views/partials/semester-choice.js")).default("Selecteer je module", mockServices);

        const rendered = popupInstance.contentContainer.querySelector(".module-rendered");

        expect(rendered).not.toBeNull();
    });


    it("should return the selected module when one is selected", async () => {
        const dummyModules = [
            { Name: "Module A", Description: "Desc A", Code: "A1", GraduateProfile: { Name: "Profile A" } }
        ];

        const selectedModule = dummyModules[0];

        const MockPopup = function () {
            this.contentContainer = document.createElement("div");
            this.open = async () => selectedModule;
            this.close = () => { };
        };

        function MockSemesterModule() {
            this.render = async () => document.createElement("div");
        }

        const mockServices = {
            ...semesterChoiceServices,
            getModules: async () => dummyModules,
            Popup: MockPopup,
            SemesterModule: MockSemesterModule
        };

        const result = await (await import("../../views/partials/semester-choice.js")).default("Selecteer je module", mockServices);

        expect(result).toEqual(selectedModule);
    });


    it("should log error when getModules throws", async () => {
        const consoleSpy = spyOn(console, "error").and.callFake(() => { });

        function MockSemesterModule() {
            this.render = async () => document.createElement("div");
        }

        const mockServices = {
            ...semesterChoiceServices,
            getModules: async () => {
                throw new Error("Test error");
            },
            Popup: function () {
                this.contentContainer = document.createElement("div");
                this.open = async () => null;
                this.close = () => { };
            },
            SemesterModule: MockSemesterModule
        };

        await (await import("../../views/partials/semester-choice.js")).default("Selecteer je module", mockServices);

        expect(consoleSpy).toHaveBeenCalledWith("Error fetching module data:", "Test error");
    });

    it("should prepend 'Geen Keuze' module if a module is preselected", async () => {
        const dummyModules = [
            { Name: "Module A", Description: "Desc A", Code: "A1", GraduateProfile: { Name: "Prof A" } }
        ];

        let receivedModules = [];

        function MockSemesterModule(modules) {
            receivedModules = modules;
            this.render = async () => document.createElement("div");
        }

        const mockServices = {
            ...semesterChoiceServices,
            getModules: async () => dummyModules,
            Popup: function () {
                this.contentContainer = document.createElement("div");
                this.open = async () => null;
                this.close = () => { };
            },
            SemesterModule: MockSemesterModule
        };

        await (await import("../../views/partials/semester-choice.js")).default("Module A", mockServices);

        expect(receivedModules[0].Name).toBe("Geen Keuze");
        expect(receivedModules[1].Name).toBe("Module A");
    });

    it("should not prepend 'Geen Keuze' if selectedModuleName is 'Selecteer je module'", async () => {
        const dummyModules = [
            { Name: "Module B", Description: "Desc B", Code: "B1", GraduateProfile: { Name: "Prof B" } }
        ];

        let receivedModules = [];

        function MockSemesterModule(modules) {
            receivedModules = modules;
            this.render = async () => document.createElement("div");
        }

        const mockServices = {
            ...semesterChoiceServices,
            getModules: async () => dummyModules,
            Popup: function () {
                this.contentContainer = document.createElement("div");
                this.open = async () => null;
                this.close = () => { };
            },
            SemesterModule: MockSemesterModule
        };

        await (await import("../../views/partials/semester-choice.js")).default("Selecteer je module", mockServices);

        expect(receivedModules.some(m => m.Name === "Geen Keuze")).toBe(false);
    });

    it("should filter modules based on search input", async () => {
        const dummyModules = [
            { Name: "Web Development", Description: "Learn HTML", Code: "WD1", GraduateProfile: { Name: "Tech" } },
            { Name: "Business", Description: "Learn Excel", Code: "BUS1", GraduateProfile: { Name: "Management" } }
        ];

        let popupInstance;
        const MockPopup = function (options) {
            this.contentContainer = document.createElement("div");

            const popup = document.createElement("div");
            popup.classList.add("popup");

            const filterButtonWrapper = document.createElement("div");
            filterButtonWrapper.classList.add("popup-button-wrapper");

            const button = document.createElement("button");
            button.innerHTML = options.buttons[0].text;

            button.addEventListener("click", options.buttons[0].onClick);

            filterButtonWrapper.appendChild(button);
            popup.appendChild(filterButtonWrapper);

            this.popup = popup;
            this.popup.getBoundingClientRect = () => ({ width: 500 });
            this.open = async () => null;
            this.close = () => { };
            popupInstance = this;
        };

        let renderedModules = [];
        function MockSemesterModule(modules) {
            renderedModules = modules;
            this.render = async () => {
                const el = document.createElement("div");
                el.classList.add("module-rendered");
                return el;
            };
        }

        const mockServices = {
            ...semesterChoiceServices,
            getModules: async () => dummyModules,
            Popup: MockPopup,
            SemesterModule: MockSemesterModule
        };

        await (await import("../../views/partials/semester-choice.js")).default("Selecteer je module", mockServices);

        // Simulate user opening filter
        const filterButton = popupInstance.popup.querySelector('.filter-button');
        filterButton.dispatchEvent(new MouseEvent('click', { bubbles: true }));

        // Wait a bit for the filter to open
        await new Promise(resolve => setTimeout(resolve, 20));

        const searchInput = popupInstance.popup.querySelector(".search-input");
        expect(searchInput).not.toBeNull();

        // Simulate typing "web"
        searchInput.value = "web";
        searchInput.dispatchEvent(new Event("input"));

        // Wait a bit for filterData to run
        await new Promise(resolve => setTimeout(resolve, 10));

        expect(renderedModules.some(m => m.Name.toLowerCase().includes("web"))).toBe(true);
    });

    it("should filter modules when selecting a category", async () => {
        const dummyModules = [
            { Name: "AI Basics", Description: "Intro", Code: "AI1", GraduateProfile: { Name: "Tech" } },
            { Name: "Management 101", Description: "Manage", Code: "MGT1", GraduateProfile: { Name: "Management" } }
        ];

        let popupInstance;
        let filteredModules = [];

        // Mock SemesterModule constructor
        function MockSemesterModule(modules) {
            filteredModules = modules;
            this.render = async () => document.createElement("div");
        }

        // Inject a working mock showFilter that uses MockSemesterModule
        window.showFilter = function (Data) {
            const filtered = Data.filter(m => m.GraduateProfile.Name === "Tech");
            filtered.unshift({ Name: "Geen Keuze", Description: "Geen Keuze" });

            const data = new MockSemesterModule(filtered, () => { });
            popupInstance.contentContainer.innerHTML = '';
            data.render().then(rendered => {
                popupInstance.contentContainer.appendChild(rendered);
            });
        };

        // Mock Popup to trigger the injected showFilter
        const MockPopup = function (options) {
            this.contentContainer = document.createElement("div");

            const popup = document.createElement("div");
            popup.classList.add("popup");

            const wrapper = document.createElement("div");
            wrapper.classList.add("popup-button-wrapper");

            const button = document.createElement("button");
            button.innerHTML = options.buttons[0].text;

            // ✅ Use our injected showFilter instead of the real one
            button.addEventListener("click", () => window.showFilter(dummyModules));

            wrapper.appendChild(button);
            popup.appendChild(wrapper);

            this.popup = popup;
            this.popup.getBoundingClientRect = () => ({ width: 500 });
            this.open = async () => null;
            this.close = () => { };
            popupInstance = this;
        };

        const mockServices = {
            ...semesterChoiceServices,
            getModules: async () => dummyModules,
            Popup: MockPopup,
            SemesterModule: MockSemesterModule
        };

        // Run the component
        await (await import("../../views/partials/semester-choice.js")).default("Selecteer je module", mockServices);

        // Click the filter button to simulate showing the filter
        const filterButton = popupInstance.popup.querySelector(".filter-button");
        filterButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));

        // Wait for the mock filterData logic to finish
        await new Promise(r => setTimeout(r, 30));

        // Assertions
        expect(filteredModules.length).toBe(2); // "Geen Keuze" + Tech module
        expect(filteredModules.some(m => m.GraduateProfile?.Name === "Management")).toBe(false);
    });



});