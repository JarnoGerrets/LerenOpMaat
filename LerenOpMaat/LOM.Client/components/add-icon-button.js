export default class AddIconButton {
    size = 60; 
    static defaultOptions = {
        onclick: null,
    };

    constructor(options = {}) {
        this.options = Object.assign({}, AddIconButton.defaultOptions, options);
        this.injectStyles();
        this.element = this.createIcon();
    }

    injectStyles() {
        if (document.getElementById("green-plus-icon-style")) return;

        const style = document.createElement("style");
        style.id = "green-plus-icon-style";
        style.textContent = `
            .green-plus-circle {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                background-color: #45b97c;
                border-radius: 50%;
                cursor: pointer;
            }
            .green-plus-circle i {
                color: white;
                font-size: 48px;
            }
        `;
        document.head.appendChild(style);
    }

    createIcon() {
        const { onclick } = this.options;

        const iconWrapper = document.createElement("div");
        iconWrapper.className = "green-plus-circle";
        iconWrapper.style.width = `${this.size}px`;
        iconWrapper.style.height = `${this.size}px`;

        const icon = document.createElement("i");
        icon.className = "bi bi-plus";

        iconWrapper.appendChild(icon);

        if (onclick) {
            iconWrapper.addEventListener("click", onclick);
        }

        return iconWrapper;
    }

    getHtml() {
        return this.element;
    }
}
