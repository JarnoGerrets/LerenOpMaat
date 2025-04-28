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
            if (module.id) {
                link = `<a href="/Module/${module.id}" class="material-icons module-icon" title="Go to ${module.description}">
                    i
                </a>`;
            }
            const populatedTemplate = template
                .replace('{{id}}', module.id)
                .replace('{{card_text}}', module.description)
                .replace('{{title}}', module.name)
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
                    if (module.id) {
                        localStorage.setItem(`module-${module.id}`, JSON.stringify(module));
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
