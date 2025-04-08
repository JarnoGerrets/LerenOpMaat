import SemesterChoice from "../views/partials/semester-choice.js";

export default function SemesterCard({ semester, module, locked = false }) {
    const template = document.createElement("template");
    template.innerHTML = `
      <div class="semester-card ${locked ? 'locked' : ''}">
        <h3>Semester ${semester}</h3>
        <button id="select-module" class="btn btn-light border select-module ${locked ? 'disabled' : ''}" ${locked ? 'disabled' : ''}>
          ${module}
        </button>
        <p>${locked ? '<span class="lock">🔒</span>' : ''}</p>
      </div>
    `;

    const fragment = template.content.cloneNode(true);
    const button = fragment.querySelector("#select-module");
  
    if (!locked && button) {
      button.addEventListener("click", () => {
        SemesterChoice();
      });
    }
  
    return fragment;
  }