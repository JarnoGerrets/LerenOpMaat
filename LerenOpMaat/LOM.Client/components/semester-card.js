import SemesterChoice from "../views/partials/semester-choice.js";

export default async function SemesterCard({ semester, module, locked = false }) {
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
      const selectedModule = await SemesterChoice();
      if (selectedModule.name !== "Geen Keuze") {
        button.innerHTML = `
                  ${selectedModule.name} 
                  <i class="bi ${locked ? 'bi-lock-fill' : 'bi-unlock-fill'}"></i>                  
              `;
      } else {
        button.innerHTML = `
                  Selecteer je module
                  <i class="bi ${locked ? 'bi-lock-fill' : 'bi-unlock-fill'}"></i>
              `;
      }
    });
  }

  return fragment;
}
