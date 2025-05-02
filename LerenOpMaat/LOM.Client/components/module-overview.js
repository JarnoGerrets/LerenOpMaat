// module-overview.js
import { getModules } from '../client/api-client.js';
import './module-card.js';

class ModuleOverview extends HTMLElement {
    constructor() {
        super();
    }

    async connectedCallback() {
        const modules = await getModules();
        this.render(modules);
    }

    render(modules) {
        this.innerHTML = `
            <div class="container my-5">
                <h1>Module Overview</h1>
                <div class="row" id="module-wrapper"></div>
            </div>
        `;

        const wrapper = this.querySelector('#module-wrapper');
        modules.forEach(mod => {
            const card = document.createElement('module-card');
            card.data = mod;
            wrapper.appendChild(card);
        });
    }
}

customElements.define('module-overview', ModuleOverview);
