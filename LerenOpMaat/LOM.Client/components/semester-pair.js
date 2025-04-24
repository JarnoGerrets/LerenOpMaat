import SemesterCard from "../components/semester-card.js";

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
                console.log("Updated LearningRouteArray:", learningRouteArray); //Debug Elias
            },
        });
        console.log("Card1:", card1);
        wrapper.appendChild(card1);

        learningRouteArray.push({
            Year: index + 1,
            semester: semester1.semester,
            moduleId: semester1.Module.Id
        });
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
                console.log("Updated LearningRouteArray:", learningRouteArray);//Debug Elias
            },
        });
        wrapper.appendChild(card2);

        learningRouteArray.push({
            Year: index + 1,
            semester: semester2.semester,
            moduleId: semester2.Module.Id
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

        // Dit moet gefixt worden ik heb het tijdelijk hardcoded
        icon.setAttribute("start", "2025");
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