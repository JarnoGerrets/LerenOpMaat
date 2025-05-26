import Popup from "../../components/Popup.js";
import { getProfiles, addModule } from "../../client/api-client.js";
import {getSelectedEVLs, setupListeners} from "../../scripts/utils/evl-dropdown/evl-dropdown-utils.js"
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
                            <span class="field-text-2 spacer-row-1">EVLs:</span>
                            <div class="dropdown-wrapper">
                                <div id="evl-dropdown-toggle" class="dropdown-toggle"><span id="evlSelectionHeader">Selecteer EVLs</span></div>
                                <div id="evl-dropdown-menu" class="dropdown-menu hidden">
                                    <label class="evl-option checkbox-wrapper-30">
                                            <span class="checkbox" style="margin-right: 15px;">
                                                <input type="checkbox" 
                                                    class="checkbox" 
                                                name="evl" value="EVL1">
                                                <svg>
                                                    <use xlink:href="#checkbox-30" class="checkbox"></use>
                                                </svg>
                                            </span>
                                        <span class="checkboxLabel">EVL1</span>
                                        <input type="number" name="ec-evl1" class="ec-input" placeholder="EC" min="0"> 
                                    </label>
                                    <label class="evl-option checkbox-wrapper-30">
                                            <span class="checkbox" style="margin-right: 15px;">
                                                <input type="checkbox" 
                                                    class="checkbox" 
                                                name="evl" value="EVL2"}>
                                                <svg>
                                                    <use xlink:href="#checkbox-30" class="checkbox"></use>
                                                </svg>
                                            </span>
                                        <span class="checkboxLabel">EVL2</span>
                                        <input type="number" name="ec-evl2" class="ec-input" placeholder="EC" min="0">
                                    </label>
                                    <label class="evl-option checkbox-wrapper-30">
                                            <span class="checkbox" style="margin-right: 15px;">
                                                <input type="checkbox" 
                                                    class="checkbox" 
                                                name="evl" value="EVL3">
                                                <svg>
                                                    <use xlink:href="#checkbox-30" class="checkbox"></use>
                                                </svg>
                                            </span>
                                        <span class="checkboxLabel">EVL3</span>
                                        <input type="number" name="ec-evl3" class="ec-input" placeholder="EC" min="0">
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
                            </div>
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
        setupListeners();

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

            const { totalEC, evls } = getSelectedEVLs();

            const moduleToSend = {
                Name: form.querySelector("#name").value,
                Code: form.querySelector("#code").value,
                EC: totalEC,
                Level: parseInt(form.querySelector("#level").value),
                Period: parseInt(form.querySelector("#period").value),
                IsActive: true,
                GraduateProfileId: parseInt(form.querySelector("#graduateProfile").value),
                Requirements: [],
                Evls: evls
            };
            try {
                console.log("Module to send:", moduleToSend);
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

