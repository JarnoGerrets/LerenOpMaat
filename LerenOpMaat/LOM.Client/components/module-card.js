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
                    <div class="module-info-row" style="font-weight: bold;">
                    Code: <span id="code-text">${module.Code}</span>
                    </div>
                    <div class="module-info-row" style="font-weight: bold;">
                    Periode: <span id="periode-text">${module.Periode}</span>
                    </div>
                </div>
                <div>
                    <div class="module-info-row" style="font-weight: bold;">
                    EC: <span id="ec-text">${module.Ec}</span>
                    </div>
                    <div class="module-info-row" style="font-weight: bold;">
                    Niveau: <span id="niveau-text">${module.Niveau}</span>
                    </div>
                </div>
            </div>
        `;
        this.renderCard(content, module);
    }
}

customElements.define('module-card', ModuleCard);
