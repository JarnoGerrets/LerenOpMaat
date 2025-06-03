import SemesterPair from "../../../components/semester-pair.js";

describe('SemesterPair', () => {
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

    it('should create a semester connector', async () => {
        const result = await SemesterPair(null, null, 0, 1);
        const connector = result.querySelector('.semester-connector');
        expect(connector).not.toBeNull();
    });

    it('should create a corner connector when its not the last year', async () => {
        const result = await SemesterPair(null, null, 0, 2);
        const cornerConnector = result.querySelector('.corner-connector');
        expect(cornerConnector).not.toBeNull();
    });

    it('should not create a corner connector when it is the last year', async () => {
        const result = await SemesterPair(null, null, 0, 1);
        const cornerConnector = result.querySelector('.corner-connector');
        expect(cornerConnector).toBeNull();
    });

    it('should add a connector placeholder when it is the last year', async () => {
        const result = await SemesterPair(null, null, 0, 1);
        const connectorPlaceholder = result.querySelector('.connector-placeholder');
        expect(connectorPlaceholder).not.toBeNull();
    });
});