import SemesterCard from "../components/semester-card.js";

export default async function SemesterPair(semester1, semester2, index, totalAmountOfYears) {
    const wrapper = document.createElement("div");
    wrapper.classList.add("semester-pair");

    const isEven = (num) => num % 2 === 0;
    if (isEven(index)) {
        wrapper.classList.remove("reverse");
    } else {
        wrapper.classList.add("reverse");
    }

    if (semester1 ) {
        addYearIconToPair();

        const connector = document.createElement("div");
        connector.classList.add("semester-connector");
        if (!isEven(index)) {
            connector.classList.add("reverse");
        }
        wrapper.appendChild(connector);

        const card1 = await SemesterCard({
            semester: semester1.semester,
            module: semester1.module.description,
            locked: semester1.locked
        });
        console.log("Card1:", card1); // Debugging
        wrapper.appendChild(card1);
    }

    if (semester2) {
        const connector = document.createElement("div");
        connector.classList.add("semester-connector");
        if (!isEven(index)) {
            connector.classList.add("reverse");
        }
        wrapper.appendChild(connector);

        const card2 = await SemesterCard({
            semester: semester2.semester,
            module: semester2.module.description,
            locked: semester2.locked
        });
        console.log("Card2:", card2); // Debugging
        wrapper.appendChild(card2);

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

    if (!semester1 && !semester2) {
        console.warn("No valid semesters provided for SemesterPair");
        return document.createElement("div"); // Retourneer een lege div
    }

    function addYearIconToPair() {
        const yearContainer = document.createElement("div");
        yearContainer.classList.add("year-container");
        const icon = document.createElement("study-year-icon");
    
        // Stel het jaar altijd in op 2025
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