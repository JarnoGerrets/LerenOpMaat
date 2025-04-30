import Popup from "../../components/Popup.js";
import SemesterModule from "../../components/SemesterModule.js";
import { getModules } from "../../client/api-client.js";

let filterDropdown;
let mijnPopup;
let closeFilterDropdownHandler;
let selectedCategories = [];
let modulesData = [];
let selectedCategory;

export default async function SemesterChoice() {

    try {
        const res = await getModules();
        modulesData = Array.isArray(res) ? res : [];

    } catch (error) {
        console.error('Error fetching modules:', error.message);
    }

    const semesterModules = new SemesterModule(modulesData, (selectedModule) => {
        mijnPopup.close(selectedModule);
        return selectedModule;
    });


    mijnPopup = new Popup({
        maxWidth: 'auto',
        height: '620px',
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
                    showFilter(modulesData);
                }
            }
        ]
    });
    mijnPopup.contentContainer.appendChild(semesterModules.render());

    const selectedModule = await mijnPopup.open();
    if (selectedModule) {
        return selectedModule;
    }

}

function showFilter(Data) {
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
            filterData(searchInput.value.trim().toLowerCase());
        });

        filterDropdown.appendChild(searchInput);
        const categories = ['Alles', ...new Set(Data.filter(m => m.name !== 'Geen Keuze').map(m => m.Category))];
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
                filterData(searchInput.value.trim().toLowerCase());
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
    const filterButtonWrapper = mijnPopup.popup.querySelector('.filter-button')?.closest('.popup-button-wrapper');
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

function filterData(searchTerm = '') {
    //Geen Keuze niet filteren
    let filtered = modulesData.filter(m => m.name !== 'Geen Keuze');

    if (selectedCategories.length > 0) {
        filtered = filtered.filter(m => selectedCategories.includes(m.Category));
    }

    if (searchTerm) {
        filtered = filtered.filter(m =>
            m.Name.toLowerCase().includes(searchTerm) ||
            m.Description.toLowerCase().includes(searchTerm)
        );
    }

    //doe 'Geen Keuze' altijd als eerste optie
    filtered.unshift({ name: 'Geen Keuze', description: 'Geen Keuze' });
    let popupWidth = 0;
    popupWidth = mijnPopup.popup.getBoundingClientRect().width - 58;

    const data = new SemesterModule(filtered, (selectedModule) => {
        mijnPopup.close(selectedModule);
        return selectedModule;
    });

    mijnPopup.contentContainer.innerHTML = '';
    mijnPopup.contentContainer.style.minWidth = `${popupWidth}px`;
    mijnPopup.contentContainer.appendChild(data.render());
}