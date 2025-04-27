import LearningRoute from "./views/learning-route.js";
import CohortSelector from "./views/cohort-selector.js";
import { getStartYear } from "./Services/userService.js";

const routes = {
  "/": async () => {
    const cohortYear = localStorage.getItem("cohortYear");
    const userId = localStorage.getItem("userId");

    if (!cohortYear) {
      if (userId) {
        const startYearFromUser = await getStartYear(userId);

        if (startYearFromUser){
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
};

const navigateTo = url => {
  history.pushState(null, null, url);
  router();
};

const router = async () => {
  const path = window.location.pathname;
  const viewFn = routes[path] || (() => {
    const div = document.createElement("div");
    div.innerHTML = "<h1>404 Not Found</h1>";
    return div;
  });

  const app = document.getElementById("app");
  app.innerHTML = "";

  const view = await viewFn();
  app.appendChild(view);
};

window.addEventListener("popstate", router);

document.addEventListener("DOMContentLoaded", () => {
  document.body.addEventListener("click", e => {
    if (e.target.matches("[data-link]")) {
      e.preventDefault();
      navigateTo(e.target.href);
    }
  });

  router();
});