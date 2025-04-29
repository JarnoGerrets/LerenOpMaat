import loadTemplate from "./loadTemplate.js";
import { getModule } from "../../client/api-client.js";
import confirmationPopup from "../views/partials/confirmation-popup.js";

export default async function initModuleInfo(id) {

    const CardContainer = document.getElementById('card-column');
    const textArea = document.getElementById('moduleTextArea');
    textArea.readOnly = true;

    const path = window.location.pathname;
    const pathParts = path.split('/');
    const moduleId = pathParts[2];
    let savedModule = JSON.parse(localStorage.getItem(`module-${moduleId}`))

    if (!savedModule) {
        console.log('Module data not found in localStorage, fetch from DB...');
        savedModule = await getModule(moduleId);

    }
    const template = await loadTemplate('../templates/module-card.html');
    const populatedTemplate = template
        .replace('{{id}}', savedModule.Id)
        .replace('{{card_text}}', savedModule.Description)
        .replace('{{title}}', savedModule.Name)
        .replace('{{link}}', '');

    const tile = document.createElement('div');
    tile.classList.add('module-tile');
    tile.innerHTML = populatedTemplate;

    CardContainer.appendChild(tile);

    const template2 = await loadTemplate('../templates/module-card.html');
    const populatedTemplate2 = template2
        .replace('{{id}}', savedModule.id)
        .replace('{{card_text}}', 'Nog niet bekend')
        .replace('{{title}}', 'Ingangseisen')
        .replace('{{link}}', '');
    const tile2 = document.createElement('div');
    tile2.classList.add('module-tile', 'ingangseisen-tile');
    tile2.innerHTML = populatedTemplate2;
    const correctRole = true;
    if (correctRole) {
        const extraButtonsDiv = document.createElement("div");
        extraButtonsDiv.id = "extra-buttons";
        extraButtonsDiv.className = "extra-module-buttons";

        const editButton = document.createElement("a");
        editButton.href = "/";
        editButton.className = "bi bi-pencil-square edit-button";
        editButton.title = "Bewerken";

        const trashButton = document.createElement("a");
        trashButton.className = "bi bi-trash trash-button";
        trashButton.title = "Verwijderen";
        trashButton.addEventListener('click', async () => {
            await confirmationPopup(savedModule.Id);
        });


        extraButtonsDiv.appendChild(editButton);
        extraButtonsDiv.appendChild(trashButton);

        document.querySelector(".buttons-container-module-info").appendChild(extraButtonsDiv);
    }
    CardContainer.appendChild(tile2);



    window.addEventListener('beforeunload', handleUnload);
    window.addEventListener('popstate', handleUnload);

    function handleUnload() {
        localStorage.removeItem(`module-${moduleId}`);
    }
}
