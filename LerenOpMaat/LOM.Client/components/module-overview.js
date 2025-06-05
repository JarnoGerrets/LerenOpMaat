// module-overview.js

// Import required APIs and components
import { getModules, getProfiles } from '../client/api-client.js';
import addModulePopup from '../views/partials/add-module-popup.js';
import './module-card.js';

// Define a custom element for the module overview
class ModuleOverview extends HTMLElement {
    constructor() {
        super();
    }

    // Lifecycle hook when element is added to the DOM
    async connectedCallback() {
        this.renderLayout();      // Render static layout
        this.addHandlers();       // Attach event handlers

        const modules = await getModules();  // Fetch initial module list
        this.renderModules(modules);         // Render module cards
    }

    // Renders the HTML layout for the module overview page
    renderLayout() {
        this.innerHTML = `
            <div class="container my-5">
                <div id="top-section-module-overview">
                    <h1 class="module-overview-title">Module Overzicht</h1>
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

    // Adds interactivity and handlers for search, adding modules, and legend
    async addHandlers() {
        // Search functionality
        const input = this.querySelector('#searchInput');
        input.addEventListener('input', async (e) => {
            const query = e.target.value;
            const filteredModules = await getModules(query);
            this.renderModules(filteredModules);
        });

        // Check if user has permissions to add modules
        let userData = await window.userData;

        if (userData && userData.EffectiveRole !== 'Student') {
            // Show and handle "Add Module" button
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

        // Create and display legend tooltip from profile data
        const profiles = await getProfiles();
        const profileString = profiles.map(i =>
            `<p style="display: flex; align-items: center; margin: 4px 0;">
                <span style="display: inline-block; width: 16px; height: 16px; border-radius: 4px; background: ${i.ColorCode}; margin-right: 8px; border: 1px solid #ccc;"></span>
                ${i.Name}
            </p>`
        ).join("");

        const button = this.querySelector("#legendButton");

        // Tooltip setup
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

        // Toggle tooltip on legend button click
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

        // Close tooltip when clicking outside
        document.addEventListener("click", (e) => {
            if (!button.contains(e.target) && !tooltip.contains(e.target)) {
                tooltip.style.display = "none";
                isOpen = false;
            }
        });
    }

    // Renders module cards inside the wrapper
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

// Register the custom element
customElements.define('module-overview', ModuleOverview);
