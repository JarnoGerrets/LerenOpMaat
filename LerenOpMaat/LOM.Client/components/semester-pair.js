import SemesterCard from "../components/semester-card.js";
import { dummySemester1, dummySemester2 } from "../components/dummyData2.js";
import { hasPermission } from "../client/api-client.js";
let learningRouteArray = window.learningRouteArray ?? [];

export default async function SemesterPair(semester1, semester2, index, totalAmountOfYears) {
    const isAdmin = await hasPermission("admin");
    const isTeacher = await hasPermission("teacher");
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
    const routeItem1 = learningRouteArray.find(item => item.Year === index + 1 && item.Period === 1);
    if (routeItem1) {
        semester1.Module = {
            ...semester1.Module,
            Id: routeItem1.moduleId,
            Name: routeItem1.moduleName,
            IsActive: routeItem1.isActive,
        };
    } else if (!semester1 || !semester1.Module || !semester1.Module.Name) {
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
            isAdmin: isAdmin,
            isTeacher: isTeacher,
            id: semester1.id,
            semester: semester1,
            module: semester1.Module.Name,
            moduleId: semester1.Module.Id,
            isActive: semester1.Module.IsActive,
            locked: semester1.Locked,
            onModuleChange: async ({ semester, moduleId, moduleName }) => {
                const existingItem = learningRouteArray.find(
                    (item) => item.Year === index + 1 && item.Period === semester.Period
                );
                if (existingItem) {
                    existingItem.moduleId = moduleId;
                    existingItem.moduleName = moduleName;
                } else {
                    learningRouteArray.push({
                        Year: index + 1,
                        Period: semester.Period,
                        moduleId,
                        moduleName,
                        isActive,
                    });
                    window.learningRouteArray = learningRouteArray;
                }
            },

        });
        wrapper.appendChild(card1);

        if (!learningRouteArray.find(item => item.Year === index + 1 && item.Period === semester1.Period)) {
            learningRouteArray.push({
                Year: index + 1,
                Period: semester1.Period,
                moduleId: semester1.Module.Id,
                moduleName: semester1.Module.Name,
            });
        }
    }

    // Fallback for semester2
    const routeItem2 = learningRouteArray.find(item => item.Year === index + 1 && item.Period === 2);
    if (routeItem2) {
        semester2.Module = {
            ...semester2.Module,
            Id: routeItem2.moduleId,
            Name: routeItem2.moduleName,
            IsActive: routeItem2.isActive,
        };
    } else if (!semester2 || !semester2.Module || !semester2.Module.Name) {
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
            isAdmin: isAdmin,
            isTeacher: isTeacher,
            id: semester2.id,
            semester: semester2,
            module: semester2.Module.Name,
            moduleId: semester2.Module.Id,
            isActive: semester2.Module.IsActive,
            locked: semester2.Locked,
            onModuleChange: async ({ semester, moduleId, moduleName }) => {
                const existingItem = learningRouteArray.find(
                    (item) => item.Year === index + 1 && item.Period === semester.Period
                );
                if (existingItem) {
                    existingItem.moduleId = moduleId;
                    existingItem.moduleName = moduleName;
                } else {
                    learningRouteArray.push({
                        Year: index + 1,
                        Period: semester.Period,
                        moduleId,
                        moduleName,
                        isActive,
                    });
                    window.learningRouteArray = learningRouteArray;
                }
            },

        });
        wrapper.appendChild(card2);

        if (!learningRouteArray.find(item => item.Year === index + 1 && item.Period === semester2.Period)) {
            learningRouteArray.push({
                Year: index + 1,
                Period: semester2.Period,
                moduleId: semester2.Module.Id,
                moduleName: semester2.Module.Name,
            });
        }

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
        placeholder.classList.add("connector-placeholder");
        placeholder.style.width = "150px";
        wrapper.appendChild(placeholder);
    }
    window.learningRouteArray = learningRouteArray;
    return wrapper;
}