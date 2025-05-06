import loadTemplate from "../scripts/loadTemplate.js";

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
                        Periode: <span id="periode-text">${module.Periode}</span>
                        </div>
                    </div>
                    <div>
                        <div class="module-info-row">
                        EC: <span id="ec-text">${module.Ec}</span>
                        </div>
                        <div class="module-info-row">
                        Niveau: <span id="niveau-text">${module.Niveau}</span>
                        </div>
                    </div>
                </div>`;
            }
            const populatedTemplate = template
                .replace('{{id}}', module.Id)
                .replace('{{card_text}}', cardText)
                .replace('{{title}}', module.Name)
                .replace('{{link}}', link);

            const tile = document.createElement('div');
            tile.classList.add('module-tile');
            tile.id = 'module-{{id}}';
            tile.innerHTML = populatedTemplate;
            //making sure the router can recognize this call
            const infoLink = tile.querySelector('a');
            if (infoLink) {
                infoLink.setAttribute('data-link', '');
                infoLink.addEventListener('click', () => {
                    if (module.Id) {
                        localStorage.setItem(`module-${module.Id}`, JSON.stringify(module));
                    }
                });
            }

            tile.addEventListener('click', () => {
                this.onModuleSelect(module);
            });

            container.appendChild(tile);
        });
        return container;
    }
}
