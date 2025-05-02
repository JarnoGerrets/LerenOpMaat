// Create Module Info Card
export function createModuleInfoCard(savedModule) {
    return `
    <div class="module-card-text" style="display: flex; font-weight: bold;">
      <div class="module-info-column">
        <div class="module-info-row">
          Code: <span id="code-text">${savedModule.Code}</span>
        </div>
        <div class="module-info-row">
          Periode: <span id="periode-text">${savedModule.Periode}</span>
        </div>
      </div>
      <div class="module-info-column">
        <div class="module-info-row">
          EC: <span id="ec-text">${savedModule.Ec}</span>
        </div>
        <div class="module-info-row">
          Niveau: <span id="niveau-text">${savedModule.Niveau}</span>
        </div>
      </div>
    </div>
    `;
}
// Create Requirements Card
export function createRequirementsCard(requirements) {
    let reqCardText = "";
    requirements.forEach(req => {
    reqCardText += `${req.Description}<br>`;
    });
    return reqCardText;
}
