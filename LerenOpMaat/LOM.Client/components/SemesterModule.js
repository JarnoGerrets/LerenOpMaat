export default class SemesterModule {
    constructor(modules, onModuleSelect, onUnassign = null) { // onUnassign is optioneel
        this.modules = modules;
        this.onModuleSelect = onModuleSelect;
        this.onUnassign = onUnassign; // Callback voor reset
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
            moduleName.textContent = module.description;
            tile.appendChild(moduleName);

            const unassignIcon = document.createElement('span');
            unassignIcon.classList.add('material-icons', 'module-icon');
            unassignIcon.textContent = 'X';
            unassignIcon.title = `Module ${module.description} ontkoppelen`;
            tile.appendChild(unassignIcon);

            const infoIcon = document.createElement('span');
            infoIcon.classList.add('material-icons', 'module-icon');
            infoIcon.textContent = 'i';
            infoIcon.title = `ga naar ${module.description}`;
            tile.appendChild(infoIcon);

            const moduleDescription = document.createElement('p');
            moduleDescription.textContent = module.name;
            tile.appendChild(moduleDescription);

            tile.addEventListener('click', () => {
                this.onModuleSelect(module);
            });

            // Eventlistener voor unassign
            unassignIcon.addEventListener('click', (event) => {
                event.stopPropagation(); // Voorkomt dat de click op de tile wordt getriggerd
                this.onUnassign(); // Roep de onUnassign callback aan
            });

            container.appendChild(tile);
        });

        return container;
    }
}
