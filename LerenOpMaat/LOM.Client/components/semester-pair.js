import SemesterCard from "../components/semester-card.js";
import {dummySemester1, dummySemester2} from "../components/dummyData2.js";
export let learningRouteArray = [];

export default async function SemesterPair(semester1, semester2, index, totalAmountOfYears) {
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
        console.warn("Semester1.Module.Name is null or undefined. Using dummySemester1.");
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
            semester: semester1.semester,
            module: semester1.Module.Name,
            moduleId: semester1.Module.Id,
            locked: semester1.locked,
            onModuleChange: ({ semester, moduleId }) => {
                const existingItem = learningRouteArray.find(
                    (item) => item.Year === index + 1 && item.semester === semester
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

                //deze ga ik aan het einde van het project verwijderen
                console.log("Updated LearningRouteArray:", learningRouteArray); //Debug Elias
            },
        });
        //deze ga ik aan het einde van het project verwijderen
        console.log("Card1:", card1); //Debug Elias
        wrapper.appendChild(card1);

        learningRouteArray.push({
            Year: index + 1,
            semester: semester1.semester,
            moduleId: semester1.Module.Id
        });
    }

    // Fallback for semester2
    if (!semester2 || !semester2.Module || !semester2.Module.Name) {
        console.warn("Semester2.Module.Name is null or undefined. Using dummySemester2.");
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
            semester: semester2.semester,
            module: semester2.Module.Name,
            moduleId: semester2.Module.Id,
            locked: semester2.locked,
            onModuleChange: ({ semester, moduleId }) => {
                const existingItem = learningRouteArray.find(
                    (item) => item.Year === index + 1 && item.semester === semester
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

                //deze ga ik aan het einde van het project verwijderen
                console.log("Updated LearningRouteArray:", learningRouteArray); // Debug Elias
            },
        });
        wrapper.appendChild(card2);

        learningRouteArray.push({
            Year: index + 1,
            semester: semester2.semester,
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
        
        icon.setAttribute("start", "2025");// Dit moet nog gefixt worden ik heb het tijdelijk hardcoded.
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