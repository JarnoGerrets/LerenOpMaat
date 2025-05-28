import {
    getLearningRoutesByUserId,
    postLearningRoute,
    updateSemester,
    postConversation,
    getConversationByUserId,
    deleteRoute
} from "../client/api-client.js"

import { learningRouteArray } from "../../components/semester-pair.js";
import { dummySemester1, dummySemester2 } from "../components/dummyData2.js";
import { showLoading, hideLoading } from "../scripts/utils/loading-screen.js";

import SemesterPair from "../components/semester-pair.js";
import confirmationPopup from "./partials/confirmation-popup.js";
import AddIconButton from "../components/add-icon-button.js";


let apiResponse = [];
export default async function LearningRoute() {
    showLoading();

    const response = await fetch("/templates/learning-route.html");
    const html = await response.text();
    const template = document.createElement("template");
    template.innerHTML = html;
    const fragment = template.content.cloneNode(true);
    const grid = fragment.querySelector(".semester-grid");
    let semesterData = [];
    let routeId = null;

    let userData = await window.userData;

    try {
        if (userData && userData.InternalId) {
            apiResponse = await getLearningRoutesByUserId(userData.InternalId);
            if (
                !apiResponse.Semesters ||
                !Array.isArray(apiResponse.Semesters) ||
                apiResponse.Semesters.length === 0
            ) {
                // not needed as this will be intended behavior. could decide to add logging here
                // console.error("Geen geldige semesters gevonden in de API-respons:", apiResponse.learninRoute?.semesters);
            } else {
                semesterData = apiResponse.Semesters;
                routeId = apiResponse.Id;
            }
        } else {
            semesterData = [dummySemester1, dummySemester2];
            //document.querySelector("#app").appendChild(fragment);
            ["saveLearningRoute", "deleteRoute", "feedBack"].forEach(id => {
                const btn = fragment.getElementById(id);
                if (btn) btn.disabled = true;
            });
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
            semesterGroup.sort((a, b) => a.Period - b.Period);

            const semester1 = semesterGroup.find(s => s.Period === 1);
            const semester2 = semesterGroup.find(s => s.Period === 2);

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

        // Some students might follow a route that takes longer than 4 years, so we add a button to add more semesters
        // It should only be added here if the previous row already shows the add button.
        const addSemesterContainer = document.createElement("div");
        const addIconButton = new AddIconButton({
            onclick: async () => {
                const newSemesterPair = await SemesterPair(dummySemester1, dummySemester2, index);
                grid.appendChild(newSemesterPair);
                index++;

                addSemesterContainer.remove();

                // Its assumed here that no student will have more than 20 semesters in their learning route.
                // This is a safety check which prevents the user from purposely trying to overload the system.
                if (index < 20) {
                    grid.appendChild(addSemesterContainer);
                }
            }
        });

        addSemesterContainer.appendChild(addIconButton.getHtml());

        grid.appendChild(addSemesterContainer);

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
                if (!apiResponse || !apiResponse.User || !apiResponse.Semesters) {
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

                    const user = apiResponse.User;
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
                            if (semester.Module) { // Controleer of Module niet null is
                                doc.text(
                                    `Periode ${semester.Period}: ${semester.Module.Name}`,
                                    20,
                                    currentYPosition
                                );
                                currentYPosition += 10;
                            }
                        });
                    }
                    doc.save("learning-route.pdf");
                };

                img.onerror = () => {
                    console.error("Fout bij het laden van de afbeelding.");
                };
            });
        }
        const header = `
                    <h3 class="popup-header-confirmation">
                        Verwijderen leerroute
                    </h3>
                `;
        const content = `
                    <div class="confirmation-popup-content">
                    <p>Weet u zeker dat u uw leerroute wilt verwijderen?</p>
                    <div class="confirmation-popup-buttons"> 
                        <button id="confirm-confirmation-popup"" class="confirmation-accept-btn">Ja</button>
                        <button id="cancel-confirmation-popup"" class="confirmation-deny-btn">Nee</button>
                    </div>
                    </div>`;

        const deleteButton = fragment.getElementById("deleteRoute");
        if (deleteButton) {
            deleteButton.addEventListener("click", async () => {
                if (routeId !== null) {
                    await confirmationPopup("Leerroute", routeId, header, content, deleteRoute, "/");
                } else {
                    console.error("Geen routeId beschikbaar om te verwijderen.");
                }
            });
        }
    } catch (error) {
        showToast("Er ging iets fouten tijdens het laden van de leerroute, probeer het later nog eens.", "error");
        console.error("Error fetching semester data:", error.message);
    } finally {
        hideLoading();
    }

    const feedbackButton = fragment.getElementById("feedBack");
    if (feedbackButton) {
        feedbackButton.addEventListener("click", async (e) => {
            e.preventDefault();

            // Haal gebruiker en routeId op
            const user = apiResponse?.User;
            if (!user || !routeId) {
                console.error("Gebruiker of routeId niet gevonden.");
                window.location.hash = "#feedback";
                return;
            }

            // Controleer of conversatie al bestaat
            let conversation = await getConversationByUserId(user.Id);

            if (!conversation) {
                // Conversation bestaat niet, maak een nieuwe aan
                const conversationBody = {
                    LearningRouteId: routeId,
                    StudentId: user.Id
                };
                try {
                    await postConversation(conversationBody);
                } catch (err) {
                    console.error("Kon conversatie niet aanmaken:", err);
                    return;
                }
            }

            // Open feedbackpagina
            window.location.hash = "#feedback";
        });
    }



    return { fragment };
}

async function saveLearningRoute(learningRouteArray) {
    if (Array.isArray(learningRouteArray) && learningRouteArray.length > 0) {
        const user = apiResponse?.User;
        if (!user) {
            throw new Error("Geen gebruikersgegevens gevonden in de API-response.");
        }
        const jsonData = {
            UserId: user.Id,
            Semesters: learningRouteArray.map(item => ({
                Year: item.Year,
                Period: item.Period,
                ModuleId: (item.moduleId === 200000 || item.moduleId === 300000) ? null : item.moduleId
            }))
        };
        const result = await postLearningRoute(jsonData);
        if (!result) {
            throw new Error("De server gaf geen geldige respons terug bij het aanmaken van de leerroute.");
        }
        location.reload();
    } else {
        throw new Error("learningRouteArray is leeg of geen array!");
    }
};

async function updateLearningRoute(routeId, semesterData) {
    if (!routeId) {
        console.error("Route ID is niet beschikbaar!");
        return;
    }
    const body = semesterData.map(item => ({
        Year: item.Year,
        Period: item.Period,
        ModuleId: (item.moduleId === 200000 || item.moduleId === 300000) ? null : item.moduleId
    }));

    try {
        const response = await updateSemester(routeId, body);

        if (!response) {
            console.error(`Fout bij het updaten van de learning route: ${response.status} `);
            return;
        } else {
            console.log("Learning route succesvol gepdatet.");
            location.reload();
        }
    } catch (error) {
        if (error && error.message) {
            console.error("Fout bij het updaten van de learning route:", error.message);
        } else {
            console.error("Onbekende fout bij het updaten van de learning route.");
        }
    }
};


