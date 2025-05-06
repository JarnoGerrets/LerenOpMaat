import './card.js';

export default class RequirementsCard extends customElements.get("base-card") {
    constructor() {
        super();
    }

    set data(requirements) {
        if (!requirements || requirements.length === 0) {
            return;
        }

        const items = requirements.map(req => `
            <div class="requirement">
                <p>${req.Description}</p>
            </div>
        `).join("");

        const content = `
            <div>
                <h4 class="title-requirement-card">Toegangseisen</h4>
            </div>
            <div class="d-flex flex-column gap-2 text-requirement-card" style="font-weight: bold;">
                ${items}
            </div>
        `;

        this.renderCard(content, "#45B97C");
    }
}

customElements.define('requirements-card', RequirementsCard);
