export default class SemesterModule {
    constructor(modules, onModuleSelect) {
        this.modules = modules;
        this.onModuleSelect = onModuleSelect;
    }

    render() {
        const container = document.createElement('div');
        container.classList.add('module-container');
        container.id = 'popup-module-container';

        this.modules.forEach(module => {
            const tile = document.createElement('div');
            tile.classList.add('module-tile');

            const moduleName = document.createElement('h1');
            moduleName.classList.add('module-title');
            moduleName.textContent = module.Name;
            tile.appendChild(moduleName);

            const infoIcon = document.createElement('span');
            infoIcon.classList.add('material-icons', 'module-icon');
            infoIcon.textContent = 'i';
            infoIcon.title = `ga naar ${module.Description}`;
            tile.appendChild(infoIcon);

            const moduleDescription = document.createElement('p');
            moduleDescription.textContent = module.name;
            tile.appendChild(moduleDescription);

            tile.addEventListener('click', () => {
                this.onModuleSelect(module);
            });

            container.appendChild(tile);
        });

        return container;
    }
}
