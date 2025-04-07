export default function SemesterCard({ semester, module, locked = false }) {
    const template = document.createElement("template");
    template.innerHTML = `
      <div class="semester-card ${locked ? 'locked' : ''}">
        <h3>Semester ${semester}</h3>
        <p>${module} ${locked ? '<span class="lock">🔒</span>' : ''}</p>
      </div>
    `;
    return template.content.cloneNode(true);
  }