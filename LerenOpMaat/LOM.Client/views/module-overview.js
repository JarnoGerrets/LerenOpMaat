import { getModules }  from "../client/api-client.js";

const loadTemplate = async (path) => {
    return fetch(path)
        .then(response => response.text())
        .then(htmlText => {
        const parsedDocument = new DOMParser().parseFromString(htmlText, "text/html");
        const templateElement = parsedDocument.querySelector("template");

        if (!templateElement) {
            throw new Error("Template not found");
        }

        return templateElement.content.cloneNode(true);
    });
}

export const moduleOverview = async () => {
    const [
        moduleOverviewTemplate,
        moduleDetailTemplate,
        modules,
    ] = await Promise.all([
        loadTemplate("/templates/module-overview.html"),
        loadTemplate("/templates/module-detail.html"),
        getModules(),
    ]);

    const moduleWrapper = moduleOverviewTemplate.querySelector("#module-wrapper");

    modules.forEach(module => {
        const child = moduleDetailTemplate.cloneNode(true);

        child.querySelector("[module-name]").textContent = module.name;
        child.querySelector("[module-code]").textContent = module.code;
        child.querySelector("[module-semester]").textContent = module.semester;
        child.querySelector("[module-ec]").textContent = module.ec;
        child.querySelector("[module-niveau]").textContent = module.niveau;

        moduleWrapper.appendChild(child);
    });

    return moduleOverviewTemplate;
}