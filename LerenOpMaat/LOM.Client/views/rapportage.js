import { getModulesEngagement, getAvailableYears } from '../client/api-client.js';

export default async function rapportage() {
    const response = await fetch('./templates/rapportage.html');
    const html = await response.text();

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    const body = tempDiv.querySelector("body");
    const bodyContent = body ? body.innerHTML : html;

    const fragment = document.createElement("div");
    fragment.innerHTML = bodyContent;

    const tableBody = fragment.querySelector("#modules-engagement-body");
    const yearSelect = fragment.querySelector("#year-select");

    try {
        const years = await getAvailableYears();
        yearSelect.innerHTML = `<option value="">Alle jaren</option>`;
        years.forEach(year => {
            const option = document.createElement("option");
            option.value = year;
            option.textContent = year;
            yearSelect.appendChild(option);
        });
    } catch (err) {
        console.error("Fout bij ophalen jaren:", err);
    }

    yearSelect.addEventListener("change", () => {
        const year = yearSelect.value ? parseInt(yearSelect.value) : null;
        loadData(year);
    });

    loadData(null);

    async function loadData(year) {
        tableBody.innerHTML = `<tr><td colspan="3">Laden...</td></tr>`;
        try {
            const data = await getModulesEngagement(year);
            if (data.length === 0) {
                tableBody.innerHTML = `<tr><td colspan="3">Geen data beschikbaar.</td></tr>`;
            } else {
                tableBody.innerHTML = "";
                data.forEach(row => {
                    const tr = document.createElement("tr");
                    tr.innerHTML = `
                        <td>${row.ModuleCode}</td>
                        <td>${row.ModuleName}</td>
                        <td>${row.AssignedCount}</td>
                        <td>${row.Percentage.toFixed(1)}%</td>
                    `;
                    tableBody.appendChild(tr);
                });
            }
        } catch (err) {
            console.error(err);
            tableBody.innerHTML = `<tr><td colspan="3">Fout bij ophalen data.</td></tr>`;
        }
    }

    return { fragment };
}
