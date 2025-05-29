export function setupModuleInfoTestDOM() {
    const testRoot = document.getElementById("test-root");
    testRoot.innerHTML = `
        <div class="buttons-container-module-info">
            <a id="go-back-button" class="bi bi-chevron-left">Terug</a>
        </div>
        <div class="module-info-container">
            <div style="min-width: 420px;" id="card-column" class="card-column">
            </div>
            <div id="description-text" class="text-column">
                <textarea id="moduleTextArea" class="text-area"></textarea>
            </div>
        </div>
    `;
}

export function getMockModuleData(overrides = {}) {
    return {
        Id: "42",
        Name: "Testmodule",
        Code: "TST101",
        Period: 2,
        Ec: 5,
        Level: 2,
        Description: "Beschrijving test",
        IsActive: true,
        GraduateProfile: { ColorCode: "#123456" },
        Requirements: [{ Id: "req1", Description: "Eis A" }],
        Evls: [],
        ...overrides
    };
}

export function getMockServices(moduleData) {
    return {
        getModule: jasmine.createSpy("getModule").and.resolveTo(moduleData),
        existenceModule: jasmine.createSpy("existenceModule").and.resolveTo(false),
        setupButtons: jasmine.createSpy("setupButtons"),
        reqCardServices: {
            confirmationPopup: jasmine.createSpy("confirmationPopup"),
            deleteRequirement: jasmine.createSpy("deleteRequirement"),
            editRequirementPopup: jasmine.createSpy("editRequirementPopup")
        }
    };
}
