import SemesterCard from "../components/semester-card.js";
import { dummySemester1, dummySemester2 } from "../components/dummyData2.js";
export let learningRouteArray = [];

export default async function SemesterPair(semester1, semester2, index, totalAmountOfYears) {
    const cohortYear = parseInt(localStorage.getItem("cohortYear"));
    const wrapper = document.createElement("div");
    wrapper.classList.add("semester-pair");

    const isEven = (num) => num % 2 === 0;
    if (isEven(index)) {
        wrapper.classList.remove("reverse");
    } else {
        wrapper.classList.add("reverse");
    }

    // Fallback for semester1
    if (!semester1 || !semester1.Module || !semester1.Module.Name) {
        semester1 = dummySemester1;
    }

    if (semester1) {
        addYearIconToPair();

        const connector = document.createElement("div");
        connector.classList.add("semester-connector");
        if (!isEven(index)) {
            connector.classList.add("reverse");
        }
        wrapper.appendChild(connector);

        const card1 = await SemesterCard({
            id: semester1.id,
            semester: semester1.Period,
            module: semester1.Module.Name,
            moduleId: semester1.ModuleId,
            isActive: semester1.Module.IsActive,
            locked: semester1.locked,
            onModuleChange: async ({ semester, moduleId }) => {
                const existingItem = learningRouteArray.find(
                    (item) => item.Year === index + 1 && item.Period === semester
                );
                if (existingItem) {
                    existingItem.moduleId = moduleId;
                } else {
                    learningRouteArray.push({
                        Year: index + 1,
                        semester,
                        moduleId,
                    });
                }
            },
        });
        wrapper.appendChild(card1);

        learningRouteArray.push({
            Year: index + 1,
            Period: semester1.Period,
            moduleId: semester1.Module.Id,
        });
    }

    // Fallback for semester2
    if (!semester2 || !semester2.Module || !semester2.Module.Name) {
        semester2 = dummySemester2;
    }

    if (semester2) {
        const connector = document.createElement("div");
        connector.classList.add("semester-connector");
        if (!isEven(index)) {
            connector.classList.add("reverse");
        }
        wrapper.appendChild(connector);

        const card2 = await SemesterCard({
            id: semester2.id,
            semester: semester2.Period,
            module: semester2.Module.Name,
            moduleId: semester2.Module.Id,
            isActive: semester2.Module.IsActive,
            locked: semester2.locked,
            onModuleChange: ({ semester, moduleId }) => {
                const existingItem = learningRouteArray.find(
                    (item) => item.Year === index + 1 && item.Period === semester
                );
                if (existingItem) {
                    existingItem.moduleId = moduleId;
                } else {
                    learningRouteArray.push({
                        Year: index + 1,
                        semester,
                        moduleId,
                    });
                }
            },
        });
        wrapper.appendChild(card2);

        learningRouteArray.push({
            Year: index + 1,
            Period: semester2.Period,
            moduleId: semester2.Module.Id,
        });

        if (index !== totalAmountOfYears - 1) {
            const cornerConnector = document.createElement("div");
            cornerConnector.classList.add("corner-connector");
            if (!isEven(index)) {
                cornerConnector.classList.add("left");
            } else {
                cornerConnector.classList.add("right");
            }
            wrapper.appendChild(cornerConnector);
        } else {
            addYearIconPlaceholder();
        }
    }

    function addYearIconToPair() {
        const yearContainer = document.createElement("div");
        yearContainer.classList.add("year-container");
        const icon = document.createElement("study-year-icon");

        //deze is een caluclatie van de cohortYear + 1 elke keer.
        const startYear = cohortYear + index;
        const endYear = startYear + 1; // Volgnde jaar
        const yearRange = `${startYear % 100}/${endYear % 100}`; // Format YY/YY

        icon.setAttribute("start", yearRange);
        yearContainer.appendChild(icon);
        wrapper.appendChild(yearContainer);
    }

    function addYearIconPlaceholder() {
        const placeholder = document.createElement("div");
        placeholder.classList.add("year-container");
        placeholder.style.width = "150px";
        wrapper.appendChild(placeholder);
    }

    return wrapper;
}