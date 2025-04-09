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
        closeButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="black" class="bi bi-x" viewBox="0 0 16 16">
          <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
        </svg>
        `;
        closeButton.classList.add('popup-close-btn');
        closeButton.addEventListener('mouseenter', () => {
            closeButton.classList.add('hovered');
        });
        closeButton.addEventListener('mouseleave', () => {
            closeButton.classList.remove('hovered');
        });
        closeButton.addEventListener('click', () => this.close());


        // Buttons
        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('popup-button-container');
        if (buttons.length === 0) {
            buttonContainer.style.display = 'none';
        }

        buttons.forEach(({ text, onClick }) => {
            const wrapper = document.createElement('div');
            wrapper.classList.add('popup-button-wrapper');
            const btn = document.createElement('button');
            btn.innerHTML = text;
            btn.classList.add('popup-btn');
            btn.addEventListener('click', onClick);
            wrapper.appendChild(btn);
            buttonContainer.appendChild(wrapper);
        });

        // Header container
        const title = document.createElement('div');
        title.classList.add('popup-header');
        title.innerHTML = header;


        // Title wrapper
        const titleWrapper = document.createElement('div');
        titleWrapper.classList.add('popup-title');
        titleWrapper.appendChild(title);

        // Right-side controls container (buttons + close)
        const rightControls = document.createElement('div');
        rightControls.classList.add('popup-controls');
        rightControls.appendChild(buttonContainer);
        rightControls.appendChild(closeButton);

        // Header container
        const headerContainer = document.createElement('div');
        headerContainer.classList.add('popup-header-container');
        headerContainer.appendChild(titleWrapper);
        headerContainer.appendChild(rightControls);

        // divider
        const divider = document.createElement('hr');
        divider.classList.add('custom-hr');

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

        // Assemble the popup
        this.popup.appendChild(headerContainer);
        this.popup.appendChild(divider);
        this.popup.appendChild(scrollWrapper);
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
