import * as apiClient from "../../client/api-client.js";
import * as validations from "./semester-card-utils/validations.js";
import * as ui from "./semester-card-utils/ui-updates.js";
import * as utils from "./semester-card-utils/utils.js";
import Popup from "../../components/Popup.js"
import SemesterModule from "../../components/SemesterModule.js"
import SemesterChoice from "../../views/partials/semester-choice.js";

const baseServices = {
    SemesterChoice,
    ...apiClient,
    ...validations,
    ...ui,
    ...utils,
    Popup,
    SemesterModule

};

export const semesterCardServices = Object.freeze({
    SemesterChoice: baseServices.SemesterChoice,
    getModule: baseServices.getModule,
    getModuleProgress: baseServices.getModuleProgress,
    validateRoute: baseServices.validateRoute,
    handleValidationResult: baseServices.handleValidationResult,
    updateModuleUI: baseServices.updateModuleUI,
    updateAllCardsStyling: baseServices.updateAllCardsStyling,
    updateExclamationIcon: baseServices.updateExclamationIcon,
    debounce: baseServices.debounce
});

export const uiUpdatesServices = Object.freeze({
    calculateAchievedECs: baseServices.calculateAchievedECs,
    handleValidationResult: baseServices.handleValidationResult,
    validateRoute: baseServices.validateRoute,
    addCompletedEvl: baseServices.addCompletedEvl,
    removeCompletedEvl: baseServices.removeCompletedEvl
});

export const semesterChoiceServices = Object.freeze({
    Popup: baseServices.Popup,
    SemesterModule: baseServices.SemesterModule,
    getModules: baseServices.getModules
});
