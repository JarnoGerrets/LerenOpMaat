export default class SemesterModule {
    constructor(modules) {
        this.modules = modules;
    }

    render() {
        const container = document.createElement('div');
        container.classList.add('module-container');

        this.modules.forEach(module => {
            const tile = document.createElement('div');
            tile.classList.add('module-tile');

            const moduleName = document.createElement('h1');
            moduleName.classList.add('module-title');
            moduleName.textContent = module.description;
            tile.appendChild(moduleName);

            const infoIcon = document.createElement('span');
            infoIcon.classList.add('material-icons', 'module-icon');
            infoIcon.textContent = 'i';
            infoIcon.title = 'ga naar ' + module.description;
            tile.appendChild(infoIcon);

            const moduleDescription = document.createElement('p');
            moduleDescription.textContent = module.name;
            tile.appendChild(moduleDescription);

            container.appendChild(tile);
        });

        return container;
    }
}
