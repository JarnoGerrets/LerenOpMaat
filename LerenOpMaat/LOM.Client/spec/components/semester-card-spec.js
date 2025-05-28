describe("SemesterCard", () => {
    console.log("hoi");
    it("should render a semester card", async () => {
        const SemesterCard = (await import('../../components/semester-card.js')).default;
        const { dummySemester1 } = await import('../../components/dummyData2.js');

        const fragment = await SemesterCard({
            semester: dummySemester1.Period,
            module: dummySemester1.Module.Name,
            moduleId: dummySemester1.ModuleId,
            isActive: dummySemester1.Module.IsActive,
            locked: false,
            onModuleChange: () => { },
        });


        expect(fragment instanceof DocumentFragment).toBeTrue();

        const card = fragment.querySelector(".semester-card");
        expect(card).not.toBeNull();
    });


    it("should display the module name in the button", async () => {
        const SemesterCard = (await import('../../components/semester-card.js')).default;
        const { dummySemester1 } = await import('../../components/dummyData2.js');

        const fragment = await SemesterCard({
            semester: dummySemester1.Period,
            module: dummySemester1.Module.Name,
            moduleId: dummySemester1.ModuleId,
            isActive: dummySemester1.Module.IsActive,
            locked: false,
            onModuleChange: () => { },
        });

        const button = fragment.querySelector("#select-module");
        expect(button.textContent).toContain(dummySemester1.Module.Name);
    });

    it("should add 'locked' class and lock icon when locked", async () => {
        const SemesterCard = (await import('../../components/semester-card.js')).default;
        const { dummySemester1 } = await import('../../components/dummyData2.js');

        const fragment = await SemesterCard({
            semester: dummySemester1.Period,
            module: dummySemester1.Module.Name,
            moduleId: dummySemester1.ModuleId,
            isActive: dummySemester1.Module.IsActive,
            locked: true,
            onModuleChange: () => { },
        });

        const button = fragment.querySelector("#select-module");
        expect(button.classList.contains("locked")).toBeTrue();
        const icon = button.querySelector("i");
        expect(icon.classList.contains("bi-lock-fill")).toBeTrue();
    });

    it("should show the inactive label if the module is inactive", async () => {
        const SemesterCard = (await import('../../components/semester-card.js')).default;

        const fragment = await SemesterCard({
            semester: 1,
            module: "MockModule",
            moduleId: 123,
            isActive: true,
            locked: false,
            onModuleChange: () => { },
            dependencies: {
                getModule: async () => ({ Id: 123, Name: "MockModule", IsActive: false }),
                getModuleProgress: async () => ({ Completed: 0, Total: 1 }),
            }
        });

        const label = fragment.querySelector(".inactive-label-tag");

        await new Promise(res => setTimeout(res, 0));

        expect(label.classList.contains("hidden")).toBeFalse();
    });

    it("should call onModuleChange when a new module is selected", async () => {
        const SemesterCard = (await import('../../components/semester-card.js')).default;

        let calledWith = null;

        const mockSelectModule = async () => ({
            Id: 999,
            Name: "Mocked",
            IsActive: true,
        });

        const mockProgress = async () => ({ Completed: 0, Total: 1 });

        const fragment = await SemesterCard({
            semester: 1,
            module: "Mocked",
            moduleId: 123,
            isActive: true,
            locked: false,
            onModuleChange: (data) => { calledWith = data; },
            dependencies: {
                SemesterChoice: mockSelectModule,
                getModule: mockSelectModule,
                getModuleProgress: mockProgress,
            }
        });

        const button = fragment.querySelector("#select-module");
        button.click();

        await new Promise(res => setTimeout(res, 1000));

        expect(calledWith).not.toBeNull();
        expect(calledWith.semester).toBe(1);
        expect(calledWith.moduleId).toBe(999);
    });

    it("should set data-module-id correctly", async () => {
        const SemesterCard = (await import('../../components/semester-card.js')).default;

        const fragment = await SemesterCard({
            semester: 2,
            module: "TestModule",
            moduleId: 555,
            isActive: true,
            locked: false,
            onModuleChange: () => { },
            dependencies: {
                getModule: async () => ({ Id: 555, Name: "TestModule", IsActive: true }),
                getModuleProgress: async () => ({ Completed: 0, Total: 1 }),
            }
        });

        const card = fragment.querySelector(".semester-card");
        expect(card.getAttribute("data-module-id")).toBe("555");
    });

    it("should turn button text red if module is inactive", async () => {
        const SemesterCard = (await import('../../components/semester-card.js')).default;

        const fragment = await SemesterCard({
            semester: 1,
            module: "TestInactive",
            moduleId: 444,
            isActive: true,
            locked: false,
            onModuleChange: () => { },
            dependencies: {
                getModule: async () => ({ Id: 444, Name: "TestInactive", IsActive: false }),
                getModuleProgress: async () => ({ Completed: 0, Total: 1 }),
            }
        });

        const button = fragment.querySelector("#select-module");
        await new Promise(res => setTimeout(res, 0));

        expect(button.style.color).toBe("red");
    });


});