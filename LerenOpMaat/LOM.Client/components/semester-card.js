import SemesterChoice from "../views/partials/semester-choice.js";
import { validateRoute } from "../../client/api-client.js";
import { learningRouteArray } from "./semester-pair.js";


let validationState = {};

export default async function SemesterCard({ semester, module, locked = false, onModuleChange }) {
  const template = document.createElement("template");
  template.innerHTML = `
    <div class="semester-card ${locked ? 'locked' : ''}">
      <h3>Semester ${semester}</h3>
      <button id="select-module" class="semester-button btn btn-light border">
        ${module}
        <i class="bi ${locked ? 'bi-lock-fill' : 'bi-unlock-fill'}"></i> 
      </button>
      <div class="exclamation-icon" data-bs-toggle="tooltip" data-bs-custom-class="tool-tip-style" title="">
        <i class="bi bi-exclamation-triangle-fill"></i>
      </div>
    </div>
  `;
  const updateModuleId = (moduleId) => {
    cardElement.setAttribute("data-module-id", moduleId || '');
  };
  const fragment = template.content.cloneNode(true);
  const cardElement = fragment.querySelector(".semester-card");
  const button = fragment.querySelector("#select-module");

  if (!locked && button) {
    button.addEventListener("click", () =>
      handleModuleSelection({ button, semester, locked, onModuleChange, cardElement })
    );
  }

  return fragment;
}


function updateValidationState(moduleId, isValid) {
  validationState[moduleId] = isValid;
}

function updateExclamationIcon(cardElement, validationMsg, isValid) {
  const icon = cardElement.querySelector('.exclamation-icon');
  if (!icon) return;

  if (!isValid) {
    icon.classList.add('show');
    icon.setAttribute('title', validationMsg);
  } else {
    icon.classList.remove('show');
    icon.removeAttribute('title');
  }
}

function updateAllCardsStyling(validationResults = {}) {
  const allCards = document.querySelectorAll(".semester-card");
  allCards.forEach((card) => {
    const moduleId = parseInt(card.getAttribute("data-module-id"));
    const isValid = validationState[moduleId] !== undefined ? validationState[moduleId] : true;

    if (isValid === true) {
      if (card.classList.contains("invalid-module")) {
        showToast("Geen conflicten meer", "success");
        card.classList.remove("invalid-module");
      }
      updateExclamationIcon(card, '', true);
    } else {
      if (!card.classList.contains("invalid-module")) {
        card.classList.add("invalid-module");
      }
      const validationMsg = validationResults[moduleId]
        ? validationResults[moduleId].join('\n')
        : "Er is een validatiefout";
      updateExclamationIcon(card, validationMsg, false);
    }
  });
}

function updateModuleUI(button, locked, selectedModule) {
  button.innerHTML = `
    ${selectedModule ? selectedModule.Name : 'Selecteer je module'}
    <i class="bi ${locked ? 'bi-lock-fill' : 'bi-unlock-fill'}"></i>
  `;
}

function handleValidationResult(result) {
  let validationResults = {};
  for (const validation of result) {
    const moduleId = validation.ViolatingModuleId;

    if (!validationResults[moduleId]) {
      validationResults[moduleId] = [];
    }
    validationResults[moduleId].push("- " + validation.Message);

    updateValidationState(moduleId, validation.IsValid);
    if (!validation.IsValid) {
      showToast(validation.Message, "error");
    }
  }

  updateAllCardsStyling(validationResults);
}

async function handleModuleSelection({ button, semester, locked, onModuleChange, cardElement }) {
  const selectedModule = await SemesterChoice(button.textContent.trim());

  const clearSelection = () => {
    updateModuleUI(button, locked, null);
    cardElement.setAttribute("data-module-id", '');
    cardElement.classList.remove("invalid-module");
    onModuleChange({ semester, moduleId: null });
  };

  if (!selectedModule || selectedModule.Name === "Geen Keuze") {
    clearSelection();
    return;
  }

  onModuleChange({ semester, moduleId: selectedModule.Id });
  const result = await validateRoute(learningRouteArray);
  const hasDuplicate = result.some(v =>
    v.Message.toLowerCase().includes("komt al voor in de leerroute") && !v.IsValid
  );

  if (hasDuplicate) {
    showToast("Module kan niet toegevoegd worden omdat het al bestaat in de leerroute.", "error");
    clearSelection();
    return;
  }

  updateModuleUI(button, locked, selectedModule);
  cardElement.setAttribute("data-module-id", selectedModule.Id);
  onModuleChange({ semester, moduleId: selectedModule.Id });

  const finalValidation = await validateRoute(learningRouteArray);
  handleValidationResult(finalValidation);
}


