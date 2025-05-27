export default async function settingsPage() {
    const container = document.createElement("div");
    const template = document.createElement("template");
    const fragment = template.content.cloneNode(true);

    container.classList.add('settings-page');
    container.style.height = '100%';
    const textSpan = document.createElement('span');
    textSpan.textContent = 'Pagina nog in ontwikkeling';
    textSpan.style.fontSize = '24px';
    textSpan.style.marginLeft = '25px';
    textSpan.style.position = 'absolute';
    textSpan.style.top = '15%';
    container.appendChild(textSpan);
    fragment.appendChild(container);

    animateDots(textSpan, "Pagina nog in ontwikkeling");

    return {fragment, init: () => null};
}


function animateDots(element, baseText) {
  let dotCount = 0;
  setInterval(() => {
    dotCount = (dotCount + 1) % 4; // cycles from 0 → 3
    element.textContent = baseText + ".".repeat(dotCount);
  }, 250); // update every 500ms
}