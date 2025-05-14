import SemesterChoice from "../views/partials/semester-choice.js";
import { validateRoute } from "../../client/api-client.js";
import { learningRouteArray } from "./semester-pair.js";


let validationState = {};

function updateValidationState(moduleId, isValid) {
  validationState[moduleId] = isValid;
}

function updateAllCardsStyling(validationResults = {}) {
  const allCards = document.querySelectorAll(".semester-card");
  allCards.forEach((card) => {
    const cardElement = card;
    const moduleId = parseInt(cardElement.getAttribute("data-module-id"));
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
      const validationMsg = validationResults[moduleId] || "Er is een validatiefout";
      updateExclamationIcon(card, validationMsg, false);
    }
  });
}


export default async function SemesterCard({ semester, module, locked = false, onModuleChange }) {
  const template = document.createElement("template");
  template.innerHTML = `
      <div class="semester-card ${locked ? 'locked' : ''}">
        <h3>Semester ${semester}</h3>
        <button id="select-module" class="semester-button btn btn-light border">
          ${module}
          <i class="bi ${locked ? 'bi-lock-fill' : 'bi-unlock-fill'}"></i> 
        </button>

      <div class="exclamation-icon" data-bs-toggle="tooltip" title="">
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
    button.addEventListener("click", async () => {
      const selectedModule = await SemesterChoice(button.textContent.trim());
      if (selectedModule && selectedModule.Name !== "Geen Keuze") {
        button.innerHTML = `
              ${selectedModule.Name} 
              <i class="bi ${locked ? 'bi-lock-fill' : 'bi-unlock-fill'}"></i>
          `;
        updateModuleId(selectedModule.Id);
      } else {
        cardElement.classList.remove("invalid-module");
        button.innerHTML = `
              Selecteer je module
              <i class="bi ${locked ? 'bi-lock-fill' : 'bi-unlock-fill'}"></i>
          `;
        updateModuleId(null);
      }

      // Roep de callback aan om de learningRouteArray bij te werken
      if (onModuleChange) {
        onModuleChange({
          semester,
          moduleId:
            !selectedModule || selectedModule.Name === "Geen Keuze"
              ? null
              : selectedModule.Id,
        });
        console.log(learningRouteArray);

        let result = await validateRoute(learningRouteArray);
        let validationResults = {};
        for (const validation of result) {
          const moduleId = validation.ViolatingModuleId;
          validationResults[moduleId] = validation.Message;
          updateValidationState(moduleId, validation.IsValid);
          if (!validation.IsValid) {
            showToast(validation.Message, "error");
          }
        }

        updateAllCardsStyling(validationResults);


      }
    });
  }

  return fragment;
}

function updateExclamationIcon(cardElement, validationMsg, isValid) {
  const icon = cardElement.querySelector('.exclamation-icon');
  console.log(icon);
  if (!icon) return;

   if (!isValid) {
    icon.classList.add('show');
    icon.setAttribute('title', validationMsg);
  } else {
    icon.classList.remove('show');
    icon.removeAttribute('title');
  }
}