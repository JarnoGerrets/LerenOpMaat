import { RouteOrSelector } from "../../views/cohort-selector.js";
import { JSDOM } from "jsdom";

const dom = new JSDOM(`<!DOCTYPE html><body></body>`, {
  url: "https://localhost" // geldige origin voor localStorage
});

global.window = dom.window;
global.document = dom.window.document;
global.HTMLElement = dom.window.HTMLElement;
global.localStorage = dom.window.localStorage;
global.customElements = dom.window.customElements;

describe("RouteOrSelector", () => {
  beforeEach(() => {

      global.fetch = jasmine.createSpy("fetch").and.callFake((url) => {
      if (url === "/templates/cohort-selector.html") {
        return Promise.resolve({
          text: () => Promise.resolve(`
            <div class="cohort-wrapper" id="cohortSelector">
              <div class="cohort-container">
                <h1 class="cohort-title">Wanneer ben je gestart met je studie?</h1>
                <div class="cohort-options" id="cohortButtons"></div>
                <button class="cohort-submit" id="submitBtn" disabled>Ga verder</button>
              </div>
            </div>
          `)
        });
      }
      return Promise.reject(new Error("Unknown URL: " + url));
    });

    const mockLocalStorage = {
    getItem: (key) => localStore[key] || null,
    setItem: (key, value) => {
      localStore[key] = value.toString();
    },
    clear: () => {
      for (let key in localStore) {
        delete localStore[key];
      }
    },
  };

  Object.defineProperty(window, 'localStorage', {
    value: mockLocalStorage,
    writable: true,
    configurable: true,
  });
  });

  it("Test of submit button zonder selectie niet werkt", async () => {
    const fragment = await RouteOrSelector();
    document.body.appendChild(fragment);

    const submitBtn = document.querySelectorAll(".submitBtn");
    expect(submitBtn.disabled).toBeTrue();
  });

  it("Test of er maar 1 knop blijft geselecteerd", async () => {
    const fragment = await RouteOrSelector();
    document.body.appendChild(fragment);

    const buttons = document.querySelectorAll(".cohort-button");
    buttons[0].click();
    expect(buttons[0].classList.contains("selected")).toBeTrue();

    for (let i = 1; i < buttons.length; i++) {
      expect(buttons[i].classList.contains("selected")).toBeFalse();
    }

    buttons[1].click();
    expect(buttons[1].classList.contains("selected")).toBeTrue();
    expect(buttons[0].classList.contains("selected")).toBeFalse();
  });

  it("Test of submit button met selectie werkt", async () => {
    const fragment = await RouteOrSelector();
    document.body.appendChild(fragment);

    const buttons = document.querySelectorAll(".cohort-button");
    const submitBtn = document.querySelectorAll(".submitBtn");
    buttons[0].click();
    expect(buttons[0].classList.contains("selected")).toBeTrue();
    expect(submitBtn.disabled).toBeFalse();
  });

  it("Test of de cohort optie opgeslagen wordt in de localstorage", async () => {
    const fragment = await RouteOrSelector();
    document.body.appendChild(fragment);

    const buttons = document.querySelectorAll(".cohort-button");
    const submitBtn = document.querySelectorAll(".submitBtn");
    buttons[0].click();
    expect(buttons[0].classList.contains("selected")).toBeTrue();

    submitBtn.click();
    expect(localStorage.getItem("cohortYear")).toBe(buttons[0].dataset.year);
  });
});
