import SemesterPair from "../components/semester-pair.js";
import { getLearningRoutesByUserId } from "../../client/api-client.js";
import { learningRouteArray } from "../../components/semester-pair.js";

//Beide dummy data kan je gebruiken in regeld 38
import { dummyApiResponse } from "../components/dummyData.js"; //deze is de normale dummy data
import { dummyApiResponse2 } from "../components/dummyData2.js"; //deze is bedoeld voor de export.



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
        const apiResponse = await getLearningRoutesByUserId(2);
        //const apiResponse = null;
        console.log("API Response:", apiResponse); //Added bij Elias voor debugging

        if (
            !apiResponse.Semesters ||
            !Array.isArray(apiResponse.Semesters) ||
            apiResponse.Semesters.length === 0
        ) {
            console.error("Geen geldige semesters gevonden in de API-respons:", apiResponse.learninRoute?.semesters); //Elias voor debugging
        } else {
            semesterData = apiResponse.Semesters;
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

            const dummySemester1 = {
                Id: 600000,
                Year: new Date().getFullYear(),
                semester: 1,
                Module: {
                    Id: 200000,
                    Name: "Selecteer je module",
                    description: "Selecteer je module",
                },
                locked: false,
                Description: `2027-01-01T00:00:00Z`,
            };

            const dummySemester2 = {
                Id: 500000,
                Year: new Date().getFullYear(),
                semester: 2,
                Module: {
                    Id: 300000,
                    Name: "Selecteer je module",
                    Description: "Selecteer je module",
                },
                locked: false,
                startDate: `2027-10-07T00:00:00Z`,
            };

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

    const saveButton = document.getElementById("saveLearningRoute");
    if (saveButton) {
        saveButton.addEventListener("click", () => {
            console.log("Exporteren van learningRouteArray:", learningRouteArray);
            saveModulesArrayAsJSON(learningRouteArray);
        });
    }
    return fragment;
}

//deze is een test om de API call eerst goed te vullen met data.
function saveModulesArrayAsJSON(learningRouteArray) {
    if (Array.isArray(learningRouteArray) && learningRouteArray.length > 0) {
        const jsonData = {
            Name: "Test Learning Route",
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

        const json = JSON.stringify(jsonData, null, 2);
        const blob = new Blob([json], { type: "application/json" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "learningRoute.json";
        link.click();
    } else {
        console.error("learningRouteArray is leeg of geen array!");
    }
};