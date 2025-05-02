// module-card.js
class ModuleCard extends HTMLElement {
    constructor() {
        super();
    }

    set data(module) {
        this.classList.add("col-12", "col-md-6", "col-lg-4", "p-4")
        this.innerHTML = `
            <a class="rm-a-style" href="#">
                <div class="bg-info shadow rounded-3 p-5 d-flex flex-column justify-content-between h-100">
                    <div>
                        <h4>${module.name}</h4>
                    </div>
                    <div class="d-flex">
                        <div class="w-50">
                            <p><b>code:</b> ${module.code}</p>
                            <p><b>semester:</b> ${module.semester || '1 & 2'}</p>
                        </div>
                        <div class="w-50">
                            <p><b>ec:</b> ${module.ec}</p>
                            <p><b>niveau:</b> ${module.niveau}</p>
                        </div>
                    </div>
                </div>
            </a>
        `;
    }
}

customElements.define('module-card', ModuleCard);