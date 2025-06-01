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

  const userData = await window.userData;
  const role = userData?.EffectiveRole;
  const isAdminOrTeacher = ['Administrator', 'Teacher'].includes(role);
  const isSelecteerJeModule = module == "Selecteer je module";
  let canEdit = (!locked) || (isAdminOrTeacher && !isSelecteerJeModule) || (!isAdminOrTeacher && isSelecteerJeModule);

  const template = document.createElement("template");
  template.innerHTML = `
    <div class="semester-card-container">
      <div class="semester-card">
        <h3>Semester ${semester.Period}</h3>
        <button id="select-module" class="semester-button btn btn-light border ${!canEdit ? 'locked' : ''}" style="${!isActive ? 'color: red;' : ''}" data-locked="${locked}">
          ${module}
          <i class="ms-1 bi ${!isActive || locked ? 'bi-lock-fill' : 'bi-unlock-fill'}"></i> 
        </button>
        <span id="coursePoints-${moduleId || ""}" class="text-start d-block course-points-link"></span>
        <div class="exclamation-icon" data-bs-toggle="tooltip" data-bs-custom-class="tool-tip-style" title="">
          <i class="bi bi-exclamation-triangle-fill"></i>
        </div>
      </div>
      <div class="inactive-label-tag hidden">Deze module is inactief</div>
      <div class="evl-list-wrapper rounded p-2 mt-2">
        <div class="evl-list border rounded p-2 mt-2 bg-light"></div>
      </div>
    </div>
  `;
  const fragment = template.content.cloneNode(true);
  const cardElement = fragment.querySelector(".semester-card");
  const button = fragment.querySelector("#select-module");
  let coursePoints = fragment.querySelector(`#coursePoints-${moduleId || ''}`);

  const debouncedModuleSelection = debounce((params) => handleModuleSelection({ ...params, services }), 500);

  if (!locked && button) {
    button.addEventListener("click", () => debouncedModuleSelection({
      button, coursePoints, semester, locked, onModuleChange, cardElement
    }));
  }

  if (moduleId) cardElement.setAttribute("data-module-id", moduleId);
  if (semester.Id) cardElement.setAttribute("data-semester-id", semester.Id);

  if (moduleId && moduleId !== 200000 && moduleId !== 300000) {
    const selectedModule = await getModule(moduleId);
    try {
      const progress = await getModuleProgress(moduleId);
      await updateModuleUI(button, coursePoints, locked, selectedModule, progress, learningRouteArray);
      addExpandClickListener(cardElement);
      updateInactiveLabel(cardElement.closest(".semester-card-container"), selectedModule?.IsActive ?? true);
    } catch (error) {
      console.error("Failed to load progress for initial module:", error);
    }
  }

  setupGlobalEvlCloseHandler();

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

  if (!selectedModule) return;

  if (selectedModule.Name === "Geen Keuze") {
    await clearSelection(cardElement, coursePoints, locked, semester, onModuleChange, services);
    return;
  }

  onModuleChange({ semester, moduleId: selectedModule.Id, moduleName: selectedModule.Name });

  const result = await validateRoute(learningRouteArray);
  const hasDuplicate = result.some(v => v.Message.toLowerCase().includes("komt al voor in de leerroute") && !v.IsValid);
  if (hasDuplicate) {
    showToast("Module kan niet toegevoegd worden omdat het al bestaat in de leerroute.", "error");
    await clearSelection(cardElement, coursePoints, locked, semester, onModuleChange, services);
    return;
  }

  let progress;
  try {
    progress = await getModuleProgress(selectedModule.Id);
  } catch (error) {
    console.error("Failed to load progress for selected module:", error);
  }

  await updateModuleUI(button, coursePoints, locked, selectedModule, progress, learningRouteArray);
  
  // re-select coursePoints after DOM update
  coursePoints = cardElement.querySelector(`#coursePoints-${selectedModule.Id || ''}`);
  addExpandClickListener(cardElement);

  cardElement.setAttribute("data-module-id", selectedModule.Id);

  const finalValidation = await validateRoute(learningRouteArray);
  handleValidationResult(finalValidation);
}

async function clearSelection(cardElement, coursePoints, locked, semester, onModuleChange, services) {
  const {
    updateModuleUI,
    updateExclamationIcon,
    updateAllCardsStyling
  } = services;

  const moduleId = parseInt(cardElement.getAttribute("data-module-id"));
  await updateModuleUI(cardElement.querySelector("#select-module"), coursePoints, locked, null, learningRouteArray);

  coursePoints = cardElement.querySelector(`#coursePoints-`);
  addExpandClickListener(cardElement);

  cardElement.setAttribute("data-module-id", '');
  cardElement.classList.remove("invalid-module");

  if (!isNaN(moduleId)) {
    delete validationState[moduleId];
    if (moduleMessagesMap[moduleId]) delete moduleMessagesMap[moduleId];
  }

  updateExclamationIcon(cardElement, '', true);
  updateAllCardsStyling({ [moduleId]: [] });

  onModuleChange({ semester, moduleId: null });
}

function addExpandClickListener(cardElement) {
  const coursePoints = cardElement.querySelector(`[id^="coursePoints-"]`);
  const evlWrapper = cardElement.closest(".semester-card-container").querySelector(".evl-list-wrapper");
  const evlList = evlWrapper.querySelector(".evl-list");

  coursePoints.onclick = () => {
    evlWrapper.classList.toggle("expand");
    evlList.classList.toggle("expand");
  };
}

function updateInactiveLabel(cardContainer, isActive) {
  let label = cardContainer.querySelector('.inactive-label-tag');
  const button = cardContainer.querySelector('#select-module');
  label.classList.toggle('hidden', isActive);
  button.style.color = (button.textContent.includes("Selecteer je module") || isActive) ? '' : 'red';
}

function setupGlobalEvlCloseHandler() {
  document.addEventListener("click", (event) => {
    document.querySelectorAll(".semester-card-container").forEach(container => {
      const evlWrapper = container.querySelector(".evl-list-wrapper");
      const evlList = evlWrapper.querySelector(".evl-list");
      const coursePoints = container.querySelector("[id^='coursePoints-']");

      const clickedInsideEvl = evlWrapper.contains(event.target);
      const clickedToggle = coursePoints.contains(event.target);

      if (!clickedInsideEvl && !clickedToggle) {
        evlWrapper.classList.remove("expand");
        evlList.classList.remove("expand");
      }
    });
  });
}

window.validationState = validationState;
window.moduleMessagesMap = moduleMessagesMap;
