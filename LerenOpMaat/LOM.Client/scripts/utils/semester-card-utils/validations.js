import {validationsServices} from '../importServiceProvider.js'

function updateValidationState(moduleId, isValid) {
  validationState[moduleId] = isValid;
}


export function handleValidationResult(result, services = validationsServices) {
  const{
    updateAllCardsStyling
  } = services;
  
  let validationResults = {};

  for (const validation of result) {
    const moduleId = validation.ViolatingModuleId;

    if (!validationResults[moduleId]) {
      validationResults[moduleId] = [];
    }
    validationResults[moduleId].push("- " + validation.Message);

    updateValidationState(moduleId, validation.IsValid);

    if (!moduleMessagesMap[moduleId]) {
      moduleMessagesMap[moduleId] = new Set();
    }

    if (!validation.IsValid && !moduleMessagesMap[moduleId].has(validation.Message)) {
      moduleMessagesMap[moduleId].add(validation.Message);
      showToast(validation.Message, "error");
    }

  }

  updateAllCardsStyling(validationResults);
}
