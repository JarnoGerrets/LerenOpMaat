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
        addYearIconToPair(wrapper, index);
        const card1 = SemesterCard(semester1);
        wrapper.appendChild(card1);
    }
    if (semester2){
        const card2 = SemesterCard(semester2, index);
        wrapper.appendChild(card2);

        addYearIconPlaceholder();
    }

    function addYearIconToPair(wrapper, index) {
        const icon = document.createElement("study-year-icon");
        icon.setAttribute("start", semester1.startDate.getFullYear());
        wrapper.appendChild(icon);
    }

    function addYearIconPlaceholder(){
        const placeholder = document.createElement("div");
        placeholder.style.width = "80px";

        wrapper.appendChild(placeholder);
    }

    return wrapper;
  }