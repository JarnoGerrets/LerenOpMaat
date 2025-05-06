// module-overview.js
import { getModules } from '../client/api-client.js';
import addModulePopup from '../views/partials/add-module-popup.js';
import './module-card.js';

class ModuleOverview extends HTMLElement {
    constructor() {
        super();
    }

    async connectedCallback() {
        this.renderLayout();
        this.addHandlers();

        const modules = await getModules();
        this.renderModules(modules);
    }

    renderLayout() {
        this.innerHTML = `
            <div class="container my-5">
                <div id="top-section-module-overview">
                    <h1 class="module-overview-title">Module Overview</h1>
                    <div id="add-module-button">
                        <i class="bi bi-plus-circle"></i><span class="icon-text-module-overview">Module toevoegen</span>
                    </div>
                </div>
                <input class="form-control" id="searchInput" type="text" placeholder="Type om te zoeken">
                <div class="row" id="module-wrapper"></div>
            </div>
        `;
    }

    async addHandlers() {
        //search handler
        const input = this.querySelector('#searchInput');
        input.addEventListener('input', async (e) => {
            const query = e.target.value;
            const filteredModules = await getModules(query);
            this.renderModules(filteredModules);
        });

        //add module handler
        const addModuleInput = this.querySelector('#add-module-button');
        addModuleInput.addEventListener('click', async () => {
            const success = await addModulePopup();
            if (success) {
                const modules = await getModules();
                this.renderModules(modules);
            }
        });
    }

    renderModules(modules) {
        const wrapper = this.querySelector('#module-wrapper');
        wrapper.innerHTML = ''; // Clear old cards

        modules.forEach(mod => {
            const card = document.createElement('module-card');
            card.classList.add("col-12", "col-md-6", "col-lg-4", "p-4");
            card.data = { module: mod, showInfoIcon: true };
            wrapper.appendChild(card);
        });
    }
}

customElements.define('module-overview', ModuleOverview);
