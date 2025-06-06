class CardComponent extends HTMLElement {
    constructor() {
        super();
    }

    renderCard(contentHtml, backgroundColor) {
        this.innerHTML = `
            <a class="rm-a-style">
                <div style="position: relative; border-radius: 15px; background: ${backgroundColor};" class="card-style shadow p-5 d-flex flex-column justify-content-between h-100">
                    ${contentHtml}
                </div>
            </a>
        `;
    }
}

customElements.define('base-card', CardComponent);
