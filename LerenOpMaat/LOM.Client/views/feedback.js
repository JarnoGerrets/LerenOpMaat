export default async function Feedback() {
    const response = await fetch("/templates/feedback.html");
    const html = await response.text();

    // Maak een tijdelijke DOM om alleen de body-content te pakken
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    const bodyContent = tempDiv.querySelector("body") ? tempDiv.querySelector("body").innerHTML : html;

    const template = document.createElement("template");
    template.innerHTML = bodyContent;
    const fragment = template.content.cloneNode(true);

    // Event handler voor opslaan-knop
    const saveButton = fragment.querySelector(".opslaan-btn");
    const textarea = fragment.querySelector(".feedback-box");
    if (saveButton && textarea) {
        saveButton.addEventListener("click", () => {
            const feedback = textarea.value.trim();
            if (feedback) {
                alert("Feedback opgeslagen: " + feedback);
                textarea.value = "";
            } else {
                alert("Vul eerst feedback in.");
            }
        });
    }

    return { fragment };
}