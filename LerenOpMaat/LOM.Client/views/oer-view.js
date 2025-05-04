export async function oerView() {
    // Stap 1: Laad de HTML-template
    const response = await fetch("/templates/Oer.html");
    const html = await response.text();
  
    // Stap 2: Zet de HTML in een wrapper-element
    const wrapper = document.createElement("div");
    wrapper.innerHTML = html;
  
    // Stap 3: Zoek de <object> tag en geef het de juiste data-url
    const objectElement = wrapper.querySelector("object");
    if (objectElement) {
      objectElement.setAttribute("data", "/api/oer/current");
    }
  
    // Stap 4: Retourneer de kant-en-klare view
    return wrapper;
  }
  