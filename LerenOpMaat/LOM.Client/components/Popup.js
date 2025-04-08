export default class Popup {
    constructor({ maxWidth = 'auto', height = 'auto', header = '', content = '', buttons = [] }) {
        this.popup = document.createElement('div');
        this.popup.classList.add('popup');
        this.popup.style.maxWidth = maxWidth;
        this.popup.style.height = height;

        this.overlay = document.createElement('div');
        this.overlay.classList.add('popup-overlay');

        this.overlay.addEventListener('click', (event) => {
            if (!this.popup.contains(event.target)) {
                this.close();
            }
        });

        // Close button
        const closeButton = document.createElement('button');
        closeButton.textContent = '×';
        closeButton.classList.add('popup-close-btn');
        closeButton.addEventListener('mouseenter', () => {
            closeButton.classList.add('hovered');
        });
        closeButton.addEventListener('mouseleave', () => {
            closeButton.classList.remove('hovered');
        });
        closeButton.addEventListener('click', () => this.close());

        // Header container
        const headerContainer = document.createElement('div');
        headerContainer.classList.add('popup-header');
        headerContainer.innerHTML = header;

        // Content container
        const contentContainer = document.createElement('div');
        contentContainer.innerHTML = content;
        this.contentContainer = contentContainer;

        // Scrollable wrapper
        const scrollWrapper = document.createElement('div');
        scrollWrapper.classList.add('popup-scroll', 'hide-scrollbar');
        scrollWrapper.appendChild(contentContainer);

        scrollWrapper.addEventListener('scroll', () => {
            scrollWrapper.classList.add('scrolling');
            clearTimeout(scrollWrapper.scrollTimeout);
            scrollWrapper.scrollTimeout = setTimeout(() => {
                scrollWrapper.classList.remove('scrolling');
            }, 700);
        });

        // Buttons
        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('popup-button-container');
        if (buttons.length === 0) {
            buttonContainer.style.display = 'none';
        }

        buttons.forEach(({ text, onClick }) => {
            const btn = document.createElement('button');
            btn.innerHTML = text;
            btn.classList.add('popup-btn');
            btn.addEventListener('click', onClick);
            buttonContainer.appendChild(btn);
        });

        // Assemble the popup
        this.popup.appendChild(closeButton);
        this.popup.appendChild(headerContainer);
        this.popup.appendChild(scrollWrapper);
        this.popup.appendChild(buttonContainer);
        this.overlay.appendChild(this.popup);
    }

    open() {
        document.body.appendChild(this.overlay);
        setTimeout(() => {
            this.overlay.style.opacity = 1;
            this.overlay.style.pointerEvents = 'auto';
            this.popup.style.transform = 'scale(1)';
            this.popup.style.opacity = 1;
        }, 10);
    }

    close() {
        this.overlay.style.opacity = 0;
        this.popup.style.transform = 'scale(0)';
        this.popup.style.opacity = 0;
        setTimeout(() => {
            document.body.removeChild(this.overlay);
        }, 300);
    }
}
