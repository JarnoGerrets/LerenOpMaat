import { getModule } from "../../client/api-client.js";
import { setupButtons } from './module-actions.js';
import '../components/module-card.js';
import '../components/requirements-card.js';

export default async function initModuleInfo(id) {

    // role based selection of modules, when student opens do not show inactive modules, when docent does show them
    const correctRole = true;
    const CardContainer = document.getElementById('card-column');
    const textArea = document.getElementById('moduleTextArea');
    textArea.readOnly = true; // by default it's not editable to prevent issues (not secure but without saving options not a real issue)

    const path = window.location.hash;
    const pathParts = path.split('/');
    const moduleId = pathParts[1];
    let savedModule = JSON.parse(localStorage.getItem(`module-${moduleId}`));

    if (!savedModule) {
        savedModule = await getModule(moduleId);
    }

    // Create Module Info Card 
    const infoCard = document.createElement('module-card');
    infoCard.data = {module: savedModule};
    CardContainer.appendChild(infoCard);

    // Create Requirements Card
    const reqCard = document.createElement('requirements-card');
    reqCard.moduleId = savedModule.Id;
    reqCard.refreshCallback = async () => {
        const module = await getModule(moduleId);
        reqCard.requirements = module.Requirements;
    };
    reqCard.requirements = savedModule.Requirements;

    CardContainer.appendChild(reqCard);

    textArea.value = savedModule.Description;
    textArea.addEventListener('scroll', () => {
        textArea.classList.add('scrolling');
        clearTimeout(textArea._scrollTimer);
        textArea._scrollTimer = setTimeout(() => {
            textArea.classList.remove('scrolling');
        }, 700);
    });

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
