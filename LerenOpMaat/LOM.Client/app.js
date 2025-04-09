import LearningRoute from "./views/learning-route.js";
import SemesterChoice from "./views/partials/semester-choice.js";

const routes = {
  "/": LearningRoute
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

  document.getElementById("testButton").addEventListener("click", () => SemesterChoice());
  
  document.getElementById("testButton2").addEventListener("click", () => LearningRoute());

  router();
});