import loadTemplate from "../scripts/loadTemplate.js";
import { mapPeriodToPresentableString } from "../scripts/utils/presentationMapper.js"

export default class SemesterModule {
    constructor(modules, onModuleSelect) {
        this.modules = modules;
        this.onModuleSelect = onModuleSelect;
    }

    async render() {
        const container = document.createElement('div');
        container.classList.add('module-container');
        container.id = 'popup-module-container';

        const template = await loadTemplate('../templates/module-card.html');

        this.modules.forEach(module => {
            let link = '';
            if (module.Id) {
                link = `<a href="#Module/${module.Id}" class="material-icons module-icon" title="Go to ${module.Description}">
                    info_outline
                </a>`;
            }
            let cardText = "";

            if (module.Name != "Geen Keuze") {
                cardText = `<div class="d-flex flex-column justify-content-between">
                <div class="d-flex">
                    <div class="w-50">
                        <div class="module-info-row">
                        Code: <span id="code-text">${module.Code}</span>
                        </div>
                        <div class="module-info-row">
                        Periode: <span id="period-text">${mapPeriodToPresentableString(module.Period)}</span>
                        </div>
                    </div>
                    <div>
                        <div class="module-info-row">
                        EC: <span id="ec-text">${module.Ec}</span>
                        </div>
                        <div class="module-info-row">
                        Niveau: <span id="level-text">${module.Level}</span>
                        </div>
                    </div>
                </div>`;
            }
            const populatedTemplate = template
                .replace('{{card_text}}', cardText)
                .replace('{{title}}', module.Name)
                .replace('{{link}}', link);

            const tile = document.createElement('div');
            tile.classList.add('module-tile');
            tile.style.backgroundColor = module.GraduateProfile.ColorCode;
            tile.id = `module-${module.Id}`;
            tile.innerHTML = populatedTemplate;
            //making sure the router can recognize this call
            const infoLink = tile.querySelector('a');
            if (infoLink) {
                infoLink.setAttribute('data-link', '');
                infoLink.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (module.Id) {
                        localStorage.setItem(`module-${module.Id}`, JSON.stringify(module));
                    }
                    const popupElement = document.querySelector('.popup-overlay');
                    if (popupElement) {
                        popupElement.remove();
                        document.removeEventListener('click', this._handleOutsideClick);
                    }
                });
            }

            tile.addEventListener('click', (event) => {
                const clickedElement = event.target;
                if (clickedElement.closest('a')) {
                    return;
                }
                this.onModuleSelect(module);
            });

            container.appendChild(tile);
        });
        return container;
    }
}
