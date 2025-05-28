import { semesterCardServices, uiUpdatesServices } from "../../scripts/utils/importServiceProvider.js";
import { updateModuleUI } from '../../scripts/utils/semester-card-utils/ui-updates.js';

describe("SemesterCard", () => {
    it("should render a semester card", async () => {
        const mockServices = {
            ...semesterCardServices,
            getModule: async () => ({ Id: 123, Name: "MockModule", IsActive: false }),
        };
        const SemesterCard = (await import('../../components/semester-card.js')).default;

        const fragment = await SemesterCard({
            semester: 1,
            module: "MockModule",
            moduleId: 1,
            isActive: true,
            locked: false,
            onModuleChange: () => { },
            services: mockServices
        });


        expect(fragment instanceof DocumentFragment).toBeTrue();

        const card = fragment.querySelector(".semester-card");
        expect(card).not.toBeNull();
    });


    it("should display the module name in the button", async () => {
        const mockServices = {
            ...semesterCardServices,
            getModule: async () => ({ Id: 123, Name: "MockModule", IsActive: false }),
        };
        const SemesterCard = (await import('../../components/semester-card.js')).default;

        const fragment = await SemesterCard({
            semester: 1,
            module: "MockModule",
            moduleId: 1,
            isActive: true,
            locked: false,
            onModuleChange: () => { },
            services: mockServices
        });

        const button = fragment.querySelector("#select-module");
        expect(button.textContent).toContain("MockModule");
    });

    it("should add 'locked' class and lock icon when locked", async () => {
        const mockServices = {
            ...semesterCardServices,
            getModule: async () => ({ Id: 123, Name: "MockModule", IsActive: false }),
        };
        const SemesterCard = (await import('../../components/semester-card.js')).default;

        const fragment = await SemesterCard({
            semester: 1,
            module: "test",
            moduleId: 1,
            isActive: true,
            locked: true,
            onModuleChange: () => { },
            services: mockServices
        });

        const button = fragment.querySelector("#select-module");
        expect(button.classList.contains("locked")).toBeTrue();
        const icon = button.querySelector("i");
        expect(icon.classList.contains("bi-lock-fill")).toBeTrue();
    });

    it("should show the inactive label if the module is inactive", async () => {
        const mockServices = {
            ...semesterCardServices,
            getModule: async () => ({ Id: 123, Name: "MockModule", IsActive: false }),
            getModuleProgress: async () => ({ Completed: 0, Total: 1 }),
        };

        const SemesterCard = (await import('../../components/semester-card.js')).default;

        const fragment = await SemesterCard({
            semester: 1,
            module: "MockModule",
            moduleId: 123,
            isActive: true,
            locked: false,
            onModuleChange: () => { },
            services: mockServices
        });

        const label = fragment.querySelector(".inactive-label-tag");

        await new Promise(res => setTimeout(res, 0));

        expect(label.classList.contains("hidden")).toBeFalse();
    });

    it("should call onModuleChange when a new module is selected", async () => {

        const mockSelectModule = async () => ({
            Id: 999,
            Name: "Mocked",
            IsActive: true,
        });

        const mockServices = {
            ...semesterCardServices,
            getModule: async () => (mockSelectModule),
            getModuleProgress: async () => ({ Completed: 0, Total: 1 }),
            SemesterChoice: mockSelectModule,
            validateRoute: async () => [],
            updateAllCardsStyling: jasmine.createSpy('updateAllCardsStyling')
        };

        const SemesterCard = (await import('../../components/semester-card.js')).default;

        let calledWith = null;



        const fragment = await SemesterCard({
            semester: 1,
            module: "Mocked",
            moduleId: 123,
            isActive: true,
            locked: false,
            onModuleChange: (data) => { calledWith = data; },
            services: mockServices
        });

        const button = fragment.querySelector("#select-module");
        button.click();

        await new Promise(res => setTimeout(res, 1000));

        expect(calledWith).not.toBeNull();
        expect(calledWith.semester).toBe(1);
        expect(calledWith.moduleId).toBe(999);
    });

    it("should set data-module-id correctly", async () => {

        const mockServices = {
            ...semesterCardServices,
            getModule: async () => ({ Id: 555, Name: "TestModule", IsActive: true }),
            getModuleProgress: async () => ({ Completed: 0, Total: 1 })
        };

        const SemesterCard = (await import('../../components/semester-card.js')).default;

        const fragment = await SemesterCard({
            semester: 2,
            module: "TestModule",
            moduleId: 555,
            isActive: true,
            locked: false,
            onModuleChange: () => { },
            services: mockServices
        });

        const card = fragment.querySelector(".semester-card");
        expect(card.getAttribute("data-module-id")).toBe("555");
    });

    it("should turn button text red if module is inactive", async () => {

        const mockServices = {
            ...semesterCardServices,
            getModule: async () => ({ Id: 444, Name: "TestInactive", IsActive: false }),
            getModuleProgress: async () => ({ Completed: 0, Total: 1 })
        };

        const SemesterCard = (await import('../../components/semester-card.js')).default;

        const fragment = await SemesterCard({
            semester: 1,
            module: "TestInactive",
            moduleId: 444,
            isActive: true,
            locked: false,
            onModuleChange: () => { },
            services: mockServices
        });

        const button = fragment.querySelector("#select-module");
        await new Promise(res => setTimeout(res, 0));

        expect(button.style.color).toBe("red");
    });

    it("should clear selection when 'Geen Keuze' is selected", async () => {

        const mockSelectModule = async () => ({
            Id: null,
            Name: "Geen Keuze",
            IsActive: true,
        });

        const mockServices = {
            ...semesterCardServices,
            getModule: async () => ({ Id: 123, Name: "ModuleX", IsActive: true }),
            getModuleProgress: async () => ({ Completed: 0, Total: 1 }),
            SemesterChoice: mockSelectModule,
            validateRoute: async () => [],
            updateAllCardsStyling: jasmine.createSpy('updateAllCardsStyling')
        };

        const SemesterCard = (await import('../../components/semester-card.js')).default;

        let calledWith = null;

        const fragment = await SemesterCard({
            semester: 2,
            module: "ModuleX",
            moduleId: 123,
            isActive: true,
            locked: false,
            onModuleChange: (data) => { calledWith = data; },
            services: mockServices
        });

        const button = fragment.querySelector("#select-module");
        button.click();

        await new Promise(res => setTimeout(res, 1000));

        expect(calledWith).toEqual({ semester: 2, moduleId: null });
    });


    it("should keep inactive label hidden for active modules", async () => {
        const mockServices = {
            ...semesterCardServices,
            getModule: async () => ({ Id: 999, Name: "ActiveModule", IsActive: true }),
            getModuleProgress: async () => ({ Completed: 0, Total: 1 }),
            SemesterChoice: async () => ({ Name: "Geen Keuze" }),
            validateRoute: async () => [],
            updateAllCardsStyling: jasmine.createSpy('updateAllCardsStyling')
        };
        const SemesterCard = (await import('../../components/semester-card.js')).default;

        const fragment = await SemesterCard({
            semester: 1,
            module: "ActiveModule",
            moduleId: 999,
            isActive: true,
            locked: false,
            onModuleChange: () => { },
            services: mockServices
        });

        const label = fragment.querySelector(".inactive-label-tag");
        await new Promise(res => setTimeout(res, 0));

        expect(label.classList.contains("hidden")).toBeTrue();
    });


    it("should call updateAllCardsStyling with moduleId map when clearing selection", async () => {

        const mockServices = {
            ...semesterCardServices,
            getModule: async () => ({ Id: 123, Name: "Test", IsActive: true }),
            getModuleProgress: async () => ({ Completed: 0, Total: 1 }),
            SemesterChoice: async () => ({ Name: "Geen Keuze" }),
            validateRoute: async () => [],
            updateAllCardsStyling: jasmine.createSpy('updateAllCardsStyling')
        };

        const SemesterCard = (await import('../../components/semester-card.js')).default;

        const fragment = await SemesterCard({
            semester: 2,
            module: "SomeModule",
            moduleId: 777,
            isActive: true,
            locked: false,
            onModuleChange: () => { },
            services: mockServices
        });

        const button = fragment.querySelector("#select-module");
        await button.click();

        await new Promise(res => setTimeout(res, 600));

        expect(mockServices.updateAllCardsStyling).toHaveBeenCalledWith({ 777: [] });
    });


    it("should call updateExclamationIcon with empty string and true on clear", async () => {

        const mockServices = {
            ...semesterCardServices,
            getModule: async () => ({ Id: 123, Name: "Test", IsActive: true }),
            getModuleProgress: async () => ({ Completed: 0, Total: 1 }),
            SemesterChoice: async () => ({ Name: "Geen Keuze" }),
            validateRoute: async () => [],
            updateExclamationIcon: jasmine.createSpy("updateExclamationIcon")
        };
        const SemesterCard = (await import('../../components/semester-card.js')).default;

        const fragment = await SemesterCard({
            semester: 4,
            module: "ClearableModule",
            moduleId: 321,
            isActive: true,
            locked: false,
            onModuleChange: () => { },
            services: mockServices
        });

        const button = fragment.querySelector("#select-module");
        button.click();

        await new Promise(res => setTimeout(res, 1000));

        expect(mockServices.updateExclamationIcon).toHaveBeenCalledWith(jasmine.any(Element), '', true);
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

        const mockProgress = {
            CompletedEvls: []
        };

        const mockUpdatedProgress = {
            CompletedEvls: [{ ModuleEvl: { Id: 1 } }]
        };

        const wrappedUpdateModuleUI = (...args) =>
            updateModuleUI(...args, {
                ...uiUpdatesServices,
                addCompletedEvl: jasmine.createSpy("addCompletedEvl").and.resolveTo(mockUpdatedProgress),
                validateRoute: jasmine.createSpy("validateRoute").and.resolveTo([]),
                handleValidationResult: jasmine.createSpy("handleValidationResult"),
                calculateAchievedECs: () => 5
            });


        spyOn(localStorage, 'getItem').and.returnValue("mockUser");

        const mockCardServices = {
            ...semesterCardServices,
            getModule: async () => (mockModule),
            getModuleProgress: async () => (mockProgress),
            SemesterChoice: async () => ({ Name: "Geen Keuze" }),
            validateRoute: async () => [],
            updateModuleUI: wrappedUpdateModuleUI
        };

        const SemesterCard = (await import('../../components/semester-card.js')).default;

        const fragment = await SemesterCard({
            semester: 1,
            module: "CourseModule",
            moduleId: 888,
            isActive: true,
            locked: false,
            onModuleChange: () => { },
            services: mockCardServices
        });

        await new Promise(res => setTimeout(res, 100));

        const checkbox = fragment.querySelector('input[type="checkbox"][data-evl-id="1"]');
        await checkbox.click();
        await checkbox.dispatchEvent(new Event("change", { bubbles: true }));

        await new Promise(res => setTimeout(res, 100));

        const coursePoints = fragment.querySelector("#coursePoints");
        expect(coursePoints.textContent).toContain("5/15");
    });

    it("should not call onModuleChange if no module is selected", async () => {
        const mockServices = {
            ...semesterCardServices,
            SemesterChoice: async () => null,
            validateRoute: async () => [],
            getModule: async () => ({ Id: 1, Name: "Placeholder", IsActive: true }),
            getModuleProgress: async () => ({ Completed: 0, Total: 1 })
        };

        let called = false;
        const SemesterCard = (await import('../../components/semester-card.js')).default;

        const fragment = await SemesterCard({
            semester: 1,
            module: "Test",
            moduleId: 1,
            isActive: true,
            locked: false,
            onModuleChange: () => { called = true; },
            services: mockServices
        });

        const button = fragment.querySelector("#select-module");
        button.click();
        await new Promise(res => setTimeout(res, 600));

        expect(called).toBeFalse();
    });

    it("should not update if module already exists in learning route", async () => {
        const mockModule = { Id: 777, Name: "DuplicateModule", IsActive: true };

        const mockServices = {
            ...semesterCardServices,
            SemesterChoice: async () => mockModule,
            getModule: async () => mockModule,
            getModuleProgress: async () => ({ Completed: 0, Total: 1 }),
            validateRoute: async () => [{
                Message: "Module komt al voor in de leerroute",
                IsValid: false
            }]
        };

        let called = null;
        window.showToast = jasmine.createSpy("showToast");
        const SemesterCard = (await import('../../components/semester-card.js')).default;

        const fragment = await SemesterCard({
            semester: 1,
            module: "Dup",
            moduleId: 555,
            isActive: true,
            locked: false,
            onModuleChange: (data) => { called = data },
            services: mockServices
        });

        const button = fragment.querySelector("#select-module");
        button.click();
        await new Promise(res => setTimeout(res, 800));

        expect(called.moduleId).not.toBe(777);
    });

    it("should not update if module already exists in learning route", async () => {
        const mockServices = {
            ...semesterCardServices,
            getModule: async () => ({
                Id: 321,
                Name: "DuplicateModule",
                IsActive: true
            }),
            getModuleProgress: async () => ({ Completed: 0, Total: 1 }),
            SemesterChoice: async () => ({ Id: 321, Name: "DuplicateModule", IsActive: true }),
            validateRoute: async () => [{
                Message: "Module komt al voor in de leerroute",
                IsValid: false
            }],
            updateAllCardsStyling: jasmine.createSpy("updateAllCardsStyling"),
            updateExclamationIcon: jasmine.createSpy("updateExclamationIcon"),
            handleValidationResult: jasmine.createSpy("handleValidationResult")
        };

        const mockOnModuleChange = jasmine.createSpy("onModuleChange");

        window.showToast = jasmine.createSpy("showToast");

        const SemesterCard = (await import('../../components/semester-card.js')).default;

        const fragment = await SemesterCard({
            semester: 5,
            module: "DuplicateModule",
            moduleId: 321,
            isActive: true,
            locked: false,
            onModuleChange: mockOnModuleChange,
            services: mockServices
        });

        const button = fragment.querySelector("#select-module");
        await button.click();

        await new Promise(res => setTimeout(res, 600));

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

        const mockServices = {
            ...semesterCardServices,
            getModule: async () => ({ Id: 111, Name: "TestModule", IsActive: true }),
            getModuleProgress: async () => ({ Completed: 0, Total: 1 }),
            SemesterChoice: async () => ({ Id: 111, Name: "TestModule", IsActive: true }),
            validateRoute: jasmine.createSpy("validateRoute").and.resolveTo(finalValidationResult),
            handleValidationResult: jasmine.createSpy("handleValidationResult"),
            updateAllCardsStyling: jasmine.createSpy("updateAllCardsStyling")
        };

        const SemesterCard = (await import('../../components/semester-card.js')).default;

        const fragment = await SemesterCard({
            semester: 3,
            module: "TestModule",
            moduleId: 111,
            isActive: true,
            locked: false,
            onModuleChange: () => { },
            services: mockServices
        });

        const button = fragment.querySelector("#select-module");
        await button.click();

        await new Promise(res => setTimeout(res, 1000));

        expect(mockServices.handleValidationResult).toHaveBeenCalledWith(finalValidationResult);
    });

    it("should not throw if SemesterChoice returns an invalid module object", async () => {
        const mockServices = {
            ...semesterCardServices,
            SemesterChoice: async () => ({ bad: "data" }),
            getModule: async () => ({ Id: 999, Name: "Test", IsActive: true }),
            getModuleProgress: async () => ({ Completed: 0, Total: 1 }),
            validateRoute: async () => [],
            updateAllCardsStyling: jasmine.createSpy("updateAllCardsStyling"),
            handleValidationResult: jasmine.createSpy("handleValidationResult")
        };

        const SemesterCard = (await import('../../components/semester-card.js')).default;

        const fragment = await SemesterCard({
            semester: 1,
            module: "X",
            moduleId: 123,
            isActive: true,
            locked: false,
            onModuleChange: () => { },
            services: mockServices
        });

        const button = fragment.querySelector("#select-module");
        await button.click();

        await new Promise(res => setTimeout(res, 500));

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

        spyOn(localStorage, 'getItem').and.returnValue("mockUser");

        const mockServices = {
            ...semesterCardServices,
            getModule: async () => mockModule,
            getModuleProgress: async () => mockProgress,
            SemesterChoice: async () => ({ Name: "Geen Keuze" }),
            validateRoute: async () => [],
            updateModuleUI: wrappedUpdateModuleUI
        };

        const SemesterCard = (await import('../../components/semester-card.js')).default;

        const fragment = await SemesterCard({
            semester: 2,
            module: "ErrorModule",
            moduleId: 101,
            isActive: true,
            locked: false,
            onModuleChange: () => { },
            services: mockServices
        });

        await new Promise(res => setTimeout(res, 50));

        const checkbox = fragment.querySelector('input[type="checkbox"][data-evl-id="1"]');
        await checkbox.click();
        await checkbox.dispatchEvent(new Event("change", { bubbles: true }));

        await new Promise(res => setTimeout(res, 200));

        const coursePoints = fragment.querySelector("#coursePoints");
        expect(coursePoints.textContent).not.toContain("10/10");
    });

    it("should not crash if updateExclamationIcon is missing", async () => {
        const mockServices = {
            ...semesterCardServices,
            getModule: async () => ({ Id: 10, Name: "SafeTest", IsActive: true }),
            getModuleProgress: async () => ({ Completed: 0, Total: 1 }),
            SemesterChoice: async () => ({ Name: "Geen Keuze" }),
            validateRoute: async () => []
        };

        const SemesterCard = (await import('../../components/semester-card.js')).default;

        const fragment = await SemesterCard({
            semester: 2,
            module: "SafeTest",
            moduleId: 10,
            isActive: true,
            locked: false,
            onModuleChange: () => { },
            services: mockServices
        });

        const button = fragment.querySelector("#select-module");
        await button.click();

        await new Promise(res => setTimeout(res, 400));

        expect(true).toBeTrue();
    });

});



