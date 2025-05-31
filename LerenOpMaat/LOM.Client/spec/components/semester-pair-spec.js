import { JSDOM } from 'jsdom';
import SemesterPair from "../../components/semester-pair.js";

// Set up a DOM environment for testing
// This is necessary because the code being tested relies on DOM APIs
const dom = new JSDOM(`<!DOCTYPE html><body></body>`);
global.window = dom.window;
global.document = dom.window.document;
global.customElements = dom.window.customElements;
global.HTMLElement = dom.window.HTMLElement;
global.localStorage = {
    getItem: jasmine.createSpy('getItem'),
    setItem: jasmine.createSpy('setItem'),
    removeItem: jasmine.createSpy('removeItem'),
    clear: jasmine.createSpy('clear')
};

describe('SemesterPair', () => {
    let originalSemesterCard;

    beforeAll(() => {
        originalSemesterCard = window.SemesterCard;
        window.SemesterCard = jasmine.createSpy('SemesterCard').and.callFake(async ({ semester, module, locked }) => {
            const card = document.createElement('div');
            card.classList.add('mock-semester-card');
            card.dataset.semester = semester;
            card.dataset.module = module;
            card.dataset.locked = locked;
            return card;
        });
    });

    afterAll(() => {
        window.SemesterCard = originalSemesterCard;
    });

    it('should create a wrapper with class semester-pair', async () => {
        const result = await SemesterPair(null, null, 0, 1);
        expect(result.classList.contains('semester-pair')).toBeTrue();
    });

    it('should add reverse class when index is odd', async () => {
        const result = await SemesterPair(null, null, 1, 1);
        expect(result.classList.contains('reverse')).toBeTrue();
    });

    it('should not add reverse class when index is even', async () => {
        const result = await SemesterPair(null, null, 0, 1);
        expect(result.classList.contains('reverse')).toBeFalse();
    });
});