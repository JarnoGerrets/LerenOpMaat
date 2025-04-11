import SemesterPair from "../components/semester-pair.js";

export default async function LearningRoute() {
    const response = await fetch("/templates/learning-route.html");
    const html = await response.text();
    const template = document.createElement("template");
    template.innerHTML = html;
    const fragment = template.content.cloneNode(true);
    const grid = fragment.querySelector(".semester-grid");

    const semesterData = [
        { semester: 1, module: "Basisconcepten ICT 1", locked: true, startDate: new Date("2025-04-07") },
        { semester: 2, module: "Basisconcepten ICT 2", locked: true, startDate: new Date("2025-04-07") },
        { semester: 1, module: "Selecteer je module", locked: false, startDate: new Date("2026-04-07") },
        { semester: 2, module: "Selecteer je module", locked: false, startDate: new Date("2026-04-07") },
        { semester: 1, module: "Selecteer je module", locked: false, startDate: new Date("2027-04-07") },
        { semester: 2, module: "Selecteer je module", locked: false, startDate: new Date("2027-04-07") },
        { semester: 1, module: "Selecteer je module", locked: false, startDate: new Date("2028-04-07") },
        { semester: 2, module: "Selecteer je module", locked: false, startDate: new Date("2028-04-07") },
    ];

    const semesterDataGroupedByYear = semesterData.reduce((acc, data) => {
        const year = data.startDate.getFullYear();
        if (!acc[year]) {
            acc[year] = [];
        }
        acc[year].push(data);
        return acc;
    }
        , {});

    let index = 0;
    const totalAmountOfYears = Object.keys(semesterDataGroupedByYear).length;
    for (const semesterGroup of Object.values(semesterDataGroupedByYear)) {
        semesterGroup.sort((a, b) => a.semester - b.semester);
        const semesterPair = await SemesterPair(semesterGroup[0], semesterGroup[1], index, totalAmountOfYears);
        grid.appendChild(semesterPair);
        index++;
    }

    return fragment;
}