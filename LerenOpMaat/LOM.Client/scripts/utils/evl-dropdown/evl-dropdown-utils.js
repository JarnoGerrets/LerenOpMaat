export function updateEvlSelectionHeader(dropdownMenu) {
    const checkboxes = dropdownMenu.querySelectorAll('input[type="checkbox"][name="evl"]');
    let total = 0;

    checkboxes.forEach((checkbox) => {
        if (checkbox.checked) {
            const inputName = `ec-${checkbox.value.toLowerCase()}`;
            const ecInput = dropdownMenu.querySelector(`input[name="${inputName}"]`);
            const ecValue = parseInt(ecInput?.value);
            if (!isNaN(ecValue)) {
                total += ecValue;
            }
        }
    });

    const header = document.getElementById("evlSelectionHeader");
    if (total > 0) {
        header.textContent = `${total}`;
    } else {
        header.textContent = 'Selecteer EVLs';
    }
}

export function getSelectedEVLs(existingEvls = []) {
    const selected = [];
    let totalEC = 0;

    document.querySelectorAll('.dropdown-menu input[type="checkbox"]:checked').forEach(checkbox => {
        const evlValue = checkbox.value;
        const numberInput = checkbox.closest('.evl-option').querySelector('input[type="number"]');
        const ec = parseInt(numberInput.value) || 0;

        totalEC += ec;

        const existing = existingEvls.find(e => e.Name === evlValue);

        selected.push({
            Id: existing?.Id ?? 0,
            Name: evlValue,
            Ec: ec
        });
    });

    return { totalEC, evls: selected };
}

export function setupListeners() {

    const dropdownToggle = document.getElementById("evl-dropdown-toggle");
    const dropdownMenu = document.getElementById("evl-dropdown-menu");

    dropdownToggle.addEventListener("click", () => {
        dropdownMenu.classList.toggle("hidden");
    });

    const checkboxes = dropdownMenu.querySelectorAll('input[type="checkbox"][name="evl"]');
    const ecInputs = dropdownMenu.querySelectorAll('.ec-input');

    checkboxes.forEach(cb =>
        cb.addEventListener('change', () => updateEvlSelectionHeader(dropdownMenu))
    );
    ecInputs.forEach(input =>
        input.addEventListener('input', () => updateEvlSelectionHeader(dropdownMenu))
    );

    document.addEventListener("click", (event) => {
        const isClickInsideDropdown = dropdownToggle.contains(event.target) || dropdownMenu.contains(event.target);

        if (!isClickInsideDropdown) {
            dropdownMenu.classList.add("hidden");
        }
    });
}

export function hideDropdown() {
    const dropdownMenu = document.getElementById("evl-dropdown-menu");
    dropdownMenu.classList.toggle("hidden");

}