import SemesterPair from "../components/semester-pair.js";
import { getLearningRoutesByUserId, postLearningRoute } from "../../client/api-client.js";
import { learningRouteArray } from "../../components/semester-pair.js";

//dummyApiResponse om de route met 2 locked moduls te testen
//dummyApiResponse2 om een leger route te testen
import { dummyApiResponse, dummyApiResponse2, dummySemester1, dummySemester2 } from "../components/dummyData2.js";



export default async function LearningRoute() {
    const response = await fetch("/templates/learning-route.html");
    const html = await response.text();
    const template = document.createElement("template");
    template.innerHTML = html;
    const fragment = template.content.cloneNode(true);
    const grid = fragment.querySelector(".semester-grid");
    let semesterData = [];

    try {
        //comment apiResponse & uncomment de 2e apiResponse to use dummy data
        const apiResponse = await getLearningRoutesByUserId(1);

        //Uncomment deze regel om dummy data te gebruiken
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
            saveLearningRoute(learningRouteArray);
        });
    }
    return fragment;
}