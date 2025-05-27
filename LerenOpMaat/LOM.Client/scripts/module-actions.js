import confirmationPopup from "../views/partials/confirmation-popup.js";
import { mapPeriodToPresentableString } from "./utils/presentationMapper.js"; 
import { updateModule } from "../../client/api-client.js";
import { deleteModule } from "../client/api-client.js";

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
        await confirmationPopup(module.Name, 'module', async () => {
            await deleteModule(module.Id);
            window.location.href = "#module-overview";
        });
    });
    return trashButton;
}

function ToggleFields(module) {
    const codeText = document.getElementById("code-text");
    const periodText = document.getElementById("period-text");
    const ecText = document.getElementById("ec-text");
    const levelText = document.getElementById("level-text");
    const addRequirementButton = document.getElementById("add-requirement-button");
    const requirementActions = document.querySelectorAll(".requirement-actions");

    if (codeText.querySelector("input")) {
        module.Code = document.getElementById("code-input").value;
        module.Period = document.getElementById("period-input").value;
        module.Ec = document.getElementById("ec-input").value;
        module.Level = document.getElementById("level-input").value;

        codeText.innerHTML = `${module.Code}`;
        periodText.innerHTML = `${mapPeriodToPresentableString(module.Period)}`;
        ecText.innerHTML = `${module.Ec}`;
        levelText.innerHTML = `${module.Level}`;
        addRequirementButton.style.display = "none";
        requirementActions.forEach(action => {
            action.style.display = "none";
        });
    } else {
        codeText.innerHTML = `
        <div><input class="card-input" type="text" id="code-input" value="${module.Code}"></div>
        `;

        let optionsPeriod = '';
        for (let i = 1; i <= 3; i++) {
            optionsPeriod += `<option value="${i}" ${module.Period === i ? 'selected' : ''}>${mapPeriodToPresentableString(i)}</option>`;
        }
        periodText.innerHTML = `
        <div><select class="card-input" id="period-input">
          ${optionsPeriod}
        </select>
        </div>
        `;

        ecText.innerHTML = `
        <div><input class="card-input" type="number" id="ec-input" value="${module.Ec}"></div>
        `;

        let optionsLevel = '';
        for (let i = 1; i <= 3; i++) {
            optionsLevel += `<option value="${i}" ${module.Level === i ? 'selected' : ''}>${i}</option>`;
        }
        levelText.innerHTML = `
        <div><select class="card-input" id="level-input">
          ${optionsLevel}
        </select></div>
      `;

        addRequirementButton.style.display = "flex";
        requirementActions.forEach(action => {
            action.style.display = "flex";
        });
    }
}

async function saveChanges(module, textArea) {

    module.Code = document.getElementById("code-input").value;
    module.Period = document.getElementById("period-input").value;
    module.Ec = document.getElementById("ec-input").value;
    module.Level = document.getElementById("level-input").value;
    module.Description = textArea.value;
    module.GraduateProfile = module.GraduateProfile;
    const response = await updateModule(module.Id, module);
    showToast(`${module.Name} succesvol gewijzigd`, 'success');
}