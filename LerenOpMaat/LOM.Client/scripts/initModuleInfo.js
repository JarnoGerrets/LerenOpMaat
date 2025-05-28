import { getModule, existenceModule } from "../../client/api-client.js";
import { setupButtons } from './module-actions.js';
import '../components/module-card.js';
import '../components/requirements-card.js';

export default async function initModuleInfo(id) {

    let userData = await window.userData;
    let tries = 0;
    let correctRole = false;

    if (userData && userData?.Role !== "Student") {
        correctRole = true;
    }
    const CardContainer = document.getElementById('card-column');
    const textArea = document.getElementById('moduleTextArea');
    textArea.readOnly = true; // by default it's not editable to prevent issues (not secure but without saving options not a real issue)

    const path = window.location.hash;
    const pathParts = path.split('/');
    const moduleId = pathParts[1];
    let canBeDeleted;
    let module = await getModule(moduleId);

    if (module && correctRole) {
        canBeDeleted = !(await existenceModule(moduleId)); // Check if the module is not used in any route. outcome is flipped to use for toggling the delete button
    }


    // Create Module Info Card 
    const infoCard = document.createElement('module-card');
    infoCard.data = { module: module };
    CardContainer.appendChild(infoCard);

    // Create Requirements Card
    const reqCard = document.createElement('requirements-card');
    reqCard.moduleId = module.Id;
    reqCard.refreshCallback = async () => {
        const module = await getModule(moduleId);
        reqCard.requirements = module.Requirements;
    };
    reqCard.requirements = module.Requirements;

    CardContainer.appendChild(reqCard);

    textArea.value = module.Description;
    textArea.addEventListener('scroll', () => {
        textArea.classList.add('scrolling');
        clearTimeout(textArea._scrollTimer);
        textArea._scrollTimer = setTimeout(() => {
            textArea.classList.remove('scrolling');
        }, 700);
    });

    // Add admin buttons for editing and deleting
    if (correctRole) {
        setupButtons(module, textArea, canBeDeleted);
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
