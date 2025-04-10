import SemesterCard from "../components/semester-card.js";

export default function SemesterPair(semester1, semester2, index, totalAmountOfYears) {
    const wrapper = document.createElement("div");
    wrapper.classList.add("semester-pair");

    const isEven = (num) => num % 2 === 0;
    if (isEven(index)) {
        wrapper.classList.remove("reverse");
    }
    else{
        wrapper.classList.add("reverse");
    }

    if (semester1){
        addYearIconToPair();

        const connector = document.createElement("div");
        connector.classList.add("semester-connector");
        wrapper.appendChild(connector);
        
        const card1 = SemesterCard(semester1);
        wrapper.appendChild(card1);
    }
    
    if (semester2){
        const connector = document.createElement("div");
        connector.classList.add("semester-connector");
        wrapper.appendChild(connector);

        const card2 = SemesterCard(semester2);
        wrapper.appendChild(card2);

        if (index !== totalAmountOfYears -1) {
            const cornerConnector = document.createElement("div");
            cornerConnector.classList.add("corner-connector");
            if (!isEven(index)) {
                cornerConnector.classList.add("left");
            }
            else{
                cornerConnector.classList.add("right");
            }
            wrapper.appendChild(cornerConnector);
        }
        else{
            addYearIconPlaceholder();
        }
    }

    function addYearIconToPair() {
        const yearContainer = document.createElement("div");
        yearContainer.classList.add("year-container");
        const icon = document.createElement("study-year-icon");
    
        icon.setAttribute("start", semester1.startDate.getFullYear());
        yearContainer.appendChild(icon);
        wrapper.appendChild(yearContainer);
    }

    function addYearIconPlaceholder(){
        const placeholder = document.createElement("div");
        placeholder.classList.add("year-container");
        placeholder.style.width = "150px";
        wrapper.appendChild(placeholder);
    }

    return wrapper;
  }