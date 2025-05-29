import { semesterCardServices } from "../../scripts/utils/importServiceProvider.js";

export async function setupSemesterCardTest({
    semester = 1,
    module = "TestModule",
    moduleId = 123,
    isActive = true,
    locked = false,
    services = {},
    onModuleChange = () => {}
}) {
    const SemesterCard = (await import('../../components/semester-card.js')).default;

    const fragment = await SemesterCard({
        semester,
        module,
        moduleId,
        isActive,
        locked,
        onModuleChange,
        services
    });

    return { fragment, SemesterCard };
}

export function createMockSemesterCardServices(overrides = {}) {
    return {
        ...semesterCardServices,
        getModule: async () => ({ Id: 123, Name: "MockModule", IsActive: true }),
        getModuleProgress: async () => ({ Completed: 0, Total: 1 }),
        validateRoute: async () => [],
        SemesterChoice: async () => ({ Name: "Geen Keuze" }),
        updateAllCardsStyling: jasmine.createSpy('updateAllCardsStyling'),
        updateExclamationIcon: jasmine.createSpy('updateExclamationIcon'),
        handleValidationResult: jasmine.createSpy('handleValidationResult'),
        ...overrides
    };
}

