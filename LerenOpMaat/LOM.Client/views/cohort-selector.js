import LearningRoute from "../views/learning-route.js";
import { getStartYear } from "../client/api-client.js";
import { setStartYear } from "../client/api-client.js";

export async function RouteOrSelector() {
  let cohortYear = localStorage.getItem("cohortYear");
  let userId = '';//userId moet nog toegevoegd worden zodra authenticatie rond is.

  if (!cohortYear) {
    if (userId) {
      const startYearFromUser = await getStartYear(userId);

      if (startYearFromUser) {
        cohortYear = startYearFromUser;
        localStorage.setItem('cohortYear', cohortYear);
      }
    }
  }

  if (!cohortYear) {
    return await CohortSelector();
  }

  return await LearningRoute();
}

export default async function CohortSelector() {
  const response = await fetch("/templates/cohort-selector.html");
  const html = await response.text();
  const template = document.createElement("template");
  template.innerHTML = html;
  const fragment = template.content.cloneNode(true);

  const submitBtn = fragment.getElementById("submitBtn");
  const cohortButtonsContainer = fragment.getElementById("cohortButtons");
  let selected = null;

  const currentYear = new Date().getFullYear() + 1;
  const cohorts = Array.from({ length: 4 }, (_, i) => currentYear - i);

  cohorts.forEach(year => {
    const button = document.createElement("button");
    button.textContent = year;
    button.dataset.year = year;
    button.className = "cohort-button";
    button.addEventListener("click", () => {
      selected = year;
      fragment.querySelectorAll(".cohort-button").forEach(b => b.classList.remove("selected"));
      button.classList.add("selected");
      submitBtn.disabled = false;
    });
    cohortButtonsContainer.appendChild(button);
  });

  submitBtn.addEventListener("click", async () => {
    if (selected) {
      const userId = localStorage.getItem("userId");

      if (userId) {
        await setStartYear(userId, selected);
      }

      localStorage.setItem("cohortYear", selected);
      window.location.reload();
    }
  });

    return { fragment, init: () => null };
}