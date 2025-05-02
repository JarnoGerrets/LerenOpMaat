import Popup from "../../components/Popup.js";
import SemesterModule from "../../components/SemesterModule.js";
import { getModules } from "../../client/api-client.js";

let filterDropdown;
let mijnPopup;
let closeFilterDropdownHandler;
let modulesData = [];
let apiResponse = [];
let selectedCategories = [];
let selectedCategory;

export default async function SemesterChoice(selectedModuleName = "Selecteer je module") {
    // Hardcoded data for 4 semester modules


    try {
        //comment apiResponse & uncomment de 2e apiResponse to use dummy data
        apiResponse = await getModules();
        console.log(apiResponse);
        if (
            !apiResponse ||
            !Array.isArray(apiResponse) ||
            apiResponse.length === 0
        ) {
            console.error("Geen geldige semesters gevonden in de API-respons:", apiResponse); //Jarno voor debugging
        } else {
            modulesData = apiResponse;
        }

    } catch (error) {
        console.error("Error fetching module data:", error.message); //debugging added bij Jarno


        modulesData = [
            { id: '1', name: 'Introduction to Programming', description: 'Introduction to Programming', Category: 'SE' },
            { id: '2', name: 'Web Development Basics', description: 'Web Development Basics', Category: 'BIM' },
            { id: '3', name: 'Data Structures and Algorithms', description: 'Data Structures and Algorithms', Category: 'IDNS' },
            { id: '4', name: 'Database Management Systems', description: 'Database Management Systems', Category: 'SE' },
            { id: '5', name: 'Introduction to Programming', description: 'Introduction to Programming', Category: 'BIM' },
            { id: '6', name: 'Web Development Basics', description: 'Web Development Basics', Category: 'IDNS' },
            { id: '7', name: 'Data Structures and Algorithms', description: 'Data Structures and Algorithms', Category: 'SE' },
            { id: '8', name: 'Database Management Systems', description: 'Database Management Systems', Category: 'BIM' },
            { id: '9', name: 'Introduction to Programming', description: 'Introduction to Programming', Category: 'IDNS' },
            { id: '10', name: 'Web Development Basics', description: 'Web Development Basics', Category: 'SE' },
            { id: '11', name: 'Data Structures and Algorithms', description: 'Data Structures and Algorithms', Category: 'BIM' },
            { id: '12', name: 'Database Management Systems', description: 'Database Management Systems', Category: 'IDNS' },
            { id: '13', name: 'Data Structures and Algorithms', description: 'Data Structures and Algorithms', Category: 'BIM' },
            { id: '14', name: 'Database Management Systems', description: 'Database Management Systems', Category: 'IDNS' }
        ];
    }

    //Deze is omdat alles hardcoded is, maar later als wij een DB hebben
    //dan wordt alles uit de koppel tabel opgehaald
    if (selectedModuleName !== "Selecteer je module") {
        modulesData.unshift({ Name: 'Geen Keuze', Description: 'Geen Keuze' });
    }

    // Create the SemesterModules component with the hardcoded data
    const semesterModules = new SemesterModule(
        modulesData,
        (selectedModule) => {
            mijnPopup.close(selectedModule); // Sluit popup met geselecteerde module
            return selectedModule;
        }
    );
    const renderedSemesterModules = await semesterModules.render();

    mijnPopup = new Popup({
        maxWidth: 'auto',
        height: '620px',
        sizeCloseButton: '16',
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
    mijnPopup.contentContainer.appendChild(renderedSemesterModules);

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
    let filtered = modulesData.filter(m => m.Name !== 'Geen Keuze');

    if (selectedCategories.length > 0) {
        filtered = filtered.filter(m => selectedCategories.includes(m.GraduateProfile.Name));
    }

    if (searchTerm) {
        filtered = filtered.filter(m =>
            m.Name.toLowerCase().includes(searchTerm) ||
            m.Description.toLowerCase().includes(searchTerm) ||
            m.Name.toLowerCase().includes(searchTerm) ||
            m.Description.toLowerCase().includes(searchTerm)
        );
    }

    //doe 'Geen Keuze' altijd als eerste optie
    filtered.unshift({ Name: 'Geen Keuze', Description: 'Geen Keuze' });
    let popupWidth = 0;
    popupWidth = mijnPopup.popup.getBoundingClientRect().width - 58;

    const data = new SemesterModule(filtered, (selectedModule) => {
        mijnPopup.close(selectedModule);
        return selectedModule;
    });

    mijnPopup.contentContainer.innerHTML = '';
    mijnPopup.contentContainer.style.minWidth = `${popupWidth}px`;
    data.render().then(rendered => {
        mijnPopup.contentContainer.appendChild(rendered);
    });
}