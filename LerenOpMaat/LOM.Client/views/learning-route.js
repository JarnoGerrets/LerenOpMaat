import {
    getLearningRoutesByUserId,
    postLearningRoute,
    updateSemester,
    postConversation,
    getConversationByUserId,
    deleteRoute,
    validateRoute
} from "../client/api-client.js"

import { learningRouteArray } from "../components/semester-pair.js";
import { dummySemester1, dummySemester2 } from "../components/dummyData2.js";
import { showLoading, hideLoading } from "../scripts/utils/loading-screen.js";
import { debounce } from "../scripts/utils/universal-utils.js";
import SemesterPair from "../components/semester-pair.js";
import confirmationPopup from "./partials/confirmation-popup.js";
import AddIconButton from "../components/add-icon-button.js";
import { handleValidationResult } from "../scripts/utils/semester-card-utils/validations.js";

let apiResponse = [];
export default async function LearningRoute() {
    showLoading();
    const cohortYear = parseInt(localStorage.getItem("cohortYear"));
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
                insertCornerConnector();
                const newSemesterPair = await SemesterPair(dummySemester1, dummySemester2, index, index + 1);
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

        const isEven = (num) => num % 2 === 0;
        const insertCornerConnector = () => {
            // Replace the placeholder with a corner connector because its not the last year anymore.
            const placeholder = document.querySelector(".connector-placeholder");
            if (!placeholder) {
                console.error("Connector placeholder not found.");
                return;
            }

            // Remove all classes and styling from the placeholder
            placeholder.className = "";
            placeholder.style = "";

            // Replace with corner connector
            placeholder.classList.add("corner-connector");
            if (isEven(index)) {
                placeholder.classList.add("left");
            } else {
                placeholder.classList.add("right");
            }
        };

        addSemesterContainer.appendChild(addIconButton.getHtml());

        grid.appendChild(addSemesterContainer);

        //Opslaan knop als de gebruiker al een route heeft dan wordt het aangepast
        //Als er nog geen route is gekoppeld aan de  gebruiker dan maakt hij een nieuwe route
        const saveButton = fragment.getElementById("saveLearningRoute");
        if (saveButton) {
            const debouncedSave = debounce(async () => {
                JSON.stringify(learningRouteArray, null, 2);
                if (routeId !== null) {
                    try {
                        await updateLearningRoute(routeId, learningRouteArray);
                    } catch (error) {
                        showToast("Fout bij het opslaan van de leerroute", "error");
                    }
                } else {
                    try {
                        await saveLearningRoute(learningRouteArray);
                    } catch (error) {
                        showToast("Fout bij het opslaan van de leerroute", "error");
                    }
                }
            }, 500);

            saveButton.addEventListener("click", debouncedSave);
        }

        const exportButton = fragment.getElementById("exportLearningRoute");
        if (exportButton) {
            exportButton.addEventListener("click", async () => {
                let user, semesters, isFallback = false;
                if (!apiResponse || !apiResponse.User || !apiResponse.Semesters) {
                    semesters = learningRouteArray;
                    user = {
                        FirstName: "Gast",
                        LastName: "",
                        StartYear: cohortYear
                    };
                    isFallback = true;
                } else {
                    semesters = apiResponse.Semesters;
                    user = apiResponse.User;
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

                    doc.setFontSize(12);
                    doc.text(`Voornaam: ${user.FirstName}`, 10, 40);
                    doc.text(`Achternaam: ${user.LastName}`, 10, 50);
                    doc.text(`Begin jaar: ${user.StartYear}`, 10, 60);

                    doc.setLineWidth(0.5);
                    doc.line(10, 65, 200, 65);

                    let currentYPosition = 75;

                    // Groepeer semesters per jaar
                    const groupedByYear = semesters.reduce((acc, semester) => {
                        const year = semester.Year;
                        if (!acc[year]) acc[year] = [];
                        acc[year].push(semester);
                        return acc;
                    }, {});

                    for (const year in groupedByYear) {
                        doc.text(`Jaar ${year}:`, 10, currentYPosition);
                        currentYPosition += 10;

                        groupedByYear[year].forEach(semester => {
                            // Fallback: module info kan anders zijn
                            let moduleName = semester.Module?.Name;
                            if (isFallback) {
                                moduleName = semester.moduleName || "Onbekend";
                            }
                            // Maak leeg als de moduleName "Selecteer je module" is
                            if (moduleName === "Selecteer je module") {
                                moduleName = "";
                            }
                            if (moduleName) {
                                doc.text(
                                    `Periode ${semester.Period}: ${moduleName}`,
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
                    showToast("Er is een fout opgetreden, neem contact op met de beheerder", "error");
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
                    showToast("Leerroute verwijderd", "success");
                } else {
                    showToast("Fout bij het verwijderen van leerroute", "error");
                }
            });
        }
    } catch (error) {
        showToast("Er ging iets fouten tijdens het laden van de leerroute, probeer het later nog eens.", "error");
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

    const validation = await validateRoute(learningRouteArray);
    handleValidationResult(validation, undefined, fragment);

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
        try {
            const result = await postLearningRoute(jsonData);
            if (result) {
                if (Array.isArray(result)) {
                    handleValidationResult(result);
                    showToast("Kan leerroute niet opslaan", "error");
                } else {
                    showToast("Leerroute opgeslagen", "success");
                }
                return;
            }

            sessionStorage.setItem("postReloadToast", JSON.stringify({
                message: "Leerroute opgeslagen",
                type: "success"
            }));
            location.reload();
        } catch (error) {
            showToast("Fout bij het opslaan van de leerroute", "error");
        }
    } else {
        showToast("Fout bij het opslaan van de leerroute", "error");
        throw new Error("learningRouteArray is leeg of geen array!");
    }

};

async function updateLearningRoute(routeId, semesterData) {
    const user = apiResponse?.User;
    if (!routeId) {
        console.error("Route ID is niet beschikbaar!");
        return;
    }
    const body = {
        Id: routeId,
        UserId: user.Id,
        Semesters: semesterData.map(item => ({
            Year: item.Year,
            Period: item.Period,
            ModuleId: (item.moduleId === 200000 || item.moduleId === 300000) ? null : item.moduleId
        }))
    };


    try {
        const result = await updateSemester(routeId, body);
        if (result) {
            if (Array.isArray(result)) {
                handleValidationResult(result);
                showToast("Kan leerroute niet opslaan", "error");
            } else {
                showToast("Leerroute opgeslagen", "success");
            }
            return;
        }

        sessionStorage.setItem("postReloadToast", JSON.stringify({
            message: "Leerroute opgeslagen",
            type: "success"
        }));
        // location.reload();
    } catch (error) {
        if (error && error.message) {
            showToast("Fout bij het opslaan van leerroute", "error");
        } else {
            showToast("Fout bij het opslaan van leerroute", "error");
        }
    }
};


