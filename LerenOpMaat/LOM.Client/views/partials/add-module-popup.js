import Popup from "../../components/Popup.js";
import { getProfiles, addModule } from "../../client/api-client.js";
import { mapPeriodToPresentableString } from "../../scripts/utils/presentationMapper.js";
let mijnPopup;

export default async function addModulePopup() {
    return new Promise(async (resolve) => {
        mijnPopup = new Popup({
            maxWidth: 'auto',
            height: 'auto',
            sizeCloseButton: '0',
            extraButtons: false,
            closeButtonStyle: 'popup-confirmation-closebutton',
            header: `
                <h3 class="popup-header-confirmation">
                    Toevoegen module
                </h3>
            `,
            titleWrapperClass: 'popup-title-confirmation',
            content: `
        <form id="add-module-form" novalidate>
                <div class="add-module-popup-content">
                    <div class="row-save-module">
                        <span class="field-text">Naam:</span>
                        <input id="name" class="save-module-input name-input" required></input>
                    </div>
                    <div class="row-save-module">
                        <div class="field-wrapper">
                            <span class="field-text" >Code:</span>
                            <input id="code" type="text" class="save-module-input" required></input>
                        </div>
                        <div class="field-wrapper">
                            <span class="field-text-2 spacer-row-1">EC:</span>
                            <input id="ec" type="number" class="save-module-input" required></input>
                        </div>
                    </div>
                    <div class="row-save-module">
                        <div class="field-wrapper">
                            <span class="field-text" >Periode:</span>
                            <select id="period" type="number" class="save-module-select" required>
                            <option id=1>${mapPeriodToPresentableString(1)}</option>
                            <option id=2>${mapPeriodToPresentableString(2)}</option>
                            <option id=3>${mapPeriodToPresentableString(3)}</option>
                            </select>
                        </div>
                        <div class="field-wrapper">
                            <span class="field-text-2 spacer-row-1">Niveau:</span>
                            <select id="level" type="number" class="save-module-select" required>
                            <option id=1>1</option>
                            <option id=2>2</option>
                            <option id=2>3</option>
                            </select>
                        </div>
                    </div>
                    <div class="row-save-module">
                        <div class="field-wrapper">
                            <span class="field-text" >Uitstroomprofiel:</span>
                            <select id="graduateProfile" type="number" class="save-module-select" required></select>
                        </div>
                        <div class="spacing-row">
                        </div>
                    </div>
                <div class="add-module-popup-buttons"> 
                    <button id="save-module" type="submit" class="save-module-button">Opslaan</button>
                    <button id="cancel-save" type="button" class="cancel-add-module-button">Annuleren</button>
                    </div>
                </div>
                </form>
            `
        });

        mijnPopup.open();
        const graduateProfiles = await getProfiles();
        const select = document.getElementById("graduateProfile");
        graduateProfiles.forEach(profile => {
            const option = document.createElement("option");
            option.value = profile.Id;
            option.textContent = profile.Name;
            select.appendChild(option);
        });

        document.getElementById("add-module-form").addEventListener("submit", async (e) => {
            e.preventDefault();

            const form = e.target;
            if (!form.checkValidity()) {
                form.reportValidity(); // This shows built-in browser messages
                return;
            }

            const moduleToSend = {
                Name: form.querySelector("#name").value,
                Code: form.querySelector("#code").value,
                EC: parseInt(form.querySelector("#ec").value),
                Level: parseInt(form.querySelector("#level").value),
                Period: parseInt(form.querySelector("#period").value),
                IsActive: true,
                GraduateProfileId: parseInt(form.querySelector("#graduateProfile").value),
                Requirements: []
            };
            try {
                const result = await addModule(moduleToSend);
                showToast(`${result.Name} succesvol toegevoegd`, 'success');
                resolve(true);
                mijnPopup.close();
            } catch (error) {
                resolve(false);
                showToast(`Er is een fout opgetreden, probeer opnieuw: ${error}`, 'error')
            }
        });

        window.addEventListener('beforeunload', handleUnload);
        window.addEventListener('popstate', handleUnload);

        function handleUnload() {
            mijnPopup.close();
        }
        document.getElementById("cancel-save").addEventListener("click", () => {
            resolve(false);
            mijnPopup.close();
        });

    });

}

