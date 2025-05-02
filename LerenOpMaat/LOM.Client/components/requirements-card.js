import './card.js';

export default class RequirementsCard extends customElements.get("base-card") {
    constructor() {
        super();
    }

    set data(requirements) {
        const items = requirements.map(req => `
            <div class="requirement">
                <p>${req.Description}</p>
            </div>
        `).join("");

        const content = `
            <div>
                <h4>Toegangseisen</h4>
            </div>
            <div class="d-flex flex-column gap-2" style="font-weight: bold;">
                ${items}
            </div>
        `;

        this.renderCard(content);
    }
}

customElements.define('requirements-card', RequirementsCard);
