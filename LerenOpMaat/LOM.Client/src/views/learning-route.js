import SemesterPair from "../components/semester-pair.js";
import { getLearningRoutesByUserId, postLearningRoute, updateSemester, deleteRoute } from "../client/api-client.js";
import { learningRouteArray } from "../components/semester-pair.js";

import { dummySemester1, dummySemester2 } from "../components/dummyData2.js";
let apiResponse = [];
export default async function LearningRoute() {
    const cohortYear = parseInt(localStorage.getItem("cohortYear"));

    const response = await fetch("/templates/learning-route.html");
    const html = await response.text();
    const template = document.createElement("template");
    template.innerHTML = html;
    const fragment = template.content.cloneNode(true);
    const grid = fragment.querySelector(".semester-grid");
    let semesterData = [];
    let routeId = null;

    try {
        apiResponse = await getLearningRoutesByUserId(1);

        if (
            !apiResponse.Semesters ||
            !Array.isArray(apiResponse.Semesters) ||
            apiResponse.Semesters.length === 0
        ) {
            console.error("Geen geldige semesters gevonden in de API-respons:", apiResponse.learninRoute?.semesters);
        } else {
            semesterData = apiResponse.Semesters;
            routeId = apiResponse.Id;
        }
    } catch (error) {
        console.error("Error fetching semester data:", error.message);
    }

    const semesterDataGroupedByYear = semesterData.reduce((acc, data) => {
        const year = data.Year;
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
        semesterGroup.sort((a, b) => a.SemesterNumber - b.semester);

        const semester1 = semesterGroup.find(s => s.SemesterNumber === 1);
        const semester2 = semesterGroup.find(s => s.SemesterNumber === 2);

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

            const dummySemesterPair = await SemesterPair(dummySemester1, dummySemester2, index, totalSemestersGroup);

            if (!(dummySemesterPair instanceof Node)) {
                console.error(`Dummy SemesterPair for index ${index} is not a valid Node:`, dummySemesterPair);
                continue;
            }

            grid.appendChild(dummySemesterPair);
            index++;
        }
    }

    //Opslaan knop als de gebruiker al een route heeft dan wordt het aangepast
    //Als er nog geen route is gekoppeld aan de  gebruiker dan maakt hij een nieuwe route
    const saveButton = document.getElementById("saveLearningRoute");
    if (saveButton) {
        saveButton.addEventListener("click", async () => {
            JSON.stringify(learningRouteArray, null, 2);
            if (routeId !== null) {
                try {
                    await updateLearningRoute(routeId, learningRouteArray);

                } catch (error) {
                    console.error("Fout bij het updaten van de learning route:", error.message);
                }
            } else {
                try {
                    await saveLearningRoute(learningRouteArray);
                    console.log("Nieuwe learning route succesvol aangemaakt.");
                } catch (error) {
                    console.error("Fout bij het aanmaken van een nieuwe learning route:", error.message);
                }
            }
        });
    };

    //De export knop werkt alleen als er een apiResponse is dus het werkt niet met dummy data.
    const exportButton = document.getElementById("exportLearningRoute");
    if (exportButton) {
        exportButton.addEventListener("click", () => {
            if (apiResponse) {
                const jsonString = JSON.stringify(apiResponse, null, 2);
                const blob = new Blob([jsonString], { type: "application/json" });
                const url = URL.createObjectURL(blob);

                const a = document.createElement("a");
                a.href = url;
                a.download = "learning-route.json";
                a.click();

                URL.revokeObjectURL(url);
            } else {
                console.error("Geen API Response beschikbaar om te exporteren.");
            }
        });
    };

    //Willen wij een popup of window.alert gebruiken om het te bevestigen?
    const deleteButton = document.getElementById("deleteRoute");
    if (deleteButton) {
        deleteButton.addEventListener("click", async () => {
            if (routeId !== null) {
                try {
                    const isDeleted = await deleteRoute(routeId);
                    if (isDeleted) {
                        location.reload();
                    } else {
                        console.error("Fout bij het verwijderen van de leerroute.");
                    }
                } catch (error) {
                    console.error("Fout bij het verwijderen van de leerroute:", error.message);
                }
            } else {
                console.error("Geen routeId beschikbaar om te verwijderen.");
            }
        });
    }

    return { fragment, init: () => null };
}

async function saveLearningRoute(learningRouteArray) {
    if (Array.isArray(learningRouteArray) && learningRouteArray.length > 0) {
        try {
            const user = apiResponse?.Users?.[0]; // Pak de gebruiker uit de API-response

            if (!user) {
                console.error("Geen gebruikersgegevens gevonden in de API-response.");
                return;
            }

            const jsonData = {
                Users: [
                    {
                        Id: user.Id,
                        FirstName: user.FirstName,
                        LastName: user.LastName,
                        StartYear: 2025
                    }
                ],
                Semesters: learningRouteArray.map(item => ({
                    Year: item.Year,
                    SemesterNumber: item.SemesterNumber,
                    ModuleId: (item.moduleId === 200000 || item.moduleId === 300000) ? null : item.moduleId
                }))
            };
            await postLearningRoute(jsonData);
        } catch (error) {
            console.error("Er is een fout opgetreden bij het opslaan van de leerroute:", error.message);
        }
    } else {
        console.error("learningRouteArray is leeg of geen array!");
    }
};

async function updateLearningRoute(routeId, semesterData) {
    if (!routeId) {
        console.error("Route ID is niet beschikbaar!");
        return;
    }
    const body = semesterData.map(item => ({
        Year: item.Year,
        SemesterNumber: item.SemesterNumber,
        ModuleId: (item.moduleId === 200000 || item.moduleId === 300000) ? null : item.moduleId
    }));

    try {
        const response = await updateSemester(routeId, body);

        if (!response) {
            console.error(`Fout bij het updaten van de learning route: ${response.status}`);
            return;
        } else {
            console.log("Learning route succesvol gepdatet.");
        }
    } catch (error) {
        if (error && error.message) {
            console.error("Fout bij het updaten van de learning route:", error.message);
        } else {
            console.error("Onbekende fout bij het updaten van de learning route.");
        }
    }
};


