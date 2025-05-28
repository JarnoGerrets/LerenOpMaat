import { semesterCardServices } from "../../scripts/utils/importServiceProvider.js";

describe("SemesterCard", () => {
    // it("should render a semester card", async () => {
    //     const SemesterCard = (await import('../../components/semester-card.js')).default;
    //     const { dummySemester1 } = await import('../../components/dummyData2.js');

    //     const fragment = await SemesterCard({
    //         semester: dummySemester1.Period,
    //         module: dummySemester1.Module.Name,
    //         moduleId: dummySemester1.ModuleId,
    //         isActive: dummySemester1.Module.IsActive,
    //         locked: false,
    //         onModuleChange: () => { },
    //     });


    //     expect(fragment instanceof DocumentFragment).toBeTrue();

    //     const card = fragment.querySelector(".semester-card");
    //     expect(card).not.toBeNull();
    // });


    // it("should display the module name in the button", async () => {
    //     const SemesterCard = (await import('../../components/semester-card.js')).default;
    //     const { dummySemester1 } = await import('../../components/dummyData2.js');

    //     const fragment = await SemesterCard({
    //         semester: dummySemester1.Period,
    //         module: dummySemester1.Module.Name,
    //         moduleId: dummySemester1.ModuleId,
    //         isActive: dummySemester1.Module.IsActive,
    //         locked: false,
    //         onModuleChange: () => { },
    //     });

    //     const button = fragment.querySelector("#select-module");
    //     expect(button.textContent).toContain(dummySemester1.Module.Name);
    // });

    // it("should add 'locked' class and lock icon when locked", async () => {
    //     const SemesterCard = (await import('../../components/semester-card.js')).default;
    //     const { dummySemester1 } = await import('../../components/dummyData2.js');

    //     const fragment = await SemesterCard({
    //         semester: dummySemester1.Period,
    //         module: dummySemester1.Module.Name,
    //         moduleId: dummySemester1.ModuleId,
    //         isActive: dummySemester1.Module.IsActive,
    //         locked: true,
    //         onModuleChange: () => { },
    //     });

    //     const button = fragment.querySelector("#select-module");
    //     expect(button.classList.contains("locked")).toBeTrue();
    //     const icon = button.querySelector("i");
    //     expect(icon.classList.contains("bi-lock-fill")).toBeTrue();
    // });

    // it("should show the inactive label if the module is inactive", async () => {
    //     const SemesterCard = (await import('../../components/semester-card.js')).default;

    //     const fragment = await SemesterCard({
    //         semester: 1,
    //         module: "MockModule",
    //         moduleId: 123,
    //         isActive: true,
    //         locked: false,
    //         onModuleChange: () => { },
    //         dependencies: {
    //             getModule: async () => ({ Id: 123, Name: "MockModule", IsActive: false }),
    //             getModuleProgress: async () => ({ Completed: 0, Total: 1 }),
    //         }
    //     });

    //     const label = fragment.querySelector(".inactive-label-tag");

    //     await new Promise(res => setTimeout(res, 0));

    //     expect(label.classList.contains("hidden")).toBeFalse();
    // });

    // it("should call onModuleChange when a new module is selected", async () => {
    //     const SemesterCard = (await import('../../components/semester-card.js')).default;

    //     let calledWith = null;

    //     const mockSelectModule = async () => ({
    //         Id: 999,
    //         Name: "Mocked",
    //         IsActive: true,
    //     });

    //     const mockProgress = async () => ({ Completed: 0, Total: 1 });

    //     const fragment = await SemesterCard({
    //         semester: 1,
    //         module: "Mocked",
    //         moduleId: 123,
    //         isActive: true,
    //         locked: false,
    //         onModuleChange: (data) => { calledWith = data; },
    //         dependencies: {
    //             SemesterChoice: mockSelectModule,
    //             getModule: mockSelectModule,
    //             getModuleProgress: mockProgress,
    //         }
    //     });

    //     const button = fragment.querySelector("#select-module");
    //     button.click();

    //     await new Promise(res => setTimeout(res, 1000));

    //     expect(calledWith).not.toBeNull();
    //     expect(calledWith.semester).toBe(1);
    //     expect(calledWith.moduleId).toBe(999);
    // });

    // it("should set data-module-id correctly", async () => {
    //     const SemesterCard = (await import('../../components/semester-card.js')).default;

    //     const fragment = await SemesterCard({
    //         semester: 2,
    //         module: "TestModule",
    //         moduleId: 555,
    //         isActive: true,
    //         locked: false,
    //         onModuleChange: () => { },
    //         dependencies: {
    //             getModule: async () => ({ Id: 555, Name: "TestModule", IsActive: true }),
    //             getModuleProgress: async () => ({ Completed: 0, Total: 1 }),
    //         }
    //     });

    //     const card = fragment.querySelector(".semester-card");
    //     expect(card.getAttribute("data-module-id")).toBe("555");
    // });

    // it("should turn button text red if module is inactive", async () => {
    //     const SemesterCard = (await import('../../components/semester-card.js')).default;

    //     const fragment = await SemesterCard({
    //         semester: 1,
    //         module: "TestInactive",
    //         moduleId: 444,
    //         isActive: true,
    //         locked: false,
    //         onModuleChange: () => { },
    //         dependencies: {
    //             getModule: async () => ({ Id: 444, Name: "TestInactive", IsActive: false }),
    //             getModuleProgress: async () => ({ Completed: 0, Total: 1 }),
    //         }
    //     });

    //     const button = fragment.querySelector("#select-module");
    //     await new Promise(res => setTimeout(res, 0));

    //     expect(button.style.color).toBe("red");
    // });

    // it("should clear selection when 'Geen Keuze' is selected", async () => {
    //     const mockServices = {
    //         ...semesterCardServices,
    //         getModule: async () => ({ Id: 123, Name: "ModuleX", IsActive: true }),
    //         getModuleProgress: async () => ({ Completed: 0, Total: 1 }),
    //         SemesterChoice: async () => ({ Id: null, Name: "Geen Keuze", IsActive: true }),
    //         validateRoute: async () => [],
    //         updateAllCardsStyling: jasmine.createSpy('updateAllCardsStyling')
    //     };

    //     const SemesterCard = (await import('../../components/semester-card.js')).default;
    //     const evlService = (await import('../../scripts/utils/semester-card-utils/evl-service.js')).default;

    //     let calledWith = null;

    //     const mockSelectModule = async () => ({
    //         Id: null,
    //         Name: "Geen Keuze",
    //         IsActive: true,
    //     });

    //     spyOn(evlService, 'validateRoute').and.resolveTo([]);

    //     const fragment = await SemesterCard({
    //         semester: 2,
    //         module: "ModuleX",
    //         moduleId: 123,
    //         isActive: true,
    //         locked: false,
    //         onModuleChange: (data) => { calledWith = data; },
    //         dependencies: {
    //             SemesterChoice: mockSelectModule,
    //             getModule: async () => ({ Id: 123, Name: "ModuleX", IsActive: true }),
    //             getModuleProgress: async () => ({ Completed: 0, Total: 1 }),
    //         }
    //     });

    //     const button = fragment.querySelector("#select-module");
    //     button.click();

    //     await new Promise(res => setTimeout(res, 1000));

    //     expect(calledWith).toEqual({ semester: 2, moduleId: null });
    // });

    it("should clear selection when 'Geen Keuze' is selected", async () => {
        const mockServices = {
            ...semesterCardServices,
            getModule: async () => ({ Id: 123, Name: "ModuleX", IsActive: true }),
            getModuleProgress: async () => ({ Completed: 0, Total: 1 }),
            SemesterChoice: async () => ({ Id: null, Name: "Geen Keuze", IsActive: true }),
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
        const evlService = (await import('../../scripts/utils/semester-card-utils/evl-service.js')).default;

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
            CompletedEvls: [
                { ModuleEvl: { Id: 1 } }
            ]
        };

        spyOn(localStorage, 'getItem').and.returnValue("mockUser");

        const mockCardServices = {
            ...semesterCardServices,
            getModule: async () => (mockModule),
            getModuleProgress: async () => ({ Completed: 0, Total: 1 }),
            SemesterChoice: async () => ({ Name: "Geen Keuze" }),
            validateRoute: async () => [],
            addCompletedEvl: async() => (mockUpdatedProgress),
            validateRoute: async() => []
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

});



