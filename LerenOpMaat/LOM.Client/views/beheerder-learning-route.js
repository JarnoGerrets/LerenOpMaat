import {
    getLearningRoutesByUserId,
} from "../client/api-client.js"

import { dummySemester1, dummySemester2 } from "../components/dummyData2.js";
import { showLoading, hideLoading } from "../scripts/utils/loading-screen.js";
import SemesterPair from "../components/semester-pair.js";

let apiResponse = [];
export default async function administratorLearningRoute() {
    const conversationId = sessionStorage.getItem('lom_conversationId');
    const userId = sessionStorage.getItem('lom_userId');
    showLoading();
    const response = await fetch("/templates/beheerder-learning-route.html");
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
            apiResponse = await getLearningRoutesByUserId(userId);
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

            const semesterPair = await SemesterPair(semester1, semester2, index, totalAmountOfYears, { readonly: true });

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

                const dummySemesterPair = await SemesterPair(dummySemester1, dummySemester2, index, totalSemestersGroup, { readonly: true });

                if (!(dummySemesterPair instanceof Node)) {
                    console.error(`Dummy SemesterPair for index ${index} is not a valid Node:`, dummySemesterPair);
                    continue;
                }

                grid.appendChild(dummySemesterPair);
                index++;
            }
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

            // Navigeer naar de beheerder-feedback pagina
            window.location.hash = "#beheerder-feedback";
        });
    }
    return { fragment };
}

