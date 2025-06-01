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

        let userData = await window.userData;

        if (userData) {
            if (userData.EffectiveRole != 'Student') {
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
        const profileString = profiles.map(i =>
            `<p style="display: flex; align-items: center; margin: 4px 0;">
      <span style="display: inline-block; width: 16px; height: 16px; border-radius: 4px; background: ${i.ColorCode}; margin-right: 8px; border: 1px solid #ccc;"></span>
      ${i.Name}
   </p>`
        ).join("");

        const button = this.querySelector("#legendButton");

        const tooltip = document.createElement("div");
        tooltip.classList.add("legend-tooltip");
        tooltip.style.position = "absolute";
        tooltip.style.display = "none";
        tooltip.style.zIndex = "999";
        tooltip.style.padding = "10px";
        tooltip.style.border = "1px solid #ccc";
        tooltip.style.background = "white";
        tooltip.innerHTML = profileString;

        document.body.appendChild(tooltip);

        let isOpen = false;

        button.addEventListener("click", (e) => {
            e.stopPropagation();
            isOpen = !isOpen;
            if (isOpen) {
                const rect = button.getBoundingClientRect();
                tooltip.style.left = `${rect.left + 40}px`;
                tooltip.style.top = `${rect.bottom + 5}px`;
                tooltip.style.display = "block";
            } else {
                tooltip.style.display = "none";
            }
        });

        document.addEventListener("click", (e) => {
            if (!button.contains(e.target) && !tooltip.contains(e.target)) {
                tooltip.style.display = "none";
                isOpen = false;
            }
        });

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
