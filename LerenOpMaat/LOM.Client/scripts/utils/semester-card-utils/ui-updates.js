import { calculateAchievedECs } from "./utils.js";
import { handleValidationResult } from "./validations.js";
import { validateRoute, addCompletedEvl, removeCompletedEvl } from "../../../client/api-client.js";

export function updateExclamationIcon(cardElement, validationMsg, isValid) {
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

export function updateAllCardsStyling(validationResults = {}) {
  const allCards = document.querySelectorAll(".semester-card");

  allCards.forEach((card) => {
    const moduleId = parseInt(card.getAttribute("data-module-id"));
    const messages = validationResults[moduleId] || [];

    updateCardStyle(card, moduleId, messages);
  });
}

export function updateCardStyle(card, moduleId, validationMessages = []) {
  const isValid = validationState[moduleId] ?? true;

  if (isValid) {
    if (card.classList.contains("invalid-module")) {
      showToast("Geen conflicten meer", "success");
    }
    card.classList.remove("invalid-module");
    updateExclamationIcon(card, '', true);
  } else {
    if (!card.classList.contains("invalid-module")) {
      card.classList.add("invalid-module");
    }
    updateExclamationIcon(card, validationMessages.join('\n'), false);
  }
}

export async function updateModuleUI(button, coursePoints, locked, selectedModule, progress = null, learningRouteArray = null) {
  button.innerHTML = `
    ${selectedModule ? selectedModule.Name : 'Selecteer je module'}
    <i class="bi ${locked ? 'bi-lock-fill' : 'bi-unlock-fill'}"></i>
  `
  const card = button.closest('.semester-card');
  const evlWrapper = card.nextElementSibling;
  const evlList = evlWrapper.querySelector(".evl-list");

  const achievedECs = calculateAchievedECs(progress, selectedModule);
  const loggedIn = localStorage.getItem("userData");
  if (selectedModule?.Evls && loggedIn) {
    evlList.innerHTML = selectedModule.Evls.map(ev => {
      const isChecked = progress?.CompletedEvls?.some(completed => completed.ModuleEvl.Id === ev.Id);

      return `
        <label class="checkbox-wrapper-30">
          <input type="checkbox" 
                class="checkbox" 
                id="${ev.Id}" 
                data-evl-id="${ev.Id}" 
                ${isChecked ? 'checked' : ''}>
          <span class="checkbox-text">
            ${ev.Name} (${ev.Ec || 10} EC's)
          </span>
          <svg viewBox="0 0 35.6 35.6">
            <circle class="background" cx="17.8" cy="17.8" r="17.8"/>
            <circle class="stroke" cx="17.8" cy="17.8" r="14.37"/>
            <polyline class="check" points="11.78 18.12 15.5 22.32 23.5 14.32"/>
          </svg>
        </label>
      `;
    }).join('');

    evlList.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
      checkbox.addEventListener('change', async (e) => {
        const evlId = parseInt(e.target.getAttribute('data-evl-id'));
        const moduleId = selectedModule.Id;

        let updatedProgress;
        if (e.target.checked) {
          updatedProgress = await addCompletedEvl(moduleId, evlId);
          updateAllCardsStyling();
        } else {
          updatedProgress = await removeCompletedEvl(moduleId, evlId);
          updateAllCardsStyling();
        }
        progress = updatedProgress;

        const achievedECs = calculateAchievedECs(progress, selectedModule);

        coursePoints.innerHTML = `Behaalde ec's (${achievedECs}/${selectedModule.Ec}) ↓`;
        const finalValidation = await validateRoute(learningRouteArray);
        handleValidationResult(finalValidation);
      });
    });
  } else {
    evlList.innerHTML = "";
  }

  if (selectedModule && loggedIn) {
    coursePoints.innerHTML = `Behaalde ec's (${achievedECs}/${selectedModule.Ec}) ↓`;
    coursePoints.style.cursor = "pointer";
    coursePoints.onclick = () => {
      evlWrapper.classList.toggle("expand");
    }
  } else {
    coursePoints.innerHTML = "";
    coursePoints.style.cursor = "default";
  }

}