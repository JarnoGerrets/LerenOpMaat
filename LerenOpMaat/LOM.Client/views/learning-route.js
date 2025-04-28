import SemesterPair from "../components/semester-pair.js";
import { getLearningRoutesByUserId, postLearningRoute, updateSemester } from "../../client/api-client.js";
import { learningRouteArray } from "../../components/semester-pair.js";

//dummyApiResponse om de route met 2 locked moduls te testen
//dummyApiResponse2 om een lege route te testen
import { dummyApiResponse, dummyApiResponse2, dummySemester1, dummySemester2 } from "../components/dummyData2.js";

export default async function LearningRoute() {
    const response = await fetch("/templates/learning-route.html");
    const html = await response.text();
    const template = document.createElement("template");
    template.innerHTML = html;
    const fragment = template.content.cloneNode(true);
    const grid = fragment.querySelector(".semester-grid");
    let semesterData = [];
    let routeId = null;
    let apiResponse = [];

    try {
        //comment apiResponse & uncomment de 2e apiResponse to use dummy data
        apiResponse = await getLearningRoutesByUserId(1);

        //Uncomment deze regel om dummy data te gebruiken
        //apiResponse = null;

        console.log("API Response:", apiResponse); //Added bij Elias voor debugging

        if (
            !apiResponse.Semesters ||
            !Array.isArray(apiResponse.Semesters) ||
            apiResponse.Semesters.length === 0
        ) {
            console.error("Geen geldige semesters gevonden in de API-respons:", apiResponse.learninRoute?.semesters); //Elias voor debugging
        } else {
            semesterData = apiResponse.Semesters;
            routeId = apiResponse.Id;
            console.log("Route ID opgeslagen:", routeId); //Elias voor debugging
        }
    } catch (error) {
        console.error("Error fetching semester data:", error.message); //debugging added bij Elias
        semesterData = dummyApiResponse2.Semesters; // Gebruik de dummy data bij een fout
    }

    const semesterDataGroupedByYear = semesterData.reduce((acc, data) => {
        const year = data.Year; // dit moet nog gefixt worden maar er is nog geen kolom in de db voor de semester jaar.
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

            const dummySemesterPair = await SemesterPair(dummySemester1, dummySemester2, index, totalSemestersGroup);

            //debufging added bij Elias
            if (!(dummySemesterPair instanceof Node)) {
                console.error(`Dummy SemesterPair for index ${index} is not a valid Node:`, dummySemesterPair);
                continue;
            }

            grid.appendChild(dummySemesterPair);
            index++;
        }
    }

    document.body.appendChild(fragment);

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
                console.log("API Response succesvol geëxporteerd.");
            } else {
                console.error("Geen API Response beschikbaar om te exporteren.");
            }
        });
    }

    return fragment;
}

async function saveLearningRoute(learningRouteArray) {
    if (Array.isArray(learningRouteArray) && learningRouteArray.length > 0) {
        const jsonData = {
            //Route Name en Users moeten later aangepast worden.
            //De user ID moet nog uit de ingelogde gebruiker gehaald worden.
            //Route name ik weet niet of dat nodig is.
            Name: "Test Route 2",
            Users: [
                {
                    Id: 2,
                    Name: "Robin Hood"
                }
            ],
            Semesters: learningRouteArray.map(item => ({
                Year: item.Year,
                semester: item.semester,
                moduleId: (item.moduleId === 200000 || item.moduleId === 300000) ? null : item.moduleId
            }))
        };
        console.log("Verzonden JSON-data:", JSON.stringify(jsonData, null, 2)); // Debugging added bij Elias
        try {
            await postLearningRoute(jsonData);
            console.log("Leerroute succesvol opgeslagen:", jsonData); // Debugging added bij Elias
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
        semester: item.semester,
        moduleId: (item.moduleId === 200000 || item.moduleId === 300000) ? null : item.moduleId
    }));

    try {
        const response = await updateSemester(routeId, body);

        if (!response) {
            console.error(`Fout bij het updaten van de learning route: ${response.status}`);
            return;
        } else {
            console.log("Learning route succesvol geüpdatet.");
        }
    } catch (error) {
        if (error && error.message) {
            console.error("Fout bij het updaten van de learning route:", error.message);
        } else {
            console.error("Onbekende fout bij het updaten van de learning route.");
        }
    }
};


