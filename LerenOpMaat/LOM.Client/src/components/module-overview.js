// module-overview.js
import { getModules } from '../client/api-client.js';
import './module-card.js';

class ModuleOverview extends HTMLElement {
    constructor() {
        super();
    }

    async connectedCallback() {
        this.renderLayout();
        this.addSearchHandler();

        const modules = await getModules();
        this.renderModules(modules);
    }

    renderLayout() {
        this.innerHTML = `
            <div class="container my-5">
                <h1>Module Overview</h1>
                <input class="form-control" id="searchInput" type="text" placeholder="Type om te zoeken">
                <div class="row" id="module-wrapper"></div>
            </div>
        `;
    }

    async addSearchHandler() {
        const input = this.querySelector('#searchInput');
        input.addEventListener('input', async (e) => {
            const query = e.target.value;
            const filteredModules = await getModules(query);
            this.renderModules(filteredModules);
        });
    }

    renderModules(modules) {
        const wrapper = this.querySelector('#module-wrapper');
        wrapper.innerHTML = ''; // Clear old cards

        modules.forEach(mod => {
            const card = document.createElement('module-card');
            card.classList.add("col-12", "col-md-6", "col-lg-4", "p-4");
            card.data = mod;
            wrapper.appendChild(card);
        });
    }
}

customElements.define('module-overview', ModuleOverview);
