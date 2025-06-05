import * as apiClient from "../../client/api-client.js";
import * as validations from "./semester-card-utils/validations.js";
import * as ui from "./semester-card-utils/ui-updates.js";
import * as cardUtils from "./semester-card-utils/utils.js";
import * as moduleActions from "./module-info-utils/module-actions.js";
import * as evlDropdownUtils from "../utils/evl-dropdown/evl-dropdown-utils.js"
import * as utils from "../utils/universal-utils.js";
import Popup from "../../components/Popup.js";
import SemesterModule from "../../components/SemesterModule.js";
import SemesterChoice from "../../views/partials/semester-choice.js";
import confirmationPopup from "../../views/partials/confirmation-popup.js"
import editRequirementPopup from "../../views/partials/edit-requirement-popup.js"



const baseServices = {
    SemesterChoice,
    ...apiClient,
    ...validations,
    ...ui,
    ...cardUtils,
    ...moduleActions,
    ...evlDropdownUtils,
    ...utils,
    Popup,
    SemesterModule,
    confirmationPopup,
    editRequirementPopup,
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
    debounce: baseServices.debounce,
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

export const validationsServices = Object.freeze({
    updateAllCardsStyling: baseServices.updateAllCardsStyling
});

export const reqCardServices = Object.freeze({
    confirmationPopup: baseServices.confirmationPopup,
    deleteRequirement: baseServices.deleteRequirement,
    editRequirementPopup: baseServices.editRequirementPopup
});

export const initModuleInfoServices = Object.freeze({
    getModule: baseServices.getModule,
    existenceModule: baseServices.existenceModule,
    setupButtons: baseServices.setupButtons,
    reqCardServices
});

export const moduleActionsServices = Object.freeze({
    updateModule: baseServices.updateModule,
    activateModule: baseServices.activateModule,
    deactivateModule: baseServices.deactivateModule,
    deleteModule: baseServices.deleteModule,
    setupListeners: baseServices.setupListeners,
    getSelectedEVLs: baseServices.getSelectedEVLs,
    updateEvlSelectionHeader: baseServices.updateEvlSelectionHeader,
    confirmationPopup: baseServices.confirmationPopup,
    mapPeriodToPresentableString: baseServices.mapPeriodToPresentableString
});

export const reportServices = Object.freeze({
    getProfiles: baseServices.getProfiles,
    getModulesEngagement: baseServices.getModulesEngagement,
    getAvailableYears:  baseServices.getAvailableYears,
    Chart: window.Chart
});

