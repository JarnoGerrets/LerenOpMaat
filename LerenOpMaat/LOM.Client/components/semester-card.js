import SemesterChoice from "../views/partials/semester-choice.js";
import { validateRoute, getModuleProgress, addCompletedEvl, removeCompeltedEvl } from "../../client/api-client.js";
import { learningRouteArray } from "./semester-pair.js";


let validationState = {};
const moduleMessagesMap = {};

export default async function SemesterCard({ semester, module, locked = false, onModuleChange }) {
  const template = document.createElement("template");
  template.innerHTML = `
  <div class="semester-card-container">
    <div class="semester-card ${locked ? 'locked' : ''}">
      <h3>Semester ${semester}</h3>
      <button id="select-module" class="semester-button btn btn-light border">
        ${module}
        <i class="ms-1 bi ${locked ? 'bi-lock-fill' : 'bi-unlock-fill'}"></i> 
      </button>
      <span id="coursePoints" class="text-start d-block course-points-link"></span>
      <div class="exclamation-icon" data-bs-toggle="tooltip" data-bs-custom-class="tool-tip-style" title="">
        <i class="bi bi-exclamation-triangle-fill"></i>
      </div>
    </div>
    <div class="evl-list-wrapper">
      <div class="evl-list border rounded p-2 mt-2 bg-light">
        
      </div>
    </div>
  </div>
`;
  const updateModuleId = (moduleId) => {
    cardElement.setAttribute("data-module-id", moduleId || '');
  };
  const fragment = template.content.cloneNode(true);
  const cardElement = fragment.querySelector(".semester-card");
  const button = fragment.querySelector("#select-module");
  const coursePoints = fragment.querySelector("#coursePoints");
  const debouncedModuleSelection = debounce(
    (params) => handleModuleSelection(params),
    500
  );

  if (!locked && button) {
    button.addEventListener("click", () =>
    debouncedModuleSelection({ button, coursePoints, semester, locked, onModuleChange, cardElement })
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

function updateModuleUI(button, coursePoints, locked, selectedModule, progress = null) {
  button.innerHTML = `
    ${selectedModule ? selectedModule.Name : 'Selecteer je module'}
    <i class="bi ${locked ? 'bi-lock-fill' : 'bi-unlock-fill'}"></i>
  `
  const card = button.closest('.semester-card');
  const evlWrapper = card.nextElementSibling;
  const evlList = evlWrapper.querySelector(".evl-list");

  const achievedECs = calculateAchievedECs(progress, selectedModule);
  if (selectedModule?.Evls) {
    evlList.innerHTML = selectedModule.Evls.map(ev => {
      const isChecked = progress?.CompletedEvls?.some(completed => completed.ModuleEvl.Id === ev.Id);

      return `
      <div class="form-check d-flex align-items-center justify-content-between">
        <label class="form-check-label me-2" for="${ev.Id}">
          ${ev.Name} (${ev.Ec || 10} EC's)
        </label>
        <input style="margin-right: 5px;" 
               class="form-check-input" 
               type="checkbox" 
               id="${ev.Id}" 
               data-evl-id="${ev.Id}" 
               ${isChecked ? 'checked' : ''}>
      </div>
      </div>
    `;
    }).join('');

    // Add event listeners to checkboxes after rendering
    evlList.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
      checkbox.addEventListener('change', async (e) => {
        const evlId = parseInt(e.target.getAttribute('data-evl-id'));
        const moduleId = selectedModule.Id;

        let updatedProgress;
        if (e.target.checked) {
          updatedProgress = await addCompletedEvl(moduleId, evlId);
          updateAllCardsStyling();
        } else {
          updatedProgress = await removeCompeltedEvl(moduleId, evlId);
          updateAllCardsStyling();
        }
        progress = updatedProgress;

        const achievedECs = calculateAchievedECs(progress, selectedModule);

        coursePoints.innerHTML = `Studiepunten (${achievedECs}/${selectedModule.Ec}) ↓`;
      });
    });
  } else {
    evlList.innerHTML = "";
  }

  if (selectedModule) {
    coursePoints.innerHTML = `Studiepunten (${achievedECs}/${selectedModule.Ec}) ↓`;
    coursePoints.style.cursor = "pointer";
    coursePoints.onclick = () => {
      evlWrapper.classList.toggle("expand");
    }
  } else {
    coursePoints.innerHTML = "";
    coursePoints.style.cursor = "default";
  }

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

async function handleModuleSelection({ button, coursePoints, semester, locked, onModuleChange, cardElement }) {
  const selectedModule = await SemesterChoice(button.textContent.trim());

  const clearSelection = () => {
    const moduleId = parseInt(cardElement.getAttribute("data-module-id"));

    updateModuleUI(button, coursePoints, locked, null);
    cardElement.setAttribute("data-module-id", '');
    cardElement.classList.remove("invalid-module");

    if (!isNaN(moduleId)) {
      delete validationState[moduleId];

      if (moduleMessagesMap[moduleId]) {
        moduleMessagesMap[moduleId].forEach(message => {
          moduleMessagesMap[moduleId].delete(message);
        });
        delete moduleMessagesMap[moduleId];
      }
    }

    updateExclamationIcon(cardElement, '', true);

    updateAllCardsStyling();

    onModuleChange({ semester, moduleId: null });
  };

  if (selectedModule === null || selectedModule === undefined) {
    return;
  }
  if (selectedModule.Name === "Geen Keuze") {
    clearSelection();
    return;
  }

  onModuleChange({ semester, moduleId: selectedModule.Id });
  const result = await validateRoute(learningRouteArray);
  const progress = await getModuleProgress(selectedModule.Id);

  const hasDuplicate = result.some(v =>
    v.Message.toLowerCase().includes("komt al voor in de leerroute") && !v.IsValid
  );

  if (hasDuplicate) {
    showToast("Module kan niet toegevoegd worden omdat het al bestaat in de leerroute.", "error");
    clearSelection();
    return;
  }

  updateModuleUI(button, coursePoints, locked, selectedModule, progress);
  cardElement.setAttribute("data-module-id", selectedModule.Id);
  onModuleChange({ semester, moduleId: selectedModule.Id });

  const finalValidation = await validateRoute(learningRouteArray);
  handleValidationResult(finalValidation);

}

function calculateAchievedECs(progress, selectedModule) {
  if (!progress?.CompletedEvls || !selectedModule?.Evls) return 0;

  return progress.CompletedEvls.reduce((sum, completed) => {
    const evl = selectedModule.Evls.find(ev => ev.Id === completed.ModuleEvl.Id);
    return sum + (evl?.Ec || 10);
  }, 0);
}

function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}


document.addEventListener("click", (event) => {
  const allEvlWrappers = document.querySelectorAll(".evl-list-wrapper");

  allEvlWrappers.forEach(wrapper => {
    const card = wrapper.previousElementSibling;
    const toggle = card?.querySelector("#coursePoints");

    if (!wrapper.contains(event.target) && !toggle.contains(event.target)) {
      wrapper.classList.remove("expand");
    }
  });
});

