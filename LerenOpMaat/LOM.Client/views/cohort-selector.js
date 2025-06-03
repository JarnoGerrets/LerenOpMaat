export async function RouteOrSelector(setStartYear, getStartYear, LearningRoute) {
  let cohortYear = localStorage.getItem("cohortYear");
  let userData = await window.userData;

  if (userData && userData.InternalId) {
    localStorage.removeItem('cohortYear');
    const startYearFromUser = await getStartYear(userData.InternalId);
    
    if (startYearFromUser) {
      cohortYear = startYearFromUser;
      localStorage.setItem('cohortYear', cohortYear);
    }
  }

  if (!cohortYear) {
    return await CohortSelector(setStartYear, LearningRoute);
  }

  return await LearningRoute();
}

export default async function CohortSelector(setStartYear, LearningRoute) {
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
      cohortButtonsContainer.querySelectorAll(".cohort-button").forEach(b => b.classList.remove("selected"));
      button.classList.add("selected");
      submitBtn.disabled = false;
    });
    cohortButtonsContainer.appendChild(button);
  });

  submitBtn.addEventListener("click", async () => {
  if (selected) {
    let userData = await window.userData;

    try { 
      if (userData && userData.InternalId) {
        await setStartYear(userData.InternalId, selected);
      } 
    } catch (e) {
      console.error("Error in setStartYear:", e);
    }

    localStorage.setItem("cohortYear", selected);

    const app = document.getElementById("app") || document.body;
    app.innerHTML = "";

    const learning = await LearningRoute();
    if (learning?.fragment) {
      app.appendChild(learning.fragment);
      learning.init?.();
    }
  }
});

    return { fragment, init: () => null };
}