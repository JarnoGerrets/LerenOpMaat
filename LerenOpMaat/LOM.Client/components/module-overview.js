// module-overview.js
import { getModules, getProfiles } from '../client/api-client.js';
import addModulePopup from '../views/partials/add-module-popup.js';
import Popup from "./Popup.js";
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
                    <div class="d-flex">
                        <div id="add-module-button" style="display: none;">
                            <i class="bi bi-plus-circle"></i><span class="icon-text-module-overview">Module toevoegen</span>
                        </div>
                        <i class="bi bi-list legend" id="legendButton"></i>
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

        let userData = null;

        userData = JSON.parse(localStorage.getItem("userData"));
        if (userData) {
            if (userData.Roles != 'Student') {
                //add module handler        
                const addModuleInput = this.querySelector('#add-module-button');
                addModuleInput.style.display = 'flex';
                addModuleInput.addEventListener('click', async () => {
                    const success = await addModulePopup();
                    if (success) {
                        const modules = await getModules();
                        this.renderModules(modules);
                    }
                });
            }
        }

        const profiles = await getProfiles();
        const profileString = profiles.map(i => `<p><span style="background: ${i.ColorCode}"></span> ${i.Name}</p>`).join("")

        this.querySelector("#legendButton").addEventListener("click", () => {
            new Popup({
                extraButtons: false,
                header: `Legenda`,
                sizeCloseButton: 18,
                content: `
                    <div class="legend-wrapper" style="width: 500px; padding: 20px">
                        ${profileString}
                    </div>
                `
            }).open();
        })
        
    }

    renderModules(modules) {
        const wrapper = this.querySelector('#module-wrapper');
        wrapper.innerHTML = '';

        modules.forEach(mod => {
            const card = document.createElement('module-card');
            card.classList.add("col-12", "col-md-6", "col-lg-4", "p-4");
            card.data = { module: mod, showInfoIcon: true };
            wrapper.appendChild(card);
        });
    }
}

customElements.define('module-overview', ModuleOverview);
