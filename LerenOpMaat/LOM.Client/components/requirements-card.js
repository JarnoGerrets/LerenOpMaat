import './card.js';
import editRequirementPopup from '../views/partials/edit-requirement-popup.js';
import confirmationPopup from "../views/partials/confirmation-popup.js";
import { deleteRequirement } from '../client/api-client.js';

export default class RequirementsCard extends customElements.get("base-card") {
    constructor() {
        super();
    }

    set refreshCallback(callBack) {
        this._refreshCallback = callBack;
    }

    set moduleId(id){
        this._moduleId = id;
    }

    set requirements(requirements) {
        let items = null;
        if (requirements && requirements.length > 0) {
            items = requirements.map((req) => `
            <div class="requirement-row">
                <p>${req.Description}</p>
                <div class="requirement-actions" style="display: none;">
                    <i class="bi bi-pencil requirement-card-action-button edit-button" data-id="${req.Id}"></i>
                    <i class="bi bi-trash requirement-card-action-button delete-button" data-id="${req.Id}"></i>
                </div>
            </div>
        `).join("");
        }

        const content = `
            <div class="requirement-card-title-row">
                <h4 class="title-requirement-card">Ingangseisen</h4>
                <i id="add-requirement-button" class="bi bi-plus-circle requirement-card-add-button" style="display: none;"></i>
            </div>
                ${items ? `<div class="d-flex flex-column gap-2 text-requirement-card" style="font-weight: bold;">
                ${items}
            </div>` : ''}
        `;

        this.renderCard(content, "#45B97C");

        this.querySelectorAll('.edit-button').forEach(button => {
            button.addEventListener('click', async (event) => {
                await editRequirementPopup(event.target.dataset.id, this._moduleId, this._refreshCallback)
            });
        });

        this.querySelectorAll('.delete-button').forEach(button => {
            button.addEventListener('click', async (event) => {
                await confirmationPopup("deze ingangseis", "ingangseis",  async () => { 
                    await deleteRequirement(event.target.dataset.id);
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
