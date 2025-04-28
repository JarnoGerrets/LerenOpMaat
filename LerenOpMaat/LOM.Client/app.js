import LearningRoute from "./views/learning-route.js";

const routes = {
  "/": LearningRoute
};

const navigateTo = url => {
  history.pushState(null, null, url);
  router();
};

const router = async () => {
  const path = window.location.pathname;
  const app = document.getElementById("app");
  app.innerHTML = "";

  const viewFn = routes[path];

  if (viewFn) {
    const view = await viewFn();
    app.appendChild(view);
  } else if (path.startsWith("/Module_Overzicht/")) {
    const id = path.split("/")[2];
    console.log(id);
    const response = await fetch("/views/module-info.html");
    const html = await response.text();
    app.innerHTML = html;

    console.log("Loaded module with ID:", id);
  } else {
    const div = document.createElement("div");
    div.innerHTML = "<h1>404 Not Found</h1>";
    app.appendChild(div);
  }
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