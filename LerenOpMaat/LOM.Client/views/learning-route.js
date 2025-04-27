import SemesterPair from "../components/semester-pair.js";

export default async function LearningRoute() {
    const cohortYear = parseInt(localStorage.getItem("cohortYear"));
    
    const response = await fetch("/templates/learning-route.html");
    const html = await response.text();
    const template = document.createElement("template");
    template.innerHTML = html;
    const fragment = template.content.cloneNode(true);
    const grid = fragment.querySelector(".semester-grid");

    const semesterData = [
        { semester: 1, module: "Basisconcepten ICT 1", locked: true, startDate: new Date(`${cohortYear}-04-07`) },
        { semester: 2, module: "Basisconcepten ICT 2", locked: true, startDate: new Date(`${cohortYear}-09-01`) },
        { semester: 1, module: "Selecteer je module", locked: false, startDate: new Date(`${cohortYear + 1}-04-07`) },
        { semester: 2, module: "Selecteer je module", locked: false, startDate: new Date(`${cohortYear + 1}-09-01`) },
        { semester: 1, module: "Selecteer je module", locked: false, startDate: new Date(`${cohortYear + 2}-04-07`) },
        { semester: 2, module: "Selecteer je module", locked: false, startDate: new Date(`${cohortYear + 2}-09-01`) },
        { semester: 1, module: "Selecteer je module", locked: false, startDate: new Date(`${cohortYear + 3}-04-07`) },
        { semester: 2, module: "Selecteer je module", locked: false, startDate: new Date(`${cohortYear + 3}-09-01`) },
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