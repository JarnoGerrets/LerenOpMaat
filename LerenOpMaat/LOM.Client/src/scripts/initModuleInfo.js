import { getModule } from "../client/api-client.js";
import { setupButtons } from './module-actions.js';
import '../components/module-card.js';
import '../components/requirements-card.js';

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
    const infoCard = document.createElement('module-card');
    infoCard.data = {module: savedModule};
    CardContainer.appendChild(infoCard);

    // Create Requirements Card
    const reqCard = document.createElement('requirements-card');
    reqCard.data = savedModule.Requirements;
    CardContainer.appendChild(reqCard);

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

    document.getElementById("go-back-button").addEventListener("click", () => {
        history.back();
    });
}
