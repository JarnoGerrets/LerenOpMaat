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
}

customElements.define("lom-header", Header);