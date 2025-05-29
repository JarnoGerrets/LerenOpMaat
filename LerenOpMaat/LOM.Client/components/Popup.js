export default class Popup {
    constructor({minwidth = 'auto', minheight = 'auto', maxWidth = 'auto', maxHeight = 'auto', sizeCloseButton = '0', extraButtons = false, closeButtonStyle, header = '', titleWrapperClass = '', content = '', buttons = [] }) {

        this._handleOutsideClick = this._handleOutsideClick.bind(this);

        this.result = null;
        this._resolve = null;

        this.popup = document.createElement('div');
        this.popup.classList.add('popup');
        this.popup.style.maxWidth = maxWidth;
        this.popup.style.maxHeight = maxHeight;
        this.popup.style.minWidth = minwidth;
        this.popup.style.minHeight = minheight;

        this.overlay = document.createElement('div');
        this.overlay.classList.add('popup-overlay');

        // Close button
        const closeButton = document.createElement('button');
        closeButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="black" class="bi bi-x" viewBox="0 0 ${Number(sizeCloseButton) || 0} ${Number(sizeCloseButton) || 0}">
          <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
        </svg>
        `;
        closeButton.classList.add('popup-close-btn', closeButtonStyle);
        closeButton.addEventListener('mouseenter', () => {
            closeButton.classList.add('hovered');
        });
        closeButton.addEventListener('mouseleave', () => {
            closeButton.classList.remove('hovered');
        });
        closeButton.addEventListener('click', () => this.close());


        // Buttons
        const buttonContainer = document.createElement('div');
        if (extraButtons) {
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
        }
        // Header container
        const title = document.createElement('div');
        title.classList.add('popup-header');
        title.innerHTML = header;


        // Title wrapper
        const titleWrapper = document.createElement('div');
        titleWrapper.classList.add('popup-title');
        if (titleWrapperClass) titleWrapper.classList.add(titleWrapperClass);
        titleWrapper.appendChild(title);

        // Right-side controls container (buttons + close)
        const rightControls = document.createElement('div');
        rightControls.classList.add('popup-controls');
        rightControls.appendChild(buttonContainer);
        rightControls.appendChild(closeButton);

        // Header container
        const headerContainer = document.createElement('div');
        headerContainer.classList.add('popup-header-container');

        // Row with title + controls
        const headerRow = document.createElement('div');
        headerRow.classList.add('popup-header-row');
        headerRow.appendChild(titleWrapper);
        headerRow.appendChild(rightControls);

        // Assemble header container
        headerContainer.appendChild(headerRow);

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

            setTimeout(() => {
                document.addEventListener('click', this._handleOutsideClick);
            }, 10);
        }, 10);

        return new Promise((resolve) => {
            this._resolve = resolve;
        });
    }

    close(result = null) {
        document.removeEventListener('click', this._handleOutsideClick);
        this.overlay.style.opacity = 0;
        this.popup.style.transform = 'scale(0)';
        this.popup.style.opacity = 0;
        setTimeout(() => {
            if (this.overlay && this.overlay.parentNode === document.body) {
                document.body.removeChild(this.overlay);
            }

            if (this._resolve) this._resolve(result);
        }, 300);
    }


    _handleOutsideClick(event) {
        if (this.overlay.parentElement && !this.popup.contains(event.target)) {
            this.close();
        }
    }

}
