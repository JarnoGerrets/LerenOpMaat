import confirmationPopup from "../views/partials/confirmation-delete-popup.js";
import { updateModule } from "../../client/api-client.js";

export function setupButtons(module, textArea) {
    let editButton = setupEditButton(module, textArea)
    let trashButton = setupDeleteButton(module)

    const extraButtonsDiv = document.createElement("div");
    extraButtonsDiv.id = "extra-buttons";
    extraButtonsDiv.className = "extra-module-buttons";

    extraButtonsDiv.appendChild(editButton);
    extraButtonsDiv.appendChild(trashButton);
    document.querySelector(".buttons-container-module-info").appendChild(extraButtonsDiv);
}


// Setup the edit button
function setupEditButton(module, textArea) {
    const editButton = document.createElement("a");
    editButton.className = "bi bi-pencil-square edit-button";
    editButton.title = "Bewerken";
    let isEditing = false;
    editButton.addEventListener('click', async () => {
        if (isEditing) return;
        isEditing = true;
        textArea.readOnly = false;
        ToggleFields(module);

        const buttonContainerEdit = document.createElement('div');
        buttonContainerEdit.classList.add("button-container-edit");

        const saveButton = document.createElement("button");
        saveButton.classList.add("circle-button", "blue", "save-button");
        saveButton.title = "Opslaan";
        saveButton.innerHTML = '<i class="bi bi-save"></i>';
        saveButton.addEventListener('click', async () => {
            // i have to write save logic here

            saveChanges(module, textArea);
            ToggleFields(module)
            textArea.readOnly = true;
            isEditing = false;
            buttonContainerEdit.remove();
        });

        const cancelButton = document.createElement("button");
        cancelButton.classList.add("circle-button", "red", "cancel-button");
        cancelButton.title = "Annuleren";
        cancelButton.innerHTML = '<i class="bi bi-x-lg"></i>';
        cancelButton.addEventListener('click', () => {
            ToggleFields(module);
            textArea.readOnly = true;
            isEditing = false;
            buttonContainerEdit.remove();
        });

        const textAreaContainer = document.createElement("div");
        textAreaContainer.classList.add("text-area-container");

        buttonContainerEdit.appendChild(saveButton);
        buttonContainerEdit.appendChild(cancelButton);

        textAreaContainer.appendChild(textArea);
        textAreaContainer.appendChild(buttonContainerEdit);


        document.getElementById('description-text').innerHTML = '';
        document.getElementById('description-text').appendChild(textAreaContainer);
    });

    return editButton;
}

// Setup the delete button
function setupDeleteButton(module) {
    const trashButton = document.createElement("a");
    trashButton.className = "bi bi-trash trash-button";
    trashButton.title = "Verwijderen";
    trashButton.addEventListener('click', async () => {
        await confirmationPopup(module.Id, module.Name);
    });
    return trashButton;
}


function ToggleFields(module) {
    const codeText = document.getElementById("code-text");
    const periodeText = document.getElementById("periode-text");
    const ecText = document.getElementById("ec-text");
    const niveauText = document.getElementById("niveau-text");

    if (codeText.querySelector("input")) {
        module.Code = document.getElementById("code-input").value;
        module.Periode = document.getElementById("periode-input").value;
        module.Ec = document.getElementById("ec-input").value;
        module.Niveau = document.getElementById("niveau-input").value;

        codeText.innerHTML = `${module.Code}`;
        periodeText.innerHTML = `${module.Periode}`;
        ecText.innerHTML = `${module.Ec}`;
        niveauText.innerHTML = `${module.Niveau}`;
    } else {
        codeText.innerHTML = `
        <div><input class="card-input" type="text" id="code-input" value="${module.Code}"></div>
        `;

        let optionsPeriod = '';
        for (let i = 1; i <= 2; i++) {
            optionsPeriod += `<option value="${i}" ${module.Periode === i ? 'selected' : ''}>${i}</option>`;
        }
        periodeText.innerHTML = `
        <div><select class="card-input" id="periode-input">
          ${optionsPeriod}
        </select>
        </div>
        `;

        ecText.innerHTML = `
        <div><input class="card-input" type="number" id="ec-input" value="${module.Ec}"></div>
        `;

        let optionsNiveau = '';
        for (let i = 1; i <= 3; i++) {
            optionsNiveau += `<option value="${i}" ${module.Niveau === i ? 'selected' : ''}>${i}</option>`;
        }
        niveauText.innerHTML = `
        <div><select class="card-input" id="niveau-input">
          ${optionsNiveau}
        </select></div>
      `;
    }
}

async function saveChanges(module, textArea) {

    module.Code = document.getElementById("code-input").value;
    module.Periode = document.getElementById("periode-input").value;
    module.Ec = document.getElementById("ec-input").value;
    module.Niveau = document.getElementById("niveau-input").value;
    module.Description = textArea.value;
    module.GraduateProfile = module.GraduateProfile;
    console.log(module);
    const response = await updateModule(module.Id, module);
    showToast(`${module.Name} succesvol gewijzigd`, 'success');

}





