import { learningRouteArray } from "./semester-pair.js";
import { semesterCardServices } from "../scripts/utils/importServiceProvider.js";

let validationState = {};
const moduleMessagesMap = {};

export default async function SemesterCard({ semester, module, locked = false, isActive = true, onModuleChange, moduleId, services = semesterCardServices }) {
  const {
    SemesterChoice,
    getModule,
    getModuleProgress,
    validateRoute,
    handleValidationResult,
    updateModuleUI,
    updateAllCardsStyling,
    updateExclamationIcon,
    debounce
  } = services;

  const template = document.createElement("template");
  template.innerHTML = `
  <div class="semester-card-container">
    <div class="semester-card">
      <h3>Semester ${semester}</h3>
      <button id="select-module" class="semester-button btn btn-light border ${!isActive || locked ? 'locked' : ''}" style="${!isActive ? 'color: red;' : ''}">
        ${module}
        <i class="ms-1 bi ${!isActive || locked ? 'bi-lock-fill' : 'bi-unlock-fill'}"></i> 
      </button>
      <span id="coursePoints" class="text-start d-block course-points-link"></span>
      <div class="exclamation-icon" data-bs-toggle="tooltip" data-bs-custom-class="tool-tip-style" title="">
        <i class="bi bi-exclamation-triangle-fill"></i>
      </div>
    </div>
    <div class="inactive-label-tag hidden">
      Deze module is inactief
    </div>
    <div class="evl-list-wrapper rounded p-2 mt-2">
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
  (params) => handleModuleSelection({ ...params, services }), 500
);

if (!locked && button) {
  button.addEventListener("click", () =>
    debouncedModuleSelection({
      button, coursePoints, semester, locked, onModuleChange, cardElement
    })
  );
}

  if (moduleId) {
    cardElement.setAttribute("data-module-id", moduleId);
  }

  if (moduleId && moduleId !== 200000 && moduleId !== 300000) {
    const selectedModule = await getModule(moduleId);
    try {

      const progress = await getModuleProgress(moduleId);
      await updateModuleUI(button, coursePoints, locked, selectedModule, progress, learningRouteArray);

      const cardContainer = cardElement.closest(".semester-card-container");
      const moduleActiveStatus = selectedModule?.IsActive ?? true;

      updateInactiveLabel(cardContainer, moduleActiveStatus);

    } catch (error) {
      console.error("Failed to load progress for initial module:", error);
    }
  }
  return fragment;
}

async function handleModuleSelection({ button, coursePoints, semester, locked, onModuleChange, cardElement, services }) {
  const {
    SemesterChoice,
    getModuleProgress,
    validateRoute,
    updateModuleUI,
    updateAllCardsStyling,
    updateExclamationIcon,
    handleValidationResult
  } = services;
  const selectedModule = await SemesterChoice(button.textContent.trim());

  const clearSelection = async () => {
    const moduleId = parseInt(cardElement.getAttribute("data-module-id"));

    await updateModuleUI(button, coursePoints, locked, null, learningRouteArray);
    const cardContainer = cardElement.closest(".semester-card-container");
    const moduleActiveStatus = selectedModule?.IsActive ?? true;

    updateInactiveLabel(cardContainer, moduleActiveStatus);

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

    updateAllCardsStyling({ [moduleId]: [] });

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
  let progress;
  try {
    progress = await getModuleProgress(selectedModule.Id);
  } catch (error) {
    console.error("Failed to load progress for selected module:", error);
  }

  const hasDuplicate = result.some(v =>
    v.Message.toLowerCase().includes("komt al voor in de leerroute") && !v.IsValid
  );

  if (hasDuplicate) {
    showToast("Module kan niet toegevoegd worden omdat het al bestaat in de leerroute.", "error");
    clearSelection();
    return;
  }

  await updateModuleUI(button, coursePoints, locked, selectedModule, progress, learningRouteArray);
  const cardContainer = cardElement.closest(".semester-card-container");
  const moduleActiveStatus = selectedModule?.IsActive ?? true;
  updateInactiveLabel(cardContainer, moduleActiveStatus);

  cardElement.setAttribute("data-module-id", selectedModule.Id);
  onModuleChange({ semester, moduleId: selectedModule.Id });

  const finalValidation = await validateRoute(learningRouteArray);
  handleValidationResult(finalValidation);

}

function updateInactiveLabel(cardContainer, isActive) {
  let label = cardContainer.querySelector('.inactive-label-tag');
  const button = cardContainer.querySelector('#select-module');
  label.classList.toggle('hidden', isActive);
  if (button.textContent.includes("Selecteer je module")) {
    button.style.color = '';
  } else {
    button.style.color = isActive ? '' : 'red';
  }
}


document.addEventListener("click", (event) => {
  const allEvlWrappers = document.querySelectorAll(".evl-list-wrapper");

  allEvlWrappers.forEach(wrapper => {
    const card = wrapper.closest(".semester-card-container")?.querySelector(".semester-card");
    const toggle = card?.querySelector("#coursePoints");

    if (!wrapper.contains(event.target) && !toggle.contains(event.target)) {
      wrapper.classList.remove("expand");
    }
  });
});


window.validationState = validationState;
window.moduleMessagesMap = moduleMessagesMap;
