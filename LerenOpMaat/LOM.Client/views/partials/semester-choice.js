import { semesterChoiceServices } from "../../scripts/utils/importServiceProvider.js";

let filterDropdown;
let moduleSelectionPopup;
let closeFilterDropdownHandler;
let modules = [];
let apiResponse = [];
let selectedCategories = [];
let selectedCategory;
let cachedPopupWidth;

export default async function SemesterChoice(selectedModuleName = "Selecteer je module", services = semesterChoiceServices, learningRouteArray = []) {
    const {
        Popup,
        SemesterModule,
        getModules
    } = services;

    try {
        apiResponse = await getModules();
    } catch (error) {
        console.error("Error fetching module data:", error.message);
    }


    let renderedSemesterModules = null;
    if (
        !apiResponse ||
        !Array.isArray(apiResponse) ||
        apiResponse.length === 0
    ) {
        renderedSemesterModules = document.createElement('div')
        renderedSemesterModules.innerHTML = "<span class='error-label-popup'>Er zijn geen modules gevonden, neem contact op met de beheerder</span>";

    } else {
        const selectedModuleIds = window.learningRouteArray.map(item => item.moduleId);

        modules = apiResponse.filter(module =>
            !selectedModuleIds.includes(module.Id)
        );
        //Deze is omdat alles hardcoded is, maar later als wij een DB hebben
        //dan wordt alles uit de koppel tabel opgehaald
        if (selectedModuleName !== "Selecteer je module") {
            modules.unshift({ Name: 'Geen Keuze', Description: 'Geen Keuze' });
        }
        // Create the SemesterModules component with the retrieved data
        const semesterModules = new SemesterModule(
            modules,
            (selectedModule) => {
                moduleSelectionPopup.close(selectedModule);
                return selectedModule;
            }
        );
        renderedSemesterModules = await semesterModules.render();
    }

    moduleSelectionPopup = new Popup({
        minWidth: '400px',
        minheight: '400px',
        maxWidth: 'auto',
        maxHeight: '620px',
        sizeCloseButton: '16',
        extraButtons: true,
        header: `
        <h1 class="popup-header">
            Selecteer je module
        </h1>
            `,
        buttons: [
            {
                text: `
              <svg xmlns="http://www.w3.org/2000/svg" class="filter-button" fill="black" viewBox="0 0 18 18">
                <path d="M6 10.117V15l4-2.5v-2.383l5.447-5.447A.5.5 0 0 0 15.5 4h-15a.5.5 0 0 0-.354.854L6 10.117z"/>
              </svg>
            `,
                onClick: () => {
                    showFilter(modules, SemesterModule);
                }
            }
        ]
    });

    moduleSelectionPopup.contentContainer.appendChild(renderedSemesterModules);

    const selectedModule = await moduleSelectionPopup.open();
    if (selectedModule) {
        return selectedModule;
    }

}

function showFilter(Data, SemesterModule) {
    const isOpen = filterDropdown && filterDropdown.classList.contains('open');

    if (!filterDropdown) {
        filterDropdown = document.createElement('div');
        filterDropdown.classList.add('filter-dropdown');

        // Create search input
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = 'Zoek modules...';
        searchInput.classList.add('search-input');
        searchInput.addEventListener('input', () => {
            filterData(searchInput.value.trim().toLowerCase(), SemesterModule);
        });

        filterDropdown.appendChild(searchInput);
        const categories = ['Alles', ...new Set(Data.filter(m => m.Name !== 'Geen Keuze').map(m => m.GraduateProfile.Name))];
        categories.forEach(category => {
            const option = document.createElement('div');
            option.textContent = category;
            option.classList.add('filter-option');

            if (selectedCategory === category && category !== 'Alles') {
                option.classList.add('selected');
            }

            option.addEventListener('mouseenter', () => {
                option.classList.add('hover');
            });

            option.addEventListener('mouseleave', () => {
                option.classList.remove('hover');
                if (!selectedCategories.includes(category)) {
                    option.classList.remove('selected');
                } else {
                    option.classList.add('selected');
                }
            });

            option.addEventListener('click', () => {
                if (selectedCategories.includes(category)) {
                    selectedCategories = selectedCategories.filter(c => c !== category);
                } else {
                    if (category !== 'Alles') {
                        selectedCategories.push(category);
                    } else {
                        selectedCategories = [];
                    }
                }
                updateHighlight();
                filterData(searchInput.value.trim().toLowerCase(), SemesterModule);
                if (category === 'Alles') {
                    filterDropdown.classList.remove('open');
                    document.removeEventListener('click', closeFilterDropdownHandler);
                }
            });

            filterDropdown.appendChild(option);
        });

        openPopup(filterDropdown);
    } else {
        openPopup(filterDropdown);
    }

    if (!isOpen) {
        setTimeout(() => {
            filterDropdown.classList.add('open');
            closeFilterDropdownHandler = (event) => closeFilterDropdown(event);
            document.addEventListener('click', closeFilterDropdownHandler);
        }, 10);

    } else {
        filterDropdown.classList.remove('open');
        document.removeEventListener('click', closeFilterDropdownHandler);
    }
}

function openPopup(filterDropdown) {
    const filterButtonWrapper = moduleSelectionPopup.popup.querySelector('.filter-button')?.closest('.popup-button-wrapper');
    if (filterButtonWrapper) {
        filterButtonWrapper.appendChild(filterDropdown);
    }
}

function updateHighlight() {
    const options = filterDropdown.querySelectorAll('.filter-option');
    options.forEach(option => {
        const category = option.textContent;
        option.style.backgroundColor = selectedCategories.length === 0 ? '#d0ebff' : 'transparent';
        option.style.fontWeight = selectedCategories.length === 0 ? 'bold' : 'normal;';
        option.style.backgroundColor = selectedCategories.includes(category) ? '#d0ebff' : 'transparent';
        option.style.fontWeight = selectedCategories.includes(category) ? 'bold' : 'normal';
    });
}

function closeFilterDropdown(event) {
    if (!filterDropdown.contains(event.target) && !event.target.closest('.filter-button')) {
        filterDropdown.classList.remove('open');
        document.removeEventListener('click', closeFilterDropdownHandler);
    }
}

function filterData(searchTerm = '', SemesterModule) {
    if (!cachedPopupWidth) {
        cachedPopupWidth = moduleSelectionPopup.popup.getBoundingClientRect().width - 58;
    }
    //Geen Keuze niet filteren
    let filtered = modules.filter(m => m.Name !== 'Geen Keuze');

    if (selectedCategories.length > 0) {
        filtered = filtered.filter(m => selectedCategories.includes(m.GraduateProfile.Name));
    }

    if (searchTerm) {
        filtered = filtered.filter(m =>
            m.Name.toLowerCase().includes(searchTerm) ||
            m.Description.toLowerCase().includes(searchTerm) ||
            m.Code.toLowerCase().includes(searchTerm)
        );
    }

    //doe 'Geen Keuze' altijd als eerste optie
    filtered.unshift({ Name: 'Geen Keuze', Description: 'Geen Keuze' });

    const data = new SemesterModule(filtered, (selectedModule) => {
        moduleSelectionPopup.close(selectedModule);
        return selectedModule;
    });

    const container = moduleSelectionPopup.contentContainer;
    container.style.minWidth = `${cachedPopupWidth}px`;
    data.render().then(rendered => {
        container.replaceChildren(rendered);
    });

}
