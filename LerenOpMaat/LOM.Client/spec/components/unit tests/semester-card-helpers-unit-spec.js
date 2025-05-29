import { calculateAchievedECs } from "../../../scripts/utils/semester-card-utils/utils.js";
import * as uiUpdates from "../../../scripts/utils/semester-card-utils/ui-updates.js";
import { handleValidationResult } from "../../../scripts/utils/semester-card-utils/validations.js";


describe("Semester-card helpers unit", () => {

    describe("calculateAchievedECs", () => {
        it("should return 0 if no progress or evls", () => {
            expect(calculateAchievedECs(null, null)).toBe(0);
        });

        it("should sum matching EVL ECs", () => {
            const result = calculateAchievedECs(
                { CompletedEvls: [{ ModuleEvl: { Id: 1 } }] },
                { Evls: [{ Id: 1, Ec: 12 }] }
            );
            expect(result).toBe(12);
        });

        it("should default EC to 10 if not present", () => {
            const result = calculateAchievedECs(
                { CompletedEvls: [{ ModuleEvl: { Id: 1 } }] },
                { Evls: [{ Id: 1 }] }
            );
            expect(result).toBe(10);
        });
    });

    describe("handleValidationResult", () => {
        let showToastSpy;

        afterEach(() => {
            delete window.showToast;
        });
        beforeEach(() => {
            window.validationState = {};
            window.moduleMessagesMap = {};
            showToastSpy = jasmine.createSpy("showToast");
            window.showToast = showToastSpy;
        });
        it("should show message by invalid validation result", () => {
            const updateAllCardsStylingSpy = jasmine.createSpy("updateAllCardsStyling");

            const mockServices = {
                updateAllCardsStyling: updateAllCardsStylingSpy
            };

            handleValidationResult([
                { ViolatingModuleId: 101, Message: "30 EC is nodig", IsValid: false }
            ], mockServices);

            expect(showToast).toHaveBeenCalledWith("30 EC is nodig", "error");
            expect(updateAllCardsStylingSpy).toHaveBeenCalledWith({
                101: ["- 30 EC is nodig"]
            });
        });
    });


});