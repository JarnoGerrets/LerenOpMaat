import Popup from "../../components/Popup.js";
import { getProfiles } from "../../client/api-client.js";
let mijnPopup;

export default async function addModulePopup() {
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
                            <input id="period" type="number" class="save-module-input" required></input>
                        </div>
                        <div class="field-wrapper">
                            <span class="field-text-2 spacer-row-1">Niveau:</span>
                            <input id="niveau" type="number" class="save-module-input" required></input>
                        </div>
                    </div>
                    <div class="row-save-module">
                        <div class="field-wrapper">
                            <span class="field-text" >Uitstroomprofiel:</span>
                            <select id="graduateProfile" type="number" class="save-module-select" required></select>
                        </div>
                        <div class="field-wrapper">
                            <span class="field-text-2 spacer-row-1">Toegangseisen:</span>
                            <select id="requirement" type="number" class="save-module-select"></select>
                        </div>
                    </div>
                <div class="add-module-popup-buttons"> 
                    <button id="save-module" class="save-module-button">Opslaan</button>
                    <button id="cancel-save" class="cancel-add-module-button">Annuleren</button>
                    </div>
                </div>
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

    setTimeout(() => {
        document.getElementById("save-module")?.addEventListener("click", async () => {
            // save logic
            const moduleToSend = {
                name: "",
                code: "",
                description: "",
                ec: 0,
                niveau: 0,
                period: 0,
                isActive: true,
                graduateProfileId: 0,
                requirements: [] // This should be an array of requirement IDs
            };

            moduleToSend.name = document.querySelector('#name').value;
            moduleToSend.code = document.querySelector('#code').value;
            moduleToSend.ec = document.querySelector('#ec').value;
            moduleToSend.niveau = document.querySelector('#niveau').value;
            moduleToSend.period = document.querySelector('#period').value;
            moduleToSend.graduateProfileId = parseInt(document.querySelector('#graduateProfile').value);
            console.log(moduleToSend);
        });

        document.getElementById("cancel-save")?.addEventListener("click", () => {
            mijnPopup.close();
        });
    }, 0);

    window.addEventListener('beforeunload', handleUnload);
    window.addEventListener('popstate', handleUnload);

    function handleUnload() {
        mijnPopup.close();
    }

}

function createModule(data){

}
