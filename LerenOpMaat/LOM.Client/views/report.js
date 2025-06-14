import { reportServices } from "../scripts/utils/importServiceProvider.js";
import { loadTemplate } from "../scripts/utils/universal-utils.js";


export default async function report(services = reportServices) {
    const { getProfiles, getModulesEngagement, getAvailableYears, Chart } = services;
    let showingChart = false;
    const html = await loadTemplate('./templates/report.html');

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    const body = tempDiv.querySelector("body");
    const bodyContent = body ? body.innerHTML : html;

    const fragment = document.createElement("div");
    fragment.style.paddingTop = "15px";
    fragment.innerHTML = bodyContent;

    const tableBody = fragment.querySelector("#modules-engagement-body");
    const yearSelect = fragment.querySelector("#year-select");
    const profileSelect = fragment.querySelector("#profile-select");
    const canvas = fragment.querySelector("#chart-canvas");
    const chartButton = fragment.querySelector("#show-chart-button");
    chartButton.textContent = "Laat grafiek zien";

    let latestData = [];
    let chartInstance = null;

    await initializeYears();
    await initializeProfiles();

    profileSelect.addEventListener("change", () => {
        const year = yearSelect.value ? parseInt(yearSelect.value) : null;
        const profile = profileSelect.value || null;
        loadData(year, profile);
    });

    yearSelect.addEventListener("change", () => {
        const year = yearSelect.value ? parseInt(yearSelect.value) : null;
        const profile = profileSelect.value || null;
        loadData(year, profile);
    });

    async function initializeProfiles() {
        try {
            const profiles = await getProfiles();
            profiles.forEach(profile => {
                const option = document.createElement("option");
                option.value = profile.Id;
                option.textContent = profile.Name;
                profileSelect.appendChild(option);
            });
        } catch (err) {
            console.error("Fout bij ophalen profielen:", err);
            showToast("Fout bij ophalen profielen", "error");
            yearSelect.innerHTML = `<option value="">Geen profielen beschikbaar</option>`;
        }
    }

    const table = fragment.querySelector("table");
    chartButton.addEventListener("click", () => {
        showingChart = !showingChart;
        if (showingChart) {
            table.style.display = "none";
            canvas.style.display = "";
            showChart(latestData);
            chartButton.textContent = "Laat tabel zien";
        } else {
            table.style.display = "";
            if (chartInstance) chartInstance.destroy();
            canvas.style.display = "none";
            chartButton.textContent = "Laat grafiek zien";
            renderUnchosenModules(null, false);
        }
    });

    await loadData(null);

    async function initializeYears() {
        try {
            const years = await getAvailableYears();
            yearSelect.innerHTML = `<option value="">Alle jaren</option>`;
            years.slice().reverse().forEach(year => {
                const option = document.createElement("option");
                option.value = year;
                option.innerHTML = `${year}<sup>e</sup> jaar van studie`;
                yearSelect.appendChild(option);
            });
        } catch (err) {
            console.error("Fout bij ophalen jaren:", err);
            showToast("Fout bij ophalen jaren", "error");
            yearSelect.innerHTML = `<option value="">Geen jaren beschikbaar</option>`;
        }
    }

    async function loadData(year, profile) {
        tableBody.innerHTML = `<tr><td colspan="4">Laden...</td></tr>`;
        try {
            const data = await getModulesEngagement(year, profile);
            latestData = data;

            if (data.length === 0) {
                tableBody.innerHTML = `<tr><td colspan="4">Geen data beschikbaar.</td></tr>`;
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
            if (showingChart) {
                showChart(latestData);
            }
        } catch (err) {
            console.error(err);
            tableBody.innerHTML = `<tr><td colspan="4">Fout bij ophalen data.</td></tr>`;
        }
    }

    // create chart using external library chart.js
    function showChart(data) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const chosenModules = data.filter(row => row.AssignedCount > 0);
        const unchosenModules = data.filter(row => row.AssignedCount === 0);

        const labels = chosenModules.map(row => row.ModuleCode);
        const values = chosenModules.map(row => row.Percentage);

        if (chartInstance) {
            chartInstance.destroy();
        }

        chartInstance = new Chart(canvas, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Percentage gekozen',
                    data: values,
                    backgroundColor: 'rgba(54, 162, 235, 0.5)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false },
                    title: {
                        display: true,
                        text: 'Verdeling modulekeuzes',
                        font: { size: 20 }
                    },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                return context.parsed.y + '%';
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        min: 0,
                        max: 100,
                        ticks: {
                            callback: function (value) {
                                return value + '%';
                            }
                        },
                        title: {
                            display: true,
                            text: 'Percentage gekozen (→)',
                            font: { size: 14, weight: 'bold' }
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Module codes (→)',
                            font: { size: 14, weight: 'bold' }

                        }
                    }
                }
            }
        });

        renderUnchosenModules(unchosenModules, true);
    }

    function renderUnchosenModules(modules, toShow) {
        const listContainer = fragment.querySelector("#unchosen-modules");

        if (toShow) {
            listContainer.innerHTML = "";
            const filteredModules = modules.filter(m =>
                m.ModuleName !== "Afstuderen" &&
                m.ModuleName !== "Multidisciplinaire Opdracht"
            );

            if (filteredModules.length === 0) {
                listContainer.innerHTML = "<p>Alle modules zijn minstens één keer gekozen.</p>";
                return;
            }

            const header = document.createElement("p");
            header.textContent = "Niet gekozen modules:";
            header.style.fontWeight = "bold";
            listContainer.appendChild(header);

            const itemsPerColumn = 7;
            const totalColumns = Math.ceil(modules.length / itemsPerColumn);
            const columns = Array.from({ length: totalColumns }, () => []);

            filteredModules.forEach((module, index) => {
                const columnIndex = Math.floor(index / itemsPerColumn);
                columns[columnIndex].push(module);
            });

            const columnsContainer = document.createElement("div");
            columnsContainer.style.display = "flex";
            columnsContainer.style.gap = "20px";

            columns.forEach(column => {
                const ul = document.createElement("ul");
                column.forEach(row => {
                    const li = document.createElement("li");
                    li.textContent = `${row.ModuleCode} - ${row.ModuleName}`;
                    ul.appendChild(li);
                });
                columnsContainer.appendChild(ul);
            });

            listContainer.appendChild(columnsContainer);
        } else {
            listContainer.innerHTML = "";
        }
    }

    return { fragment };
}
