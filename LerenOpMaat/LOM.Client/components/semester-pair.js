import SemesterCard from "../components/semester-card.js";

export default function SemesterPair(semester1, semester2) {
    console.log("SemesterPair", semester1, semester2);
    const wrapper = document.createElement("div");
    wrapper.classList.add("semester-pair");
    
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