import loadTemplate from "./loadTemplate.js";
export default async function initModuleInfo(id) {

    const CardContainer = document.getElementById('card-column');

    const path = window.location.pathname;
    const pathParts = path.split('/');
    const moduleId = pathParts[2];
    const savedModule = JSON.parse(localStorage.getItem(`module-${moduleId}`))

    if (savedModule) {
        const template = await loadTemplate('../templates/module-card.html');
        const populatedTemplate = template
            .replace('{{id}}', savedModule.id)
            .replace('{{card_text}}', savedModule.description)
            .replace('{{title}}', savedModule.name)
            .replace('{{link}}', '');

        const tile = document.createElement('div');
        tile.classList.add('module-tile');
        tile.innerHTML = populatedTemplate;

        CardContainer.appendChild(tile);

        const template2 = await loadTemplate('../templates/module-card.html');
        const populatedTemplate2 = template2
            .replace('{{id}}', savedModule.id)
            .replace('{{card_text}}', 'Nog niet bekend')
            .replace('{{title}}', 'Ingangseisen')
            .replace('{{link}}', '');
        const tile2 = document.createElement('div');
        tile2.classList.add('module-tile', 'ingangseisen-tile');
        tile2.innerHTML = populatedTemplate2;

        CardContainer.appendChild(tile2);
        updateUrlWithName(savedModule);

    } else {
        console.log('Module data not found in localStorage, fetch from DB...');
    }

    window.addEventListener('beforeunload', handleUnload);
    window.addEventListener('popstate', handleUnload);

    function handleUnload() {
        localStorage.removeItem(`module-${moduleId}`);
    }
}

function updateUrlWithName (module) {
    const updatedText = slugify(module.name)
    history.replaceState(null, null, `/Module/${updatedText}`);
};

function slugify(text) {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-');
}