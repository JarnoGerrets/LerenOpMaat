import { semesterChoiceServices } from "../../scripts/utils/importServiceProvider.js";

export function createMockPopup(popupInstanceRef, onClickOverride = null) {
    return function (options) {
        const popup = document.createElement("div");
        popup.classList.add("popup");

        const wrapper = document.createElement("div");
        wrapper.classList.add("popup-button-wrapper");

        const button = document.createElement("button");
        button.innerHTML = options.buttons[0].text;

        if (onClickOverride) {
            button.addEventListener("click", onClickOverride);
        } else {
            button.addEventListener("click", options.buttons[0].onClick);
        }

        wrapper.appendChild(button);
        popup.appendChild(wrapper);

        this.popup = popup;
        this.popup.getBoundingClientRect = () => ({ width: 500 });
        this.contentContainer = document.createElement("div");
        this.open = async () => null;
        this.close = () => { };
        popupInstanceRef.popupInstance = this;
    };
}

export function createMockSemesterModule(tracker = []) {
    return function (modules) {
        tracker.length = 0;
        tracker.push(...modules);
        this.render = async () => {
            const el = document.createElement("div");
            el.classList.add("module-rendered");
            return el;
        };
    };
}

export function setupSemesterChoiceTest({
    modules = [],
    selectedModuleName = "Selecteer je module",
    popupOnClick = null,
    tracker = [],
} = {}) {
    const popupRef = { popupInstance: null };

    const MockPopup = createMockPopup(popupRef, popupOnClick);
    const MockSemesterModule = createMockSemesterModule(tracker);

    const mockServices = {
        ...semesterChoiceServices,
        getModules: async () => modules,
        Popup: MockPopup,
        SemesterModule: MockSemesterModule
    };

    return {
        mockServices,
        popupRef,
        MockSemesterModule,
        run: async () => {
            const result = await (await import("../../views/partials/semester-choice.js")).default(selectedModuleName, mockServices);
            return result;
        }
    };
}

export function setupSemesterChoiceWithCustomFilter({
    modules = [],
    selectedModuleName = "Selecteer je module",
    filterLogic = (mods) => mods,
    tracker = []
} = {}) {
    const popupRef = { popupInstance: null };

    const MockSemesterModule = createMockSemesterModule(tracker);

    window.showFilter = function (Data) {
        const filtered = filterLogic(Data);
        const instance = new MockSemesterModule(filtered);
        popupRef.popupInstance.contentContainer.innerHTML = '';
        instance.render().then(el => popupRef.popupInstance.contentContainer.appendChild(el));
    };

    const MockPopup = createMockPopup(popupRef, () => window.showFilter(modules));

    const mockServices = {
        ...semesterChoiceServices,
        getModules: async () => modules,
        Popup: MockPopup,
        SemesterModule: MockSemesterModule
    };

    return {
        popupRef,
        tracker,
        run: async () => {
            const result = await (await import("../../views/partials/semester-choice.js")).default(selectedModuleName, mockServices);
            return result;
        }
    };
}

