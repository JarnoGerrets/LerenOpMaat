import SemesterPair from "../components/semester-pair.js";
import { modulesArray } from "../components/semester-card.js"; // Correcte import
import { getLearningRoutesByUserId } from "../../client/api-client.js";
import { dummyApiResponse } from "../components/dummyData.js";

export default async function LearningRoute() {
    const response = await fetch("/templates/learning-route.html");
    const html = await response.text();
    const template = document.createElement("template");
    template.innerHTML = html;
    const fragment = template.content.cloneNode(true);
    const grid = fragment.querySelector(".semester-grid");

    let semesterData = [];
    try {
        //Dummy route in DB 
        //comment apiResponse & uncomment de 2e apiResponse to use dummy data
        const apiResponse = await getLearningRoutesByUserId(1);
        //const apiResponse = null;
        console.log("API Response:", apiResponse); //Added bij Elias voor debugging

        if (
            !apiResponse.semesters ||
            !Array.isArray(apiResponse.semesters) ||
            apiResponse.semesters.length === 0
        ) {
            console.error("Geen geldige semesters gevonden in de API-respons:", apiResponse.learninRoute?.semesters); //Elias voor debugging
        } else {
            semesterData = apiResponse.semesters;
        }
    } catch (error) {
        console.error("Error fetching semester data:", error.message); //debugging added bij Elias
        semesterData = dummyApiResponse.semesters.$values; // Gebruik de dummy data bij een fout
    }

    const semesterDataGroupedByYear = semesterData.reduce((acc, data) => {
        const year = data.year; // dit moet nog gefixt worden maar er is nog geen kolom in de db voor de semester jaar.
        if (!acc[year]) {
            acc[year] = [];
        }
        acc[year].push(data);
        return acc;
    }, {});

    let index = 0;
    const totalAmountOfYears = Object.keys(semesterDataGroupedByYear).length;

    // Sorteer de jaren en verwerk de semesters per jaar
    const sortedYears = Object.entries(semesterDataGroupedByYear).sort(([yearA], [yearB]) => yearA - yearB);

    for (const [year, semesterGroup] of sortedYears) {
        console.log(`Processing year: ${year}`); // Added by Elias for debugging

        // Sorteer de semesters binnen een jaar op semester-nummer
        semesterGroup.sort((a, b) => a.semester - b.semester);

        const semester1 = semesterGroup.find(s => s.semester === 1);
        const semester2 = semesterGroup.find(s => s.semester === 2);

        const semesterPair = await SemesterPair(semester1, semester2, index, totalAmountOfYears);

        if (!(semesterPair instanceof Node)) {
            console.error(`SemesterPair for year ${year} is not a valid Node:`, semesterPair);
            continue;
        }

        grid.appendChild(semesterPair);
        index++;
    }

    const totalSemestersGroup = 4;

    // Controleer of er minder dan 8 semesters zijn en vul de ontbrekende semesters aan
    if (index < totalSemestersGroup) {
        const missingSemesters = totalSemestersGroup - index;

        for (let i = 0; i < missingSemesters; i++) {
            console.log(`Adding dummy semester pair for index: ${index}`); // Debugging

            const dummySemester1 = {
                id: 600000,
                year: new Date().getFullYear(),
                semester: 1,
                module: {
                    id: 200000,
                    name: "Selecteer je module",
                    description: "Selecteer je module",
                },
                locked: false,
                startDate: `2027-01-01T00:00:00Z`,
            };

            const dummySemester2 = {
                id: 500000,
                year: new Date().getFullYear(),
                semester: 2,
                module: {
                    id: 300000,
                    name: "Selecteer je module",
                    description: "Selecteer je module",
                },
                locked: false,
                startDate: `2027-10-07T00:00:00Z`,
            };

            const dummySemesterPair = await SemesterPair(dummySemester1, dummySemester2, index, totalSemestersGroup);

            if (!(dummySemesterPair instanceof Node)) {
                console.error(`Dummy SemesterPair for index ${index} is not a valid Node:`, dummySemesterPair);
                continue; // Ga naar de volgende zonder index te verhogen
            }

            grid.appendChild(dummySemesterPair);
            index++; // Verhoog index alleen als een geldig semesterPair is toegevoegd
        }
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

//Dit is voor het exporteren van de leermodule niet verwijderen
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
        const res = await getLearningRoutesByUserId(1);
        console.log("Learning Route Data:", res);
        return res; // Geeft de data terug zodat je deze in de console kunt inspecteren
    } catch (error) {
        console.error("Error fetching learning route:", error.message);
    }
};