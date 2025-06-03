import SemesterCard from "../../../components/semester-card.js";

describe('SemesterCard', () => {
    let mockServices;
    let mockOnModuleChange;

    beforeEach(() => {
        mockOnModuleChange = jasmine.createSpy('onModuleChange');
        mockServices = {
            SemesterChoice: jasmine.createSpy('SemesterChoice').and.resolveTo({ Id: 999, Name: 'Module A' }),
            getModule: jasmine.createSpy('getModule').and.resolveTo({ IsActive: true }),
            getModuleProgress: jasmine.createSpy('getModuleProgress').and.resolveTo({ progress: 50 }),
            validateRoute: jasmine.createSpy('validateRoute').and.resolveTo([]),
            updateModuleUI: jasmine.createSpy('updateModuleUI').and.callFake(() => Promise.resolve()),
            updateAllCardsStyling: jasmine.createSpy('updateAllCardsStyling'),
            updateExclamationIcon: jasmine.createSpy('updateExclamationIcon'),
            handleValidationResult: jasmine.createSpy('handleValidationResult'),
            debounce: fn => fn
        };

        window.userData = Promise.resolve({ EffectiveRole: 'Administrator' });
    });

    it('should render a semester card', async () => {
        const params = {
            semester: { Id: 1, Period: 2 },
            module: 'Selecteer je module',
            isActive: true,
            locked: false,
            moduleId: 1001,
            onModuleChange: mockOnModuleChange,
            services: mockServices
        };
        const result = await SemesterCard(params);
        const container = result.querySelector('.semester-card-container');
        expect(container).not.toBeNull();
    });

    it('should render locked icon when locked is true and is active', async () => {
        const params = {
            semester: { Id: 1, Period: 2 },
            module: 'Module A',
            isActive: true,
            locked: true,
            moduleId: 1001,
            onModuleChange: mockOnModuleChange,
            services: mockServices
        };

        const result = await SemesterCard(params);
        const button = result.querySelector('#select-module');
        expect(button.querySelector('i.bi-lock-fill')).not.toBeNull();
    });
});