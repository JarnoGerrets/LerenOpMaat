import Popup from "../../components/Popup.js";
import SemesterModule from "../../components/SemesterModule.js";

let filterDropdown;
let mijnPopup;
let closeFilterDropdownHandler;
let modulesData = [];
let selectedCategories = [];
let selectedCategory;

export default async function SemesterChoice() {
    // Hardcoded data for 4 semester modules
    modulesData = [
        { name: 'Module 1', description: 'Introduction to Programming', Category: 'SE' },
        { name: 'Module 2', description: 'Web Development Basics', Category: 'BIM' },
        { name: 'Module 3', description: 'Data Structures and Algorithms', Category: 'IDNS' },
        { name: 'Module 4', description: 'Database Management Systems', Category: 'SE' },
        { name: 'Module 1', description: 'Introduction to Programming', Category: 'BIM' },
        { name: 'Module 2', description: 'Web Development Basics', Category: 'IDNS' },
        { name: 'Module 3', description: 'Data Structures and Algorithms', Category: 'SE' },
        { name: 'Module 4', description: 'Database Management Systems', Category: 'BIM' },
        { name: 'Module 1', description: 'Introduction to Programming', Category: 'IDNS' },
        { name: 'Module 2', description: 'Web Development Basics', Category: 'SE' },
        { name: 'Module 3', description: 'Data Structures and Algorithms', Category: 'BIM' },
        { name: 'Module 4', description: 'Database Management Systems', Category: 'IDNS' },
        { name: 'Module 3', description: 'Data Structures and Algorithms', Category: 'BIM' },
        { name: 'Module 4', description: 'Database Management Systems', Category: 'IDNS' },
        { name: 'Module 4', description: 'Database Management Systems', Category: 'IDNS' },
    ];

    // Create the SemesterModules component with the hardcoded data
    const semesterModules = new SemesterModule(modulesData);


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

    mijnPopup.open();
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

        const categories = ['Alles', ...new Set(Data.map(m => m.Category))];
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

function openPopup(filterDropdown){
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
    let filtered = modulesData;

    if (selectedCategories.length > 0) {
        filtered = filtered.filter(m => selectedCategories.includes(m.Category));
    }

    if (searchTerm) {
        filtered = filtered.filter(m =>
            m.name.toLowerCase().includes(searchTerm) ||
            m.description.toLowerCase().includes(searchTerm)
        );
    }

    const data = new SemesterModule(filtered);
    mijnPopup.contentContainer.innerHTML = '';
    mijnPopup.contentContainer.appendChild(data.render());
}