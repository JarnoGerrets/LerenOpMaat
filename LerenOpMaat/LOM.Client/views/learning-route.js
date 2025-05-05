import SemesterPair from "../components/semester-pair.js";
import { getLearningRoutesByUserId, postLearningRoute, updateSemester, deleteRoute } from "../../client/api-client.js";
import { learningRouteArray } from "../../components/semester-pair.js";

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
        semesterGroup.sort((a, b) => a.Periode - b.Periode);

        const semester1 = semesterGroup.find(s => s.Periode === 1);
        const semester2 = semesterGroup.find(s => s.Periode === 2);

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
    const saveButton = fragment.getElementById("saveLearningRoute");
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

    const exportButton = fragment.getElementById("exportLearningRoute");
    if (exportButton) {
        exportButton.addEventListener("click", async () => {
            if (!apiResponse || !apiResponse.Users || !apiResponse.Semesters) {
                console.error("Geen geldige API Response beschikbaar om te exporteren.");
                return;
            }

            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();

            // Afbeelding configuratie
            const logoUrl = "../images/Windesheim_logo_Zwart.png";
            const imgWidth = 50;
            const imgHeight = 20;
            const pageWidth = doc.internal.pageSize.getWidth();
            const xPosition = pageWidth - imgWidth - 10;
            const yPosition = 10;

            const img = new Image();
            img.src = logoUrl;

            img.onload = () => {
                doc.addImage(img, "PNG", xPosition, yPosition, imgWidth, imgHeight);

                const user = apiResponse.Users[0];
                doc.setFontSize(12);
                doc.text(`Voornaam: ${user.FirstName}`, 10, 40);
                doc.text(`Achternaam: ${user.LastName}`, 10, 50);
                doc.text(`Begin jaar: ${user.StartYear}`, 10, 60);

                doc.setLineWidth(0.5);
                doc.line(10, 65, 200, 65);

                let currentYPosition = 70; 
                currentYPosition = 75;
                
                const groupedByYear = apiResponse.Semesters.reduce((acc, semester) => {
                    if (!acc[semester.Year]) {
                        acc[semester.Year] = [];
                    }
                    acc[semester.Year].push(semester);
                    return acc;
                }, {});

                
                for (const year in groupedByYear) {
                    doc.text(`Jaar ${year}:`, 10, currentYPosition);
                    currentYPosition += 10;

                    groupedByYear[year].forEach(semester => {
                        doc.text(
                            `Periode ${semester.Periode}: ${semester.Module.Name}`,
                            20,
                            currentYPosition
                        );
                        currentYPosition += 10;
                    });
                }                
                doc.save("learning-route.pdf");
            };

            img.onerror = () => {
                console.error("Fout bij het laden van de afbeelding.");
            };
        });
    }

    //Willen wij een popup of window.alert gebruiken om het te bevestigen?
    const deleteButton = fragment.getElementById("deleteRoute");
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
                    Periode: item.Periode,
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
        Periode: item.Periode,
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


