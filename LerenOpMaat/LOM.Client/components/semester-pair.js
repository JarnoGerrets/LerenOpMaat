import SemesterCard from "../components/semester-card.js";

export default function SemesterPair(semester1, semester2, index) {
    const wrapper = document.createElement("div");
    wrapper.classList.add("semester-pair");

    const isEven = (num) => num % 2 === 0;
    if (isEven(index)) {
        wrapper.style.flexDirection = "row";
    }
    else{
        wrapper.style.flexDirection = "row-reverse";
    }

    if (semester1){
        addYearIconToPair(wrapper);
        const card1 = SemesterCard(semester1);
        wrapper.appendChild(card1);
    }
    if (semester2){
        const card2 = SemesterCard(semester2);
        wrapper.appendChild(card2);

        addYearIconPlaceholder();
    }

    function addYearIconToPair(wrapper) {
        const yearContainer = document.createElement("div");
        yearContainer.classList.add("year-container");
        const icon = document.createElement("study-year-icon");
        
        icon.setAttribute("start", semester1.startDate.getFullYear());
        yearContainer.appendChild(icon);
        wrapper.appendChild(yearContainer);
    }

    function addYearIconPlaceholder(){
        const placeholder = document.createElement("div");
        placeholder.style.width = "80px";

        wrapper.appendChild(placeholder);
    }

    return wrapper;
  }