import './card.js';

export default class ModuleCard extends customElements.get("base-card") {
    constructor() {
        super();
    }

    set data(module) {
        const content = `
            <div>
                <h4>${module.Name}</h4>
            </div>
            <div class="d-flex">
                <div class="w-50">
                    <p><b>code:</b> ${module.Code}</p>
                    <p><b>semester:</b> ${module.Period}</p>
                </div>
                <div class="w-50">
                    <p><b>ec:</b> ${module.Ec}</p>
                    <p><b>niveau:</b> ${module.Niveau}</p>
                </div>
            </div>
        `;
        this.renderCard(content, module);
    }
}

customElements.define('module-card', ModuleCard);
