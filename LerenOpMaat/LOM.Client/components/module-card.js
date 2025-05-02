import './card.js';

export default class ModuleCard extends customElements.get("base-card") {
    constructor() {
        super();
    }

    set data(module) {
        const content = `
            <div>
                <h4>${module.name}</h4>
            </div>
            <div class="d-flex">
                <div class="w-50">
                    <p><b>code:</b> ${module.code}</p>
                    <p><b>semester:</b> ${module.niveau}</p>
                </div>
                <div class="w-50">
                    <p><b>ec:</b> ${module.ec}</p>
                    <p><b>niveau:</b> ${module.niveau}</p>
                </div>
            </div>
        `;
        this.renderCard(content, module);
    }
}

customElements.define('module-card', ModuleCard);
