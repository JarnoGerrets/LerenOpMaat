import SemesterChoice from "../views/partials/semester-choice.js";

export default async function SemesterCard({ semester, module, locked = false, onModuleChange }) {
  const template = document.createElement("template");
  template.innerHTML = `
      <div class="semester-card ${locked ? 'locked' : ''}">
        <h3>Semester ${semester}</h3>
        <button id="select-module" class="semester-button btn btn-light border">
          ${module}
          <i class="bi ${locked ? 'bi-lock-fill' : 'bi-unlock-fill'}"></i> 
        </button>
      </div>
    `;

  const fragment = template.content.cloneNode(true);
  const button = fragment.querySelector("#select-module");

  if (!locked && button) {
    button.addEventListener("click", async () => {
      const selectedModule = await SemesterChoice(button.textContent.trim());
      if (selectedModule) {
        button.innerHTML = `
                    ${selectedModule.Name} 
                    <i class="bi ${locked ? 'bi-lock-fill' : 'bi-unlock-fill'}"></i>
                `;
        // Roep de callback aan om de learningRouteArray bij te werken
        if (onModuleChange) {
          onModuleChange({
            semester,
            moduleId: selectedModule.Id,
          });
        }
      }
    });
  }

  return fragment;
}
