import { moduleActionsServices} from "../importServiceProvider.js";
import { getProfiles} from "../../../client/api-client.js";


export function setupButtons(module, textArea, canBeDeleted = false, services = moduleActionsServices) {
    const{
        updateModule,
        activateModule,
        deactivateModule,
        deleteModule,
        setupListeners,
        getSelectedEVLs,
        updateEvlSelectionHeader,
        mapPeriodToPresentableString
    } = services;

    let editButton = setupEditButton(module, textArea, services)
    let deactivateButton = setupDeactivationButton(module, services)
    let activateButton = setupActivationButton(module, services);
    let trashButton = setupDeleteButton(module, services);

    const extraButtonsDiv = document.createElement("div");
    extraButtonsDiv.id = "extra-buttons";
    extraButtonsDiv.className = "extra-module-buttons";

    extraButtonsDiv.appendChild(editButton);
    if (!module.IsActive) {
        extraButtonsDiv.appendChild(activateButton);
    } else {
        extraButtonsDiv.appendChild(deactivateButton);
    }
    if (canBeDeleted) {
        extraButtonsDiv.appendChild(trashButton);
    }
    document.querySelector(".buttons-container-module-info").appendChild(extraButtonsDiv);
}


// Setup the edit button
function setupEditButton(module, textArea, services) {

    const editButton = document.createElement("a");
    editButton.className = "bi bi-pencil-square edit-button";
    editButton.title = "Bewerken";
    let isEditing = false;
    editButton.addEventListener('click', async () => {
        if (isEditing) return;
        isEditing = true;
        textArea.readOnly = false;
        ToggleFields(module, services);

        const buttonContainerEdit = document.createElement('div');
        buttonContainerEdit.classList.add("button-container-edit");

        const saveButton = document.createElement("button");
        saveButton.classList.add("circle-button", "blue", "save-button");
        saveButton.title = "Opslaan";
        saveButton.innerHTML = '<i class="bi bi-save"></i>';
        saveButton.addEventListener('click', async () => {
            saveChanges(module, textArea, services);
            ToggleFields(module, services)
            textArea.readOnly = true;
            isEditing = false;
            buttonContainerEdit.remove();
        });

        const cancelButton = document.createElement("button");
        cancelButton.classList.add("circle-button", "red", "cancel-button");
        cancelButton.title = "Annuleren";
        cancelButton.innerHTML = '<i class="bi bi-x-lg"></i>';
        cancelButton.addEventListener('click', () => {
            ToggleFields(module, services);
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

const header = `
            <h3 class="popup-header-confirmation">
                Deactiveren module
            </h3>
        `;
function createContent(name, action){
return `<div class="confirmation-popup-content">
            <p>Weet u zeker dat u ${name} wilt ${action}?</p>
            <div class="confirmation-popup-buttons"> 
                <button id="confirm-confirmation-popup" class="confirmation-accept-btn">Ja</button>
                <button id="cancel-confirmation-popup"" class="confirmation-deny-btn">Nee</button>
                </div>
            </div>`;
}

// Setup the activation button
function setupActivationButton(module, services) {
    const{
        confirmationPopup,
        activateModule
    } = services;
    const deactivateButton = document.createElement("a");
    deactivateButton.className = "bi bi-eye activation-button";
    deactivateButton.title = "Activeren";
    deactivateButton.addEventListener('click', async () => {
        await confirmationPopup(module.Name, module.Id, header, createContent(module.Name, "activeren"), activateModule, `#Module/${module.Id}`, async () => {
            window.location.href = "#module-overview";
        });
    });
    return deactivateButton;
}

// Setup the deactivation button
function setupDeactivationButton(module, services) {
    const{
        confirmationPopup,
        deactivateModule
    }= services;
    const deactivateButton = document.createElement("a");
    deactivateButton.className = "bi bi-eye-slash deactivation-button";
    deactivateButton.title = "Deactiveren";
    deactivateButton.addEventListener('click', async () => {
        await confirmationPopup(module.Name, module.Id, header, createContent(module.Name, "deactiveren"), deactivateModule, `#Module/${module.Id}`, async () => {
            window.location.href = "#module-overview";
        });
    });
    return deactivateButton;
}

// Setup the delete button
function setupDeleteButton(module, services) {
    const{
        confirmationPopup,
        deleteModule
    } = services;
    const trashButton = document.createElement("a");
    trashButton.className = "bi bi-trash trash-button";
    trashButton.title = "Verwijderen";
    trashButton.addEventListener('click', async () => {
        await confirmationPopup(module.Name, module.Id, header, createContent(module.Name, "verwijderen"), deleteModule, "#module-overview", async () => {
            window.location.href = "#module-overview";
        });
    });
    return trashButton;
}

function ToggleFields(module, services) {
    const{
        mapPeriodToPresentableString,
        updateEvlSelectionHeader,
        setupListeners,
        getSelectedEVLs
    } = services;
    const codeText = document.getElementById("code-text");
    const periodText = document.getElementById("period-text");
    const graduateText = document.getElementById("graduate-text");
    
    const ecText = document.getElementById("ec-text");
    const levelText = document.getElementById("level-text");
    const addRequirementButton = document.getElementById("add-requirement-button");
    const requirementActions = document.querySelectorAll(".requirement-actions");

    if (codeText.querySelector("input")) {
        module.Code = document.getElementById("code-input").value;
        module.Period = document.getElementById("period-input").value;
        module.Level = document.getElementById("level-input").value;

        const { totalEC } = getSelectedEVLs(module.Evls || []);
        module.Ec = totalEC;

        codeText.innerHTML = `${module.Code}`;
        periodText.innerHTML = `${mapPeriodToPresentableString(module.Period)}`;
        graduateText.innerHTML = `${module.GraduateProfile.Name}`;
        levelText.innerHTML = `${module.Level}`;
        ecText.innerHTML = `${module.Ec}`;
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
        <div>
                            <div class="dropdown-wrapper">
                                <div id="evl-dropdown-toggle" class="dropdown-toggle toggle-info-page"><span id="evlSelectionHeader">${module.Ec}</span></div>
                                <div id="evl-dropdown-menu" class="dropdown-menu hidden">
                                    <label class="evl-option checkbox-wrapper-30">
                                            <span class="checkbox" style="margin-right: 15px;">
                                                <input type="checkbox" 
                                                    class="checkbox" 
                                                name="evl" value="EVL 1">
                                                <svg>
                                                    <use xlink:href="#checkbox-30" class="checkbox"></use>
                                                </svg>
                                            </span>
                                        <span class="checkboxLabel">EVL 1</span>
                                        <input type="number" name="ec-evl 1" class="ec-input" placeholder="EC" min="0"> 
                                    </label>
                                    <label class="evl-option checkbox-wrapper-30">
                                            <span class="checkbox" style="margin-right: 15px;">
                                                <input type="checkbox" 
                                                    class="checkbox" 
                                                name="evl" value="EVL 2"}>
                                                <svg>
                                                    <use xlink:href="#checkbox-30" class="checkbox"></use>
                                                </svg>
                                            </span>
                                        <span class="checkboxLabel">EVL 2</span>
                                        <input type="number" name="ec-evl 2" class="ec-input" placeholder="EC" min="0">
                                    </label>
                                    <label class="evl-option checkbox-wrapper-30">
                                            <span class="checkbox" style="margin-right: 15px;">
                                                <input type="checkbox" 
                                                    class="checkbox" 
                                                name="evl" value="EVL 3">
                                                <svg>
                                                    <use xlink:href="#checkbox-30" class="checkbox"></use>
                                                </svg>
                                            </span>
                                        <span class="checkboxLabel">EVL 3</span>
                                        <input type="number" name="ec-evl 3" class="ec-input" placeholder="EC" min="0">
                                    <svg xmlns="http://www.w3.org/2000/svg" style="display: none">
                                    <symbol id="checkbox-30" viewBox="0 0 22 22">
                                        <path
                                        fill="none"
                                        stroke="#003366"
                                        d="M5.5,11.3L9,14.8L20.2,3.3l0,0c-0.5-1-1.5-1.8-2.7-1.8h-13c-1.7,0-3,1.3-3,3v13c0,1.7,1.3,3,3,3h13 c1.7,0,3-1.3,3-3v-13c0-0.4-0.1-0.8-0.3-1.2"
                                        />
                                    </symbol>
                                    </svg>  
                                    </label>                                  
                                </div>
                            </div></div>
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
        setupListeners();
        const dropdownMenu = document.getElementById("evl-dropdown-menu");
        const checkboxes = dropdownMenu.querySelectorAll('input[type="checkbox"][name="evl"]');

        if (Array.isArray(module.Evls)) {
            module.Evls.forEach((evl) => {

                const evlName = evl.Name.trim().toUpperCase();

                const checkbox = Array.from(checkboxes).find(cb => cb.value.toUpperCase() === evlName);

                if (checkbox) {
                    checkbox.checked = true;

                    const ecInputName = `ec-${checkbox.value.toLowerCase()}`;
                    const ecInput = dropdownMenu.querySelector(`input[name="${ecInputName}"]`);
                    if (ecInput) {
                        ecInput.value = evl.Ec;
                    }
                }
                updateEvlSelectionHeader(dropdownMenu);
            });
        }
    }
}

async function saveChanges(module, textArea, services) {
    const {
        getSelectedEVLs,
        updateModule
    } = services;
    const { totalEC, evls } = getSelectedEVLs(module.Evls || []);

    for (const evl of evls) {
        const existing = module.Evls.find(m => m.Name === evl.Name);
        if (existing) {
            evl.Id = existing.Id;
        }
    }

    module.Code = document.getElementById("code-input").value;
    module.Period = document.getElementById("period-input").value;
    module.Level = document.getElementById("level-input").value;
    module.Description = textArea.value;
    module.GraduateProfile = module.GraduateProfile;
    module.Evls = evls;
    const response = await updateModule(module);
    showToast(`${module.Name} succesvol gewijzigd`, 'success');
}