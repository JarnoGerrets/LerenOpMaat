import "../components/module-overview.js";


export const moduleOverview = async () => {
    const fragment = document.createElement("module-overview");
    return { fragment, init: () => null };
}