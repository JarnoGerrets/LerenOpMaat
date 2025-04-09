class StudyYearIcon extends HTMLElement {
  static get observedAttributes() {
    return ['start'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  render() {
    const startYear = parseInt(this.getAttribute("start")) || new Date().getFullYear();
    const endYear = startYear + 1;

    const startShort = String(startYear).slice(-2);
    const endShort = String(endYear).slice(-2);

    this.shadowRoot.innerHTML = `
      <style>
        .year-badge {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background-color: #ffc400;
          color: white;
          font-weight: bold;
          font-size: 1.25rem;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          font-family: sans-serif;
        }
      </style>
      <div class="year-badge">‘${startShort} / ’${endShort}</div>
    `;
  }
}

customElements.define("study-year-icon", StudyYearIcon);
