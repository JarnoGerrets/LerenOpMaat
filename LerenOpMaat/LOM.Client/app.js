import LearningRoute from "./views/learning-route.js";
import ModuleInfo from "./views/module-info.js";

const routes = {
  "/": async () => {
    return await LearningRoute();
  },
  "/Module/:id": async (id) => {
    return await ModuleInfo(id);
  },
};

const matchRoute = (path) => {

  for (const [route, handler] of Object.entries(routes)) {
    const routeParts = route.split('/');
    const pathParts = path.split('/');

    if (routeParts.length !== pathParts.length) continue;

    const params = {};
    let isMatch = true;

    for (let i = 0; i < routeParts.length; i++) {
      if (routeParts[i].startsWith(':')) {
        params[routeParts[i].slice(1)] = pathParts[i];
      } else if (routeParts[i] !== pathParts[i]) {
        isMatch = false;
        break;
      }
    }

    if (isMatch) {
      return { handler, params };
    }
  }
  return null;
};

const router = async () => {
  const path = window.location.pathname;
  const app = document.getElementById("app");
  app.innerHTML = "";

  const match = matchRoute(path);

  if (match) {
    const { handler, params } = match;
    const { fragment, init } = await handler(params.id);

    app.appendChild(fragment);
    if (init) await init(); //when a script needs the view to be loaded before continuing

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

const navigateTo = (url) => {
  history.pushState(null, null, url);
  router();
};





/* import LearningRoute from "./views/learning-route.js";
import ModuleInfo from "./views/module-info.js";

const routes = {
  "/": LearningRoute,
  "/Module_Overzicht/:id": ModuleInfo
};

const navigateTo = url => {
  history.pushState(null, null, url);
  router();
};

const router = async () => {
  const path = window.location.pathname;
  console.log(path);
  const app = document.getElementById("app");
  app.innerHTML = "";

  const viewFn = routes[path];

  if (viewFn) {
    const view = await viewFn();
    app.appendChild(view);
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

*/