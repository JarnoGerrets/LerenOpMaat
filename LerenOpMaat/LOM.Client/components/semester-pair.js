import SemesterCard from "../components/semester-card.js";

export default function SemesterPair(semester1, semester2) {
    const wrapper = document.createElement("div");
    wrapper.classList.add("semester-pair");

    const icon = document.createElement("study-year-icon");
    icon.setAttribute("start", "2023");
    wrapper.appendChild(icon);
    
    if (semester1){
        const card1 = SemesterCard(semester1);
        wrapper.appendChild(card1);
    }
    if (semester2){
        const card2 = SemesterCard(semester2);
        wrapper.appendChild(card2);
    }

    return wrapper;
  }