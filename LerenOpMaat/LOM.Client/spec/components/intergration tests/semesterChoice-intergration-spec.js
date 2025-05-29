import { semesterChoiceServices } from "../../../scripts/utils/importServiceProvider.js";
import { createMockPopup, createMockSemesterModule, setupSemesterChoiceTest, setupSemesterChoiceWithCustomFilter } from "../../helpers/semesterChoice-intergration-helpers.js"
import { wait } from "../../helpers/test-utils.js";

describe("SemesterChoice integration", () => {

    it("should render an error message when getModules returns an empty array", async () => {
        const popupRef = { popupInstance: null };
        const tempDocument = document.getElementById("test-root");
        
        const MockPopup = createMockPopup(popupRef);
        const MockSemesterModule = () => ({ render: async () => tempDocument.createElement("div") });

        const mockServices = {
            ...semesterChoiceServices,
            getModules: async () => [],
            Popup: MockPopup,
            SemesterModule: MockSemesterModule
        };

        const result = await (await import("../../../views/partials/semester-choice.js")).default("Selecteer je module", mockServices);

        const errorLabel = popupRef.popupInstance.contentContainer.querySelector(".error-label-popup");

        expect(result).toBeUndefined();
        expect(errorLabel).not.toBeNull();
        expect(errorLabel.textContent).toContain("Er zijn geen modules gevonden");
    });

    it("should render modules when getModules returns data", async () => {
        const modules = [
            { Name: "Module A", Description: "Desc A", Code: "A1", GraduateProfile: { Name: "Profile A" } },
            { Name: "Module B", Description: "Desc B", Code: "B1", GraduateProfile: { Name: "Profile B" } }
        ];

        const tracker = [];
        const { popupRef, run } = setupSemesterChoiceTest({ modules, tracker });

        await run();

        const rendered = popupRef.popupInstance.contentContainer.querySelector(".module-rendered");
        expect(rendered).not.toBeNull();
    });



    it("should return the selected module when one is selected", async () => {
        const modules = [
            { Name: "Module A", Description: "Desc A", Code: "A1", GraduateProfile: { Name: "Profile A" } }
        ];

        const selectedModule = modules[0];

        const popupRef = { popupInstance: null }
        const tempDocument = document.getElementById("test-root");

        const MockPopup = function () {
            this.contentContainer = document.createElement("div");
            tempDocument.appendChild(this.contentContainer);
            this.open = async () => selectedModule;
            this.close = () => { };
            popupRef.popupInstance = this;
        };

        const MockSemesterModule = createMockSemesterModule();

        const mockServices = {
            ...semesterChoiceServices,
            getModules: async () => modules,
            Popup: MockPopup,
            SemesterModule: MockSemesterModule
        };

        const result = await (await import("../../../views/partials/semester-choice.js")).default("Selecteer je module", mockServices);

        expect(result).toEqual(selectedModule);
    });



    it("should log error when getModules throws", async () => {
        const consoleSpy = spyOn(console, "error").and.callFake(() => { });

        const MockSemesterModule = createMockSemesterModule();

        const popupRef = { popupInstance: null };
        const MockPopup = createMockPopup(popupRef);

        const mockServices = {
            ...semesterChoiceServices,
            getModules: async () => {
                throw new Error("Test error");
            },
            Popup: MockPopup,
            SemesterModule: MockSemesterModule
        };

        await (await import("../../../views/partials/semester-choice.js")).default("Selecteer je module", mockServices);

        expect(consoleSpy).toHaveBeenCalledWith("Error fetching module data:", "Test error");
    });


    it("should prepend 'Geen Keuze' module if a module is preselected", async () => {
        const modules = [
            { Name: "Module A", Description: "Desc A", Code: "A1", GraduateProfile: { Name: "Prof A" } }
        ];

        const tracker = [];
        const { run } = setupSemesterChoiceTest({
            modules,
            selectedModuleName: "Module A",
            tracker
        });

        await run();

        expect(tracker[0].Name).toBe("Geen Keuze");
        expect(tracker[1].Name).toBe("Module A");
    });

    it("should not prepend 'Geen Keuze' if selectedModuleName is 'Selecteer je module'", async () => {
        const modules = [
            { Name: "Module B", Description: "Desc B", Code: "B1", GraduateProfile: { Name: "Prof B" } }
        ];

        const tracker = [];
        const { run } = setupSemesterChoiceTest({
            modules,
            selectedModuleName: "Selecteer je module",
            tracker
        });

        await run();

        expect(tracker.some(m => m.Name === "Geen Keuze")).toBeFalse();
    });


    it("should filter modules based on search input", async () => {
        const modules = [
            { Name: "Web Development", Description: "Learn HTML", Code: "WD1", GraduateProfile: { Name: "Tech" } },
            { Name: "Business", Description: "Learn Excel", Code: "BUS1", GraduateProfile: { Name: "Management" } }
        ];

        const tracker = [];
        const popupRef = { popupInstance: null };
        const tempDocument = document.getElementById("test-root");
        const MockSemesterModule = createMockSemesterModule(tracker);

        const onClickOverride = () => {
            const input = document.createElement("input");
            tempDocument.appendChild(input);
            input.classList.add("search-input");

            input.addEventListener("input", () => {
                const query = input.value.toLowerCase();
                const filtered = modules.filter(m => m.Name.toLowerCase().includes(query));
                filtered.unshift({ Name: "Geen Keuze", Description: "Geen Keuze" });

                const instance = new MockSemesterModule(filtered);
                popupRef.popupInstance.contentContainer.innerHTML = '';
                instance.render().then(el => popupRef.popupInstance.contentContainer.appendChild(el));
            });

            popupRef.popupInstance.popup.appendChild(input);
        };

        const mockServices = {
            ...semesterChoiceServices,
            getModules: async () => modules,
            Popup: createMockPopup(popupRef, onClickOverride),
            SemesterModule: MockSemesterModule
        };

        await (await import("../../../views/partials/semester-choice.js")).default("Selecteer je module", mockServices);

        const filterButton = popupRef.popupInstance.popup.querySelector(".filter-button");
        filterButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));

        const input = popupRef.popupInstance.popup.querySelector(".search-input");
        expect(input).not.toBeNull();

        input.value = "web";
        input.dispatchEvent(new Event("input"));

        await wait(10);

        expect(tracker.some(m => m.Name.toLowerCase().includes("web"))).toBeTrue();
    });


    it("should filter modules when selecting a category", async () => {
        const modules = [
            { Name: "AI Basics", Description: "Intro", Code: "AI1", GraduateProfile: { Name: "Tech" } },
            { Name: "Management 101", Description: "Manage", Code: "MGT1", GraduateProfile: { Name: "Management" } }
        ];

        const tracker = [];
        const { popupRef, run } = setupSemesterChoiceWithCustomFilter({
            modules,
            tracker,
            filterLogic: (data) => {
                const filtered = data.filter(m => m.GraduateProfile?.Name === "Tech");
                filtered.unshift({ Name: "Geen Keuze", Description: "Geen Keuze" });
                return filtered;
            }
        });

        await run();

        const filterButton = popupRef.popupInstance.popup.querySelector(".filter-button");
        filterButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));

        await wait(30);

        expect(tracker.length).toBe(2);
        expect(tracker.some(m => m.GraduateProfile?.Name === "Management")).toBeFalse();
    });


    it("should reset selected categories and show all modules when 'Alles' is clicked", async () => {
        const modules = [
            { Name: "AI Basics", Description: "Intro", Code: "AI1", GraduateProfile: { Name: "Tech" } },
            { Name: "Business 101", Description: "Biz", Code: "BUS1", GraduateProfile: { Name: "Management" } }
        ];

        const tracker = [];
        const { popupRef, run } = setupSemesterChoiceWithCustomFilter({
            modules,
            tracker,
            filterLogic: (data) => {
                const all = [...data];
                all.unshift({ Name: "Geen Keuze", Description: "Geen Keuze" });
                return all;
            }
        });

        await run();

        const filterButton = popupRef.popupInstance.popup.querySelector(".filter-button");
        filterButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));

        await new Promise(r => setTimeout(r, 30));

        expect(tracker.length).toBe(3);
        expect(tracker.some(m => m.Name === "AI Basics")).toBeTrue();
        expect(tracker.some(m => m.Name === "Business 101")).toBeTrue();
        expect(tracker.some(m => m.Name === "Geen Keuze")).toBeTrue();
    });



});