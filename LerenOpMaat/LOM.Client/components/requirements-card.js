import './card.js';

export default class RequirementsCard extends customElements.get("base-card") {
    constructor() {
        super();
    }

    set services(serviceObject) {
        this._services = serviceObject;
    }

    set refreshCallback(callBack) {
        this._refreshCallback = callBack;
    }

    set moduleId(id) {
        this._moduleId = id;
    }

    set requirements(requirements) {
        const { confirmationPopup, deleteRequirement, editRequirementPopup } = this._services;
        let items = null;
        if (requirements && requirements.length > 0) {
            items = requirements.map((req) => `
            <div class="requirement-row">
            <div class="requirement-actions" style="display: none;">
            <i class="bi bi-x-circle requirement-card-action-button delete-button" data-id="${req.Id}"></i>
            </div>
                <p>${req.Description}</p>
                <div class="requirement-actions" style="display: none;">
                <i class="bi bi-pencil-square requirement-card-action-button edit-button" data-id="${req.Id}"></i>
                </div>
            </div>
        `).join("");
        }
        const content = `
            <div class="requirement-card-title-row">
                <h4 class="title-requirement-card">Ingangseisen</h4>
            </div> 
              <div class="d-flex flex-column gap-2 text-requirement-card" style="font-weight: bold;">
                ${items || `<span style="margin-bottom: 15px; font-weight: normal !important; color: black !important;" class="text-muted">Geen toegangseisen toegevoegd.</span>`}
            </div>
            <span id="add-requirement-button" style="cursor: pointer; display: none;"><i><u>Toegangseisen toevoegen</u></i></span>
            `;

        this.renderCard(content, "#45B97C");

        this.querySelectorAll('.edit-button').forEach(button => {
            button.addEventListener('click', async (event) => {
                await editRequirementPopup(event.target.dataset.id, this._moduleId, this._refreshCallback)
            });
        });

        const header = `<h3 class="popup-header-confirmation">
                Verwijderen ingangseis van module
            </h3>`;


        const contentForPopup = `<div class="confirmation-popup-content">
            <p>Weet u zeker dat u de toegangseis wilt verwijderen van deze module?</p>
            <div class="confirmation-popup-buttons"> 
                <button id="confirm-confirmation-popup" class="confirmation-accept-btn">Ja</button>
                <button id="cancel-confirmation-popup"" class="confirmation-deny-btn">Nee</button>
                </div>
            </div>`;

        this.querySelectorAll('.delete-button').forEach(button => {
            button.addEventListener('click', async (event) => {
                await confirmationPopup("verwijderen ingangseis", event.target.dataset.id, header, contentForPopup, deleteRequirement, window.location.href, async () => {
                    this._refreshCallback();
                });

            });
        });

        this.querySelector('#add-requirement-button').addEventListener('click', async () => {
            await editRequirementPopup(null, this._moduleId, this._refreshCallback);
        });
    }
}

customElements.define('requirements-card', RequirementsCard);
