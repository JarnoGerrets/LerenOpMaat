import './card.js';
import { mapPeriodToPresentableString } from '../scripts/utils/universal-utils.js';

export default class ModuleCard extends customElements.get("base-card") {
    constructor() {
        super();
    }

    set data({module, showInfoIcon = false}) {
        const infoIcon = showInfoIcon
            ? `<a href="#Module/${module.Id}" class="material-icons module-icon-overview" title="Meer info"
                    style="position: absolute; top: 10px; right: 10px; color: #000; text-decoration: none;">
                    open_in_new
                </a>`
            : "";
            const content = `
            <div>
                <h4 mb-3 class="title-module-card">${module.Name}</h4>
            </div>
            <div class="d-flex text-module-card">
                <div class="w-50">
                    <div class="module-info-row" style="font-weight: bold;">
                    Code: <span id="code-text">${module.Code}</span>
                    </div>
                    <div class="module-info-row" style="font-weight: bold;">
                    Periode: <span id="period-text">${mapPeriodToPresentableString(module.Period)}</span>
                    </div>
                    <div class="module-info-row" style="font-weight: bold;">
                        Profiel: <span id="graduate-text">${module.GraduateProfile.Name}</span>
                    </div>
                </div>
                <div class="w-50">
                    <div class="module-info-row" style="font-weight: bold;">
                    EC: <span id="ec-text">${module.Ec}</span>
                    </div>
                    <div class="module-info-row" style="font-weight: bold;">
                    Niveau: <span id="level-text">${module.Level}</span>
                    </div>
                </div>
            </div>
            ${infoIcon}
        `;
        this.dataset.id = module.Id;
        let colorcode = module.GraduateProfile?.ColorCode || "";
        if (!(module.IsActive)) {
            colorcode = "#D3D3D3";
        }
        this.renderCard(content, colorcode);
    }
}

customElements.define('module-card', ModuleCard);
