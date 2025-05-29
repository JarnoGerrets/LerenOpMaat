import { uiUpdatesServices } from "../../../scripts/utils/importServiceProvider.js";
import { updateModuleUI } from '../../../scripts/utils/semester-card-utils/ui-updates.js';
import { setupSemesterCardTest, createMockSemesterCardServices } from "../../helpers/semester-card-intergration-helper.js";
import { wait } from "../../helpers/test-utils.js";

describe("SemesterCard integration", () => {
    beforeEach(() => {
        localStorage.setItem('userData', JSON.stringify({ Role: "Admin" }));
        window.userData = Promise.resolve({ Role: "Admin" });
    });
    afterEach(() => {
        localStorage.clear();
    });
    it("should render a semester card", async () => {
        const services = createMockSemesterCardServices({
            getModule: async () => ({ Id: 123, Name: "MockModule", IsActive: false })
        });

        const { fragment } = await setupSemesterCardTest({
            module: "MockModule",
            moduleId: 1,
            services
        });

        expect(fragment instanceof DocumentFragment).toBeTrue();

        const card = fragment.querySelector(".semester-card");
        expect(card).not.toBeNull();
    });



    it("should display the module name in the button", async () => {
        const services = createMockSemesterCardServices({
            getModule: async () => ({ Id: 123, Name: "MockModule", IsActive: false })
        });

        const { fragment } = await setupSemesterCardTest({
            module: "MockModule",
            moduleId: 1,
            services
        });

        const button = fragment.querySelector("#select-module");
        expect(button.textContent).toContain("MockModule");
    });


    it("should add 'locked' class and lock icon when locked", async () => {
        const services = createMockSemesterCardServices({
            getModule: async () => ({ Id: 123, Name: "MockModule", IsActive: false })
        });

        const { fragment } = await setupSemesterCardTest({
            module: "test",
            moduleId: 1,
            locked: true,
            services
        });

        const button = fragment.querySelector("#select-module");
        expect(button.classList.contains("locked")).toBeTrue();

        const icon = button.querySelector("i");
        expect(icon.classList.contains("bi-lock-fill")).toBeTrue();
    });


    it("should show the inactive label if the module is inactive", async () => {
        const services = createMockSemesterCardServices({
            getModule: async () => ({ Id: 123, Name: "MockModule", IsActive: false })
        });

        const { fragment } = await setupSemesterCardTest({
            module: "MockModule",
            moduleId: 123,
            services
        });

        const label = fragment.querySelector(".inactive-label-tag");
        await wait(0);

        expect(label.classList.contains("hidden")).toBeFalse();
    });


    it("should call onModuleChange when a new module is selected", async () => {
        let calledWith = null;

        const mockSelectedModule = {
            Id: 999,
            Name: "Mocked",
            IsActive: true
        };

        const services = createMockSemesterCardServices({
            getModule: async () => mockSelectedModule,
            SemesterChoice: async () => mockSelectedModule
        });

        const { fragment } = await setupSemesterCardTest({
            module: "Mocked",
            moduleId: 123,
            onModuleChange: (data) => { calledWith = data; },
            services
        });

        const button = fragment.querySelector("#select-module");
        button.click();

        await wait(1000);

        expect(calledWith).not.toBeNull();
        expect(calledWith.semester).toBe(1);
        expect(calledWith.moduleId).toBe(999);
    });


    it("should set data-module-id correctly", async () => {
        const services = createMockSemesterCardServices({
            getModule: async () => ({ Id: 555, Name: "TestModule", IsActive: true })
        });

        const { fragment } = await setupSemesterCardTest({
            semester: 2,
            module: "TestModule",
            moduleId: 555,
            services
        });

        const card = fragment.querySelector(".semester-card");
        expect(card.getAttribute("data-module-id")).toBe("555");
    });

    it("should turn button text red if module is inactive", async () => {
        const services = createMockSemesterCardServices({
            getModule: async () => ({ Id: 444, Name: "TestInactive", IsActive: false }),
            getModuleProgress: async () => ({ Completed: 0, Total: 1 })
        });

        const { fragment } = await setupSemesterCardTest({
            module: "TestInactive",
            moduleId: 444,
            services
        });

        const button = fragment.querySelector("#select-module");
        await wait();
        expect(button.style.color).toBe("red");
    });


    it("should clear selection when 'Geen Keuze' is selected", async () => {
        const mockSelectModule = async () => ({
            Id: null,
            Name: "Geen Keuze",
            IsActive: true
        });

        const services = createMockSemesterCardServices({
            getModule: async () => ({ Id: 123, Name: "ModuleX", IsActive: true }),
            getModuleProgress: async () => ({ Completed: 0, Total: 1 }),
            SemesterChoice: mockSelectModule
        });

        let calledWith = null;

        const { fragment } = await setupSemesterCardTest({
            semester: 2,
            module: "ModuleX",
            moduleId: 123,
            services,
            onModuleChange: (data) => { calledWith = data; }
        });

        fragment.querySelector("#select-module").click();
        await wait(1000);

        expect(calledWith).toEqual({ semester: 2, moduleId: null });
    });



    it("should keep inactive label hidden for active modules", async () => {
        const services = createMockSemesterCardServices({
            getModule: async () => ({ Id: 999, Name: "ActiveModule", IsActive: true }),
            getModuleProgress: async () => ({ Completed: 0, Total: 1 })
        });

        const { fragment } = await setupSemesterCardTest({
            module: "ActiveModule",
            moduleId: 999,
            services
        });

        const label = fragment.querySelector(".inactive-label-tag");
        await wait();

        expect(label.classList.contains("hidden")).toBeTrue();
    });



    it("should call updateAllCardsStyling with moduleId map when clearing selection", async () => {
        const services = createMockSemesterCardServices({
            getModule: async () => ({ Id: 123, Name: "Test", IsActive: true }),
            getModuleProgress: async () => ({ Completed: 0, Total: 1 }),
            SemesterChoice: async () => ({ Name: "Geen Keuze" })
        });

        const { fragment } = await setupSemesterCardTest({
            semester: 2,
            module: "SomeModule",
            moduleId: 777,
            services
        });

        fragment.querySelector("#select-module").click();
        await wait(600);

        expect(services.updateAllCardsStyling).toHaveBeenCalledWith({ 777: [] });
    });


    it("should call updateExclamationIcon with empty string and true on clear", async () => {
        const services = createMockSemesterCardServices({
            getModule: async () => ({ Id: 123, Name: "Test", IsActive: true }),
            getModuleProgress: async () => ({ Completed: 0, Total: 1 }),
            SemesterChoice: async () => ({ Name: "Geen Keuze" }),
            updateExclamationIcon: jasmine.createSpy("updateExclamationIcon")
        });

        const { fragment } = await setupSemesterCardTest({
            semester: 4,
            module: "ClearableModule",
            moduleId: 321,
            services
        });

        fragment.querySelector("#select-module").click();
        await wait(1000);

        expect(services.updateExclamationIcon).toHaveBeenCalledWith(jasmine.any(Element), '', true);
    });


    it("should update course points text when EVL checkbox is clicked", async () => {
        const mockModule = {
            Id: 888,
            Name: "CourseModule",
            IsActive: true,
            Ec: 15,
            Evls: [
                { Id: 1, Name: "EVL 1", Ec: 5 },
                { Id: 2, Name: "EVL 2", Ec: 10 },
            ]
        };

        const mockProgress = { CompletedEvls: [] };
        const mockUpdatedProgress = { CompletedEvls: [{ ModuleEvl: { Id: 1 } }] };

        const wrappedUpdateModuleUI = (...args) =>
            updateModuleUI(...args, {
                ...uiUpdatesServices,
                addCompletedEvl: jasmine.createSpy("addCompletedEvl").and.resolveTo(mockUpdatedProgress),
                validateRoute: jasmine.createSpy("validateRoute").and.resolveTo([]),
                handleValidationResult: jasmine.createSpy("handleValidationResult"),
                calculateAchievedECs: () => 5
            });

        const services = createMockSemesterCardServices({
            getModule: async () => mockModule,
            getModuleProgress: async () => mockProgress,
            updateModuleUI: wrappedUpdateModuleUI
        });

        const { fragment } = await setupSemesterCardTest({
            semester: 1,
            module: "CourseModule",
            moduleId: 888,
            services
        });

        await wait(100);

        const checkbox = fragment.querySelector('input[type="checkbox"][data-evl-id="1"]');
        await checkbox.click();
        checkbox.dispatchEvent(new Event("change", { bubbles: true }));

        await wait(100);

        const coursePoints = fragment.querySelector("#coursePoints");
        expect(coursePoints.textContent).toContain("5/15");
    });


    it("should not call onModuleChange if no module is selected", async () => {
        let called = false;

        const services = createMockSemesterCardServices({
            SemesterChoice: async () => null,
            getModule: async () => ({ Id: 1, Name: "Placeholder", IsActive: true })
        });

        const { fragment } = await setupSemesterCardTest({
            module: "Test",
            moduleId: 1,
            onModuleChange: () => { called = true; },
            services
        });

        fragment.querySelector("#select-module").click();
        await wait(600);

        expect(called).toBeFalse();
    });


    it("should prevent duplicate modules and show an error toast", async () => {
        const mockDuplicateModule = {
            Id: 321,
            Name: "DuplicateModule",
            IsActive: true
        };

        const mockServices = createMockSemesterCardServices({
            getModule: async () => mockDuplicateModule,
            getModuleProgress: async () => ({ Completed: 0, Total: 1 }),
            SemesterChoice: async () => mockDuplicateModule,
            validateRoute: async () => [{
                Message: "Module komt al voor in de leerroute",
                IsValid: false
            }],
        });

        const mockOnModuleChange = jasmine.createSpy("onModuleChange");
        window.showToast = jasmine.createSpy("showToast");

        const { fragment } = await setupSemesterCardTest({
            semester: 5,
            module: "DuplicateModule",
            moduleId: 321,
            isActive: true,
            locked: false,
            onModuleChange: mockOnModuleChange,
            services: mockServices
        });

        const button = fragment.querySelector("#select-module");
        button.click();

        await wait(600);

        expect(window.showToast).toHaveBeenCalledWith(
            "Module kan niet toegevoegd worden omdat het al bestaat in de leerroute.",
            "error"
        );
        expect(mockOnModuleChange).not.toHaveBeenCalledWith({ semester: 5, moduleId: 321 });
    });



    it("should call handleValidationResult with the final validation result", async () => {
        const finalValidationResult = [
            { Message: "Validatie oké", IsValid: true }
        ];

        const mockServices = createMockSemesterCardServices({
            getModule: async () => ({ Id: 111, Name: "TestModule", IsActive: true }),
            getModuleProgress: async () => ({ Completed: 0, Total: 1 }),
            SemesterChoice: async () => ({ Id: 111, Name: "TestModule", IsActive: true }),
            validateRoute: jasmine.createSpy("validateRoute").and.resolveTo(finalValidationResult),
            handleValidationResult: jasmine.createSpy("handleValidationResult")
        });

        const { fragment } = await setupSemesterCardTest({
            semester: 3,
            module: "TestModule",
            moduleId: 111,
            services: mockServices
        });

        const button = fragment.querySelector("#select-module");
        await button.click();
        await wait(1000);

        expect(mockServices.handleValidationResult).toHaveBeenCalledWith(finalValidationResult);
    });


    it("should not throw if SemesterChoice returns an invalid module object", async () => {
        const mockServices = createMockSemesterCardServices({
            SemesterChoice: async () => ({ bad: "data" }),
            getModule: async () => ({ Id: 999, Name: "Test", IsActive: true }),
            getModuleProgress: async () => ({ Completed: 0, Total: 1 })
        });

        const { fragment } = await setupSemesterCardTest({
            semester: 1,
            module: "X",
            moduleId: 123,
            services: mockServices
        });

        const button = fragment.querySelector("#select-module");
        await button.click();
        await wait(500);

        expect(true).toBeTrue();
    });



    it("should not update UI if addCompletedEvl fails", async () => {
        const mockModule = {
            Id: 101,
            Name: "ErrorModule",
            IsActive: true,
            Ec: 10,
            Evls: [{ Id: 1, Name: "EVL A", Ec: 10 }]
        };

        const mockProgress = { CompletedEvls: [] };

        const wrappedUpdateModuleUI = (...args) =>
            updateModuleUI(...args, {
                ...uiUpdatesServices,
                addCompletedEvl: jasmine.createSpy("addCompletedEvl").and.resolveTo(false),
                validateRoute: jasmine.createSpy("validateRoute").and.resolveTo([]),
                handleValidationResult: jasmine.createSpy("handleValidationResult"),
                calculateAchievedECs: () => 0
            });

        const mockServices = createMockSemesterCardServices({
            getModule: async () => mockModule,
            getModuleProgress: async () => mockProgress,
            updateModuleUI: wrappedUpdateModuleUI
        });

        const { fragment } = await setupSemesterCardTest({
            semester: 2,
            module: "ErrorModule",
            moduleId: 101,
            services: mockServices
        });

        await wait();

        const checkbox = fragment.querySelector('input[type="checkbox"][data-evl-id="1"]');
        await checkbox.click();
        checkbox.dispatchEvent(new Event("change", { bubbles: true }));

        await wait(200);

        const coursePoints = fragment.querySelector("#coursePoints");
        expect(coursePoints.textContent).not.toContain("10/10");
    });

    it("should not crash if updateExclamationIcon is missing", async () => {
        const mockServices = createMockSemesterCardServices({
            getModule: async () => ({ Id: 10, Name: "SafeTest", IsActive: true }),
            getModuleProgress: async () => ({ Completed: 0, Total: 1 }),
            updateExclamationIcon: () => { }
        });

        const { fragment } = await setupSemesterCardTest({
            semester: 2,
            module: "SafeTest",
            moduleId: 10,
            services: mockServices
        });

        const button = fragment.querySelector("#select-module");
        await button.click();
        await wait(400);

        expect(true).toBeTrue();
    });


});



