import initModuleInfo from "../scripts/utils/module-info-utils/init-module-info.js";
import { loadTemplate } from "../scripts/utils/universal-utils.js";

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