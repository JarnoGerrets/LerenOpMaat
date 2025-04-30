// Create Module Info Card
export function createModuleInfoCard(savedModule) {
    return `
    <div style="display: flex; gap: 50px; font-weight: bold; font-size: 18px;">
      <div>
        Code: <span id="code-text">${savedModule.Code}</span><br>
        Periode: <span id="periode-text">${savedModule.Periode}</span><br>
      </div>
      <div>
        EC: <span id="ec-text">${savedModule.EC}</span><br>
        Niveau: <span id="niveau-text">${savedModule.Niveau}</span><br>
      </div>
    </div>
  `;
}

// Create Requirements Card
export function createRequirementsCard(requirements) {
    let reqCardText = "";
    requirements.forEach(req => {
        if (req.RequiredCredits) {
            reqCardText += `Vereiste EC's: ${req.RequiredCredits}<br>`;
        }
        if (req.RequiredModule) {
            reqCardText += `${req.RequiredModule.Name} is verplicht<br>`;
        }
    });
    return reqCardText;
}
