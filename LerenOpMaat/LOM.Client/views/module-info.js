import initModuleInfo from "../scripts/initModuleInfo.js";
import loadTemplate from "../scripts/loadTemplate.js";

export default async function ModuleInfo(id) {
    const template = await loadTemplate("/templates/module-info.html");

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = template;

    const fragment = document.createDocumentFragment();
    while (tempDiv.firstChild) {
        fragment.appendChild(tempDiv.firstChild);
    }

    return { fragment, init: () => initModuleInfo(id) };
}