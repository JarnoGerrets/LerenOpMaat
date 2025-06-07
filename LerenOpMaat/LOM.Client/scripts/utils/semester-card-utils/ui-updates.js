import { uiUpdatesServices } from '../importServiceProvider.js'

export function updateExclamationIcon(cardElement, validationMsg, isValid) {
  const icon = cardElement.querySelector('.exclamation-icon');
  if (!icon) return;

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  if (!isValid) {
    icon.classList.add('show');
    icon.setAttribute('title', validationMsg);

    if (isMobile && !icon.dataset.listenerAdded) {
      icon.addEventListener('click', () => {
        const lines = validationMsg.split('\n').map(line => line.trim()).filter(Boolean);
        lines.forEach(line => {
          if (line.startsWith("-")) {
            showToast(line.slice(1).trim(), "error");
          } else {
            showToast(line, "error");
          }
        });
      });
      icon.dataset.listenerAdded = "true";
    }
  } else {
    icon.classList.remove('show');
    icon.removeAttribute('title');
  }
}


export function updateAllCardsStyling(validationResults = {}, scope = document) {
  const allCards = scope.querySelectorAll(".semester-card");

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

export async function updateModuleUI(button, coursePoints, locked, selectedModule, progress = null, learningRouteArray = null, services = uiUpdatesServices) {
  const {
    validateRoute,
    addCompletedEvl,
    removeCompletedEvl,
    handleValidationResult,
    calculateAchievedECs
  } = services;

  let isActive = selectedModule ? selectedModule.IsActive : true;
  button.innerHTML = `
    ${selectedModule ? selectedModule.Name : 'Selecteer je module'}
    <i class="bi ${!isActive || locked ? 'bi-lock-fill' : 'bi-unlock-fill'}"></i>
  `
  if (!isActive) {
    button.style.color = 'red';
  } else if (locked) {
    button.style.color = 'gray';
  } else {
    button.style.color = 'black';
  }
  const card = button.closest('.semester-card');
  const evlWrapper = card.parentElement.querySelector(".evl-list-wrapper");
  const evlList = evlWrapper.querySelector(".evl-list");

  const achievedECs = calculateAchievedECs(progress, selectedModule);
  const loggedIn = window.userData;
  // only loggedin users should be able to update evl's as the feature represents progress of education.
  if (selectedModule?.Evls && loggedIn) {
    evlList.innerHTML = selectedModule.Evls.map(ev => {
      const isChecked = progress?.CompletedEvls?.some(completed => completed.ModuleEvl.Id === ev.Id);
      return `
        <label class="checkbox-wrapper-30">
          <span class="checkbox" style="margin-right: 15px;">
              <input type="checkbox" 
                class="checkbox" 
                id="${ev.Id}" 
                data-evl-id="${ev.Id}" 
                ${isChecked ? 'checked' : ''}>
              <svg>
                <use xlink:href="#checkbox-30" class="checkbox"></use>
              </svg>
            </span>

          <span class="checkbox-text">
          ${ev.Name} (${ev.Ec || 10} EC's)
            <svg xmlns="http://www.w3.org/2000/svg" style="display: none">
              <symbol id="checkbox-30" viewBox="0 0 22 22">
                <path
                  fill="none"
                  stroke="#003366"
                  d="M5.5,11.3L9,14.8L20.2,3.3l0,0c-0.5-1-1.5-1.8-2.7-1.8h-13c-1.7,0-3,1.3-3,3v13c0,1.7,1.3,3,3,3h13 c1.7,0,3-1.3,3-3v-13c0-0.4-0.1-0.8-0.3-1.2"
                />
              </symbol>
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
  // updating the text in the card to show current progression of education.
  if (selectedModule && loggedIn) {
    coursePoints.innerHTML = `Behaalde ec's (${achievedECs}/${selectedModule.Ec}) ↓`;
    coursePoints.style.cursor = "pointer";

    coursePoints.onclick = () => {
      const evlWrapper = card.parentElement.querySelector(".evl-list-wrapper");
      const evlList = evlWrapper.querySelector(".evl-list");
      evlWrapper.classList.toggle("expand");
      evlList.classList.toggle("expand");
    };
  } else {
    coursePoints.innerHTML = "";
    coursePoints.style.cursor = "default";
  }

}