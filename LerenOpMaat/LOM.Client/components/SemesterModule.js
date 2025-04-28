export default class SemesterModule {
    constructor(modules, onModuleSelect) {
        this.modules = modules;
        this.onModuleSelect = onModuleSelect;
    }

    async render() {
        const container = document.createElement('div');
        container.classList.add('module-container');
        container.id = 'popup-module-container';

        const template = await this.loadTemplate();

        this.modules.forEach(module => {
            const populatedTemplate = template
                .replace('{{id}}', module.id)
                .replace('{{description}}', module.description)
                .replace('{{name}}', module.name);

            const tile = document.createElement('div');
            tile.classList.add('module-tile');
            tile.id = 'module-{{id}}';
            tile.innerHTML = populatedTemplate;
            //making sure the router can recognize this call
            const infoLink = tile.querySelector('a');
            if (infoLink) {
                infoLink.setAttribute('data-link', '');
            }

            tile.addEventListener('click', () => {
                this.onModuleSelect(module);
            });

            container.appendChild(tile);
        });
        return container;
    }

    async loadTemplate() {
        const response = await fetch('../templates/module-card.html');
        const template = await response.text();
        return template;
    }
}
