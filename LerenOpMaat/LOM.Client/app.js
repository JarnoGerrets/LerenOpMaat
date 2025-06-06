import "./scripts/utils/getUserData.js";
import ModuleInfo from "./views/module-info.js";
import { RouteOrSelector } from "./views/cohort-selector.js";
import { moduleOverview } from "./views/module-overview.js";
import oerView from './views/oer-view.js';
import feedback from './views/feedback.js';
import settingsPage from './views/settings-page.js';
import renderTeacherLearningRoutes from './views/teacher-Dashboard.js';
import teacherFeedback from './views/teacher-feedback.js';
import teacherLearningRoute from './views/teacher-learning-route.js';
import { uploadOerPdf, getCurrentOerPdf, setStartYear, getStartYear, hasPermission } from "./client/api-client.js";
import report from './views/report.js';
import LearningRoute from "./views/learning-route.js";
let isAdminOrTeacher = false;
let isAdmin = false;

//routes are entered here. when a parameter like ID is needed add ": async (param)" to ensure its extracted form the url.
const routes = {
  "": async () => {
    return await RouteOrSelector(setStartYear, getStartYear, LearningRoute);
  },
  "#Module/:id": async (id) => {
    return await ModuleInfo(id);
  },
  "#Dashboard": async () => {
    if (isAdminOrTeacher) {
      return await renderTeacherLearningRoutes();
    }
    return await RouteOrSelector(setStartYear, getStartYear, LearningRoute);
  }
  ,
  "#module-overview": async () => {
    return await moduleOverview();
  },
  "#oer-view": async () => {
    return await oerView(uploadOerPdf, getCurrentOerPdf);
  },
  "#feedback": async () => {
    return await feedback();
  },
  "#instellingen": async () => {
    return await settingsPage();
  },
  "#beheerder-feedback": async () => {
    const params = getHashParams();
    const { fragment } = await teacherFeedback(params);
    document.getElementById('app').innerHTML = '';
    document.getElementById('app').appendChild(fragment);
  },
  "#beheerder-learning-route": async () => {
    if (isAdminOrTeacher) {
      const params = getHashParams();
      const { fragment } = await teacherLearningRoute(params);
      document.getElementById('app').innerHTML = '';
      document.getElementById('app').appendChild(fragment);
    } else {
      return await RouteOrSelector(setStartYear, getStartYear, LearningRoute);
    }
  },
  "#rapportage": async () => {
    if (isAdmin) {
      return await report();
    }
    return await RouteOrSelector(setStartYear, getStartYear, LearningRoute);
  }
};

//function which takes for example and Id and gives it to the router as parameter to be used. 
//the url /module/5 results in parameter: 5.
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

// router to match pathname with any existing routes, in case of no results an error is displayed.
// router uses fragments followed by possible intialization scripts to 'switch' pages.
const router = async () => {
  isAdmin = await hasPermission("admin");
  const isTeacher = await hasPermission("teacher");

  isAdminOrTeacher = isAdmin || isTeacher;

  const path = window.location.hash;
  const app = document.getElementById("app");
  app.innerHTML = "";
  userData = await window.userData;

  // Speciaal afhandelen voor beheerder-feedback met parameters
  if (path.startsWith("#beheerder-feedback")) {
    const params = getHashParams();
    const { fragment } = await teacherFeedback(params);
    app.appendChild(fragment);
    return;
  }

  // Speciaal afhandelen voor beheerder-learning-route met parameters
  if (path.startsWith("#beheerder-learning-route")) {
    const params = getHashParams();
    const { fragment } = await teacherLearningRoute(params);
    app.appendChild(fragment);
    return;
  }

  const match = matchRoute(path);
  if (match) {
    const { handler, params } = match;
    const { fragment, init } = await handler(params.id);
    app.appendChild(fragment);
    if (init) await init();
  } else {
    const div = document.createElement("div");
    div.innerHTML = "<h1>404 Not Found</h1>";
    app.appendChild(div);
  }
};

window.addEventListener("popstate", router);

document.addEventListener("DOMContentLoaded", () => {
  const storedToast = sessionStorage.getItem("postReloadToast");
  if (storedToast) {
    try {
      const { message, type } = JSON.parse(storedToast);
      showToast(message, type);
    } catch (e) {
      console.error("Failed to parse postReloadToast:", e);
    }
    sessionStorage.removeItem("postReloadToast");
  }
  document.body.addEventListener("click", e => {
    if (e.target.matches("[data-link]")) {
      e.preventDefault();
      navigateTo(e.target.href);
    }
  });
  window.addEventListener("popstate", router);
  router();
});
// dont ask me why... but somehow adding this second copy of the exact statement as above it will correctly reload on login
window.addEventListener("popstate", router);

let scrollArea;
setTimeout(() => {
  scrollArea = document.getElementById('app');
  scrollArea.classList.add('hide-scrollbar');

  scrollArea.addEventListener('scroll', () => {
    scrollArea.classList.add('scrolling');
    clearTimeout(scrollArea.scrollTimeout);
    scrollArea.scrollTimeout = setTimeout(() => {
      scrollArea.classList.remove('scrolling');
    }, 700);
  });
}, 1000);

const navigateTo = (url) => {
  history.pushState(null, null, url);
  router();
};
function getHashParams() {
  const hash = window.location.hash.split('?')[1];
  if (!hash) return {};
  return Object.fromEntries(new URLSearchParams(hash));
}
document.body.style.visibility = 'visible';

//----------------------Old Router---------------------------------------------------------------------------------------------------------------//


// import LearningRoute from "./views/learning-route.js";
// import ModuleInfo from "./views/module-info.js";

// const routes = {
//   "/": LearningRoute,
//   "/Module_Overzicht/:id": ModuleInfo
// };

// const navigateTo = url => {
//   history.pushState(null, null, url);
//   router();
// };

// const router = async () => {
//   const path = window.location.pathname;
//   console.log(path);
//   const app = document.getElementById("app");
//   app.innerHTML = "";

//   const viewFn = routes[path];

//   if (viewFn) {
//     const view = await viewFn();
//     app.appendChild(view);
//   } else {
//     const div = document.createElement("div");
//     div.innerHTML = "<h1>404 Not Found</h1>";
//     app.appendChild(div);
//   }
// };

// window.addEventListener("popstate", router);

// document.addEventListener("DOMContentLoaded", () => {
//   document.body.addEventListener("click", e => {
//     if (e.target.matches("[data-link]")) {
//       e.preventDefault();
//       navigateTo(e.target.href);
//     }
//   });

//   router();
// });
