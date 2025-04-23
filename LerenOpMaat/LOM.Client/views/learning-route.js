import SemesterPair from "../components/semester-pair.js";
import { modulesArray } from "../components/semester-card.js"; // Correcte import
import { getLearningRoutesById } from "../../client/api-client.js";

export default async function LearningRoute() {
    const response = await fetch("/templates/learning-route.html");
    const html = await response.text();
    const template = document.createElement("template");
    template.innerHTML = html;
    const fragment = template.content.cloneNode(true);
    const grid = fragment.querySelector(".semester-grid");

    let semesterData = [];
    try {
        const apiResponse = await getLearningRoutesById(1);
        console.log("API Response:", apiResponse);

        if (!apiResponse.semesters || !Array.isArray(apiResponse.semesters.$values) || apiResponse.semesters.$values.length === 0) {
            console.error("Geen geldige semesters gevonden in de API-respons:", apiResponse.semesters);

            //hier moet nog dummy data komen.

        } else {
            semesterData = apiResponse.semesters.$values;
        }

        // Geeft de data terug zodat je deze in de console kunt inspecteren

    } catch (error) {
        console.error("Error fetching semester data:", error.message);
    }

    // Groepeer de data op jaar
    const semesterDataGroupedByYear = semesterData.reduce((acc, data) => {
        const year = data.year; // Gebruik de 'year'-eigenschap direct
        if (!acc[year]) {
            acc[year] = [];
        }
        acc[year].push(data);
        return acc;
    }, {});

    let index = 0;
    const totalAmountOfYears = Object.keys(semesterDataGroupedByYear).length;

    // Verwerk de semesters per jaar
    for (const [year, semesterGroup] of Object.entries(semesterDataGroupedByYear)) {
        // Sorteer de semesters binnen een jaar op semester-nummer
        semesterGroup.sort((a, b) => a.semester - b.semester);

        // Controleer of er twee semesters zijn om een pair te maken
        const semester1 = semesterGroup.find(s => s.semester === 1);
        const semester2 = semesterGroup.find(s => s.semester === 2);

        const semesterPair = await SemesterPair(semester1, semester2, index, totalAmountOfYears);

        if (!(semesterPair instanceof Node)) {
            console.error("SemesterPair is not a valid Node:", semesterPair);
            continue; // Sla deze iteratie over als het geen Node is
        }

        grid.appendChild(semesterPair);
        index++;
    }

    document.body.appendChild(fragment);

    const saveButton = document.getElementById("saveLearningRoute");
    if (saveButton) {
        saveButton.addEventListener("click", () => {
            console.log("Exporteren van modulesArray:", modulesArray);
            saveModulesArrayAsJSON(modulesArray);
        });
    } else {
        console.error("Knop met id 'saveLearningRoute' niet gevonden!");
    }

    return fragment;
}

function saveModulesArrayAsJSON(modulesArray) {
    if (Array.isArray(modulesArray) && modulesArray.length > 0) {
        const json = JSON.stringify(modulesArray, null, 2);
        const blob = new Blob([json], { type: "application/json" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "modulesArray.json";
        link.click();
    } else {
        console.error("modulesArray is leeg of geen array!");
    }
}

window.fetchLearningRoute = async function () {
    try {
        const res = await getLearningRoutesById(1);
        console.log("Learning Route Data:", res);
        return res; // Geeft de data terug zodat je deze in de console kunt inspecteren
    } catch (error) {
        console.error("Error fetching learning route:", error.message);
    }
};