class CardComponent extends HTMLElement {
    constructor() {
        super();
    }

    renderCard(contentHtml) {
        this.innerHTML = `
            <a class="rm-a-style">
                <div class="bg-info shadow rounded-3 p-5 d-flex flex-column justify-content-between h-100">
                    ${contentHtml}
                </div>
            </a>
        `;
    }
}

customElements.define('base-card', CardComponent);
