import Popup from "../../components/popup.js";
import { getRequirement, getRequirementTypes, postRequirement, updateRequirement, getModules } from "../../client/api-client.js";

let popup;
export default async function editRequirementPopup(requirementId, moduleId, successCallback) {
    const requirementTypes = await getRequirementTypes();
    if (!requirementTypes) {
        showToast("Er is een fout opgetreden, probeer opnieuw", 'error');
        return;
    }

    let requirement = null;
    if (requirementId) {
        requirement = await getRequirement(requirementId);
        if (!requirement) {
            showToast("Er is een fout opgetreden, probeer opnieuw", 'error');
            return;
        }
    }

    const requirementTypeOptions = requirementTypes.map(type => `
        <option value="${type.Key}" ${requirement && requirement.Type === type.Key ? 'selected' : ''}>${type.Description}</option>
    `).join("");

    async function submitForm(e, resolve, successCallback) {
        const form = e.target;
        if (!form.checkValidity()) {
            form.reportValidity(); // This shows built-in browser messages
            return;
        }

        const formData = new FormData(form);
        let formObject = {};
        formData.forEach(function (value, key) {
            formObject[key] = value;
        });

        try {
            if (requirementId) {
                await updateRequirement(requirementId, formObject);
                showToast('ingangseis succesvol aangepast', 'success');
                resolve(true);
            }
            else {
                await postRequirement(formObject);
                showToast('ingangseis succesvol toegevoegd', 'success');
                resolve(true);
            }
            popup.close();

            if (successCallback) {
                successCallback();
            }
        } catch (error) {
            resolve(false);
            showToast(`Er is een fout opgetreden, probeer opnieuw: ${error}`, 'error')
        }
    }

    async function setValueInputByType(selectedType) {
        const dynamicRowContainer = document.getElementById("dynamic-row-container");
        dynamicRowContainer.innerHTML = "";

        if (selectedType === "RequiredEcFromPropedeuse" 
            || selectedType === "RequiredEc" 
            || selectedType === "RequiredLevel3ModulesCount"
            || selectedType === "RequiredLevel2ModulesCount") { // Numeric input
            dynamicRowContainer.innerHTML = `
                <div class="edit-requirement-row">
                    <span class="field-text">Waarde</span>
                    <input 
                        type="number"
                        name="Value"
                        class="edit-requirement-input"
                        required min="0"
                        step="1"
                        value="${requirement ? requirement.Value : ''}"
                        oninput="this.value = this.value.replace(/[^0-9]/g, '');">
                </div>
            `;
        } else if (selectedType === "RequiredModule") { // Module selection
            const modules = await getModules();
            if (!modules) {
                showToast("Er is een fout opgetreden, probeer opnieuw", 'error');
                return;
            }

            const moduleOptions = modules.map(module => `
                    <option value="${module.Id}" ${requirement && requirement.Value === module.Id ? 'selected' : ''}>${module.Code} (${module.Name})</option>
                `).join("");

            dynamicRowContainer.innerHTML =
                `
                <div class="edit-requirement-row">
                    <span class="field-text">Module:</span>
                    <select id="module-select" name="Value" class="edit-requirement-input" required>
                        ${moduleOptions}
                    </select>
                </div>
                `;
        }
    }

    return new Promise(async (resolve) => {
        popup = new Popup({
            maxWidth: 'auto',
            height: 'auto',
            sizeCloseButton: '0',
            extraButtons: false,
            closeButtonStyle: 'popup-confirmation-closebutton',
            header: `
            <h3 class="popup-header-confirmation">
                ${requirementId ? 'Bewerken' : 'Toevoegen'} ingangseis
            </h3>
            `,
            titleWrapperClass: 'popup-title-confirmation',
            content: `
            <form id="edit-requirement-form">
            ${moduleId ? `<input type="hidden" name="ModuleId" id="moduleId" value="${moduleId}"></input>` : ''}
            ${requirement ? `<input type="hidden" name="ModuleId" id="moduleId" value="${requirement.ModuleId}"></input>` : ''}
            ${requirementId ? `<input type="hidden" name="Id" id="requirementId" value="${requirementId}"></input>` : ''}
                <div class="popup-content">
                    <div class="edit-requirement-row">
                        <span class="field-text">Type:</span>
                        <select id="requirement-type" name="Type" class="edit-requirement-input" required>
                            ${requirementTypeOptions}
                        </select>
                    </div>
                    <div class="edit-requirement-row" id="dynamic-row-container"></div>
                    <div class="popup-buttons"> 
                        <button id="save-requirement" type="submit" class="popup-save-button">Opslaan</button>
                        <button id="cancel-save-requirement" type="button" class="popup-cancel-button">Annuleren</button>
                    </div>
                </div>
            </form>
            `
        });

        function handleUnload() {
            popup.close();
        }

        popup.open();

        const requirementTypeSelect = document.getElementById("requirement-type");
        if (!requirementTypeSelect) {
            showToast("Er is een fout opgetreden, probeer opnieuw", 'error');
            return;
        }

        setValueInputByType(requirementTypeSelect.value);

        window.addEventListener('beforeunload', handleUnload);
        window.addEventListener('popstate', handleUnload);

        document.getElementById("requirement-type").addEventListener("change", (e) => {
            const selectedType = e.target.value;
            setValueInputByType(selectedType);
        });

        document.getElementById("edit-requirement-form").addEventListener("submit", async (e) => {
            e.preventDefault();
            submitForm(e, resolve, successCallback);
        });

        document.getElementById("cancel-save-requirement").addEventListener("click", () => {
            resolve(false);
            popup.close();
        });
    });
}