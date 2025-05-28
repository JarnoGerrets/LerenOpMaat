
import SemesterChoice from "../../../views/partials/semester-choice.js";
import { getModule, getModuleProgress, validateRoute } from "../../../client/api-client.js";
import { handleValidationResult } from "./validations.js";
import { updateModuleUI, updateAllCardsStyling, updateExclamationIcon } from "./ui-updates.js";
import { debounce } from "./utils.js";

export const defaultServices = Object.freeze({
  SemesterChoice,
  getModule,
  getModuleProgress,
  validateRoute,
  handleValidationResult,
  updateModuleUI,
  updateAllCardsStyling,
  updateExclamationIcon,
  debounce
});