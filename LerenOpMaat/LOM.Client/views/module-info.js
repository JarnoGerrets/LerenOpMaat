import initModuleInfo from "../scripts/initModuleInfo.js";

export default async function ModuleInfo(id) {
    const response = await fetch("/templates/module-info.html");
    const html = await response.text();

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    const fragment = document.createDocumentFragment();
    while (tempDiv.firstChild) {
        fragment.appendChild(tempDiv.firstChild);
    }

    return { fragment, init: () => initModuleInfo(id) };
}