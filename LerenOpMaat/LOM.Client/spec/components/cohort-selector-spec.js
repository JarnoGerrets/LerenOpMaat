import { JSDOM } from "jsdom";

const dom = new JSDOM(`<!DOCTYPE html><body></body>`);
global.window = dom.window;
global.document = dom.window.document;
global.customElements = dom.window.customElements;
global.HTMLElement = dom.window.HTMLElement;

global.fetch = jasmine.createSpy("fetch").and.callFake(() =>
  Promise.resolve({
    text: () => Promise.resolve(`
      <div>
        <button id="submitBtn" class="submitBtn" disabled>Submit</button>
        <div id="cohortButtons"></div>
      </div>
    `)
  })
);

import CohortSelector from "../../views/cohort-selector.js";

describe("RouteOrSelector", () => {
  const mockgetStartYear = 2024;
  const mocksetStartYear = 2024;

  let store = {};

  global.localStorage = {
    getItem: jasmine.createSpy('getItem').and.callFake((key) => store[key]),
    setItem: jasmine.createSpy('setItem').and.callFake((key, value) => {
      store[key] = value;
    }),
    removeItem: jasmine.createSpy('removeItem').and.callFake((key) => {
      delete store[key];
    }),
    clear: jasmine.createSpy('clear').and.callFake(() => {
      store = {};
    })
  };

  beforeEach(() => {
    document.body.innerHTML = "";
    localStorage.setItem('userData', JSON.stringify({ Role: "Admin" }));
    window.userData = Promise.resolve({ Role: "Admin" });
  });

  it("Test of submit button zonder selectie niet werkt", async () => {
    const { fragment } = await CohortSelector(mocksetStartYear, mockgetStartYear);
    document.body.appendChild(fragment);

    const submitBtn = document.querySelector(".submitBtn");
    expect(submitBtn.disabled).toBeTrue();
  });

  it("Test of er maar 1 knop blijft geselecteerd", async () => {
    const { fragment } = await CohortSelector(mocksetStartYear, mockgetStartYear);
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
    const { fragment } = await CohortSelector(mocksetStartYear, mockgetStartYear);
    document.body.appendChild(fragment);

    const buttons = document.querySelectorAll(".cohort-button");
    const submitBtn = document.querySelector(".submitBtn");
    buttons[0].click();
    expect(buttons[0].classList.contains("selected")).toBeTrue();
    expect(submitBtn.disabled).toBeFalse();
  });

  it("Test of de cohort optie opgeslagen wordt in de localstorage", async () => {
    const { fragment } = await CohortSelector(mocksetStartYear, mockgetStartYear);
    document.body.appendChild(fragment);

    const buttons = document.querySelectorAll(".cohort-button");
    const submitBtn = document.querySelector(".submitBtn");
    buttons[0].click();
    expect(buttons[0].classList.contains("selected")).toBeTrue();
    
    await submitBtn.click();

    expect(localStorage.setItem).toHaveBeenCalledWith("cohortYear", Number(buttons[0].dataset.year));
    expect(localStorage.getItem("cohortYear")).toBe(Number(buttons[0].dataset.year));
  });
});
