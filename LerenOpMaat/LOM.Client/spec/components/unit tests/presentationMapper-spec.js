import { mapPeriodToPresentableString } from '../../../scripts/utils/universal-utils.js';

describe('PresentationMapper', () => {
    describe('mapPeriodToPresentableString', () => {
        it('returns "Beide" when period is number 3', () => {
            expect(mapPeriodToPresentableString(3)).toBe('Beide');
        });

        it('returns "Beide" when period is string "3"', () => {
            expect(mapPeriodToPresentableString('3')).toBe('Beide');
        });

        it('returns number string for other numeric values', () => {
            expect(mapPeriodToPresentableString(1)).toBe('1');
            expect(mapPeriodToPresentableString(2)).toBe('2');
        });

        it('returns input as string when input is a string not equal to "3"', () => {
            expect(mapPeriodToPresentableString('1')).toBe('1');
            expect(mapPeriodToPresentableString('2')).toBe('2');
        });

        it('returns "undefined" when input is undefined', () => {
            expect(mapPeriodToPresentableString(undefined)).toBe('undefined');
        });
    });
});