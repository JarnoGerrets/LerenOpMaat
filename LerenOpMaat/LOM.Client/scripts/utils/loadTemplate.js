export default async function loadTemplate(link) {
    const response = await fetch(link);
    const template = await response.text();
    return template;
}