import loadTemplate from "./loadTemplate.js";
import { getModule } from "../../client/api-client.js";
import { createModuleInfoCard, createRequirementsCard } from '../components/module-cards.js';
import { setupButtons } from './module-actions.js';

export default async function initModuleInfo(id) {
    const correctRole = true;
    const CardContainer = document.getElementById('card-column');
    const textArea = document.getElementById('moduleTextArea');
    textArea.readOnly = true; // by default it's not editable to prevent issues (not secure but without saving options not a real issue)

    const path = window.location.hash;
    console.log(path);
    const pathParts = path.split('/');
    const moduleId = pathParts[1];
    let savedModule = JSON.parse(localStorage.getItem(`module-${moduleId}`));

    if (!savedModule) {
        console.log('Module data not found in localStorage, fetch from DB...');
        savedModule = await getModule(moduleId);
        console.log(savedModule);
    }

    // Create Module Info Card
    const infoCardText = createModuleInfoCard(savedModule);
    const populatedTemplate = await loadTemplate('../templates/module-card.html');
    const populatedModuleCard = populatedTemplate
        .replace('{{id}}', savedModule.Id)
        .replace('{{card_text}}', infoCardText)
        .replace('{{title}}', savedModule.Name)
        .replace('{{link}}', '');

    const tile = document.createElement('div');
    tile.classList.add('module-tile');
    tile.innerHTML = populatedModuleCard;
    CardContainer.appendChild(tile);

    // Create Requirements Card
    const reqCardText = createRequirementsCard(savedModule.Requirements);
    const populatedTemplate2 = populatedTemplate
        .replace('{{id}}', savedModule.id)
        .replace('{{card_text}}', reqCardText)
        .replace('{{title}}', 'Ingangseisen')
        .replace('{{link}}', '');
    const tile2 = document.createElement('div');
    tile2.classList.add('module-tile', 'ingangseisen-tile');
    tile2.style.fontWeight = 'bold';
    tile2.innerHTML = populatedTemplate2;
    CardContainer.appendChild(tile2);

    // Add admin buttons for editing and deleting
    if (correctRole) {
        setupButtons(savedModule, textArea);
    }

    // Clear localStorage on unload
    window.addEventListener('beforeunload', handleUnload);
    window.addEventListener('popstate', handleUnload);

    function handleUnload() {
        localStorage.removeItem(`module-${moduleId}`);
    }
}
