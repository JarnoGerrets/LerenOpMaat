import { getLoginUrl, getUserData, logout } from '../client/api-client.js';

export default class Header extends HTMLElement {
  constructor() {
    super();
  }

  async connectedCallback() {
    const res = await fetch("/templates/header.html");
    const html = await res.text();

    const template = document.createElement("template");
    template.innerHTML = html.trim();

    this.appendChild(template.content.cloneNode(true));

    this.runScripts(this);
  }

  runScripts(root) {
    this.initializeLogin()
    const scripts = root.querySelectorAll("script");
    scripts.forEach(oldScript => {
      const newScript = document.createElement("script");
      if (oldScript.src) {
        newScript.src = oldScript.src;
      } else {
        newScript.textContent = oldScript.textContent;
      }
      document.body.appendChild(newScript);
    });
  }

  async initializeLogin() {
    const loginObj = this.querySelector("#login-url")
    const logoutObj = this.querySelector("#logout")

    const userData = await getUserData()

    if (userData) {
      localStorage.setItem("userData", JSON.stringify(userData));
      loginObj.innerHTML = userData.Username
      logoutObj.classList.remove("d-none")
      logoutObj.addEventListener("click", () => logout())
    } else {
      loginObj.href = getLoginUrl()
    }
  }
}

customElements.define("lom-header", Header);