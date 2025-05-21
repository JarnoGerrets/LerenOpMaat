import { RouteOrSelector } from "../../views/cohort-selector.js";
import { JSDOM } from 'jsdom';
// import fs from "fs";
// import path from "path";

// Set up a DOM environment for testing
// This is necessary because the code being tested relies on DOM APIs
const dom = new JSDOM(`<!DOCTYPE html><body></body>`);
global.window = dom.window;
global.document = dom.window.document;
global.customElements = dom.window.customElements;
global.HTMLElement = dom.window.HTMLElement;

describe("RouteOrSelector", () => {
  // let htmlContent;
  // let storage = {};

  // beforeAll(() => {
  //   const htmlPath = path.resolve(__dirname, "/templates/cohort-selector.html");
  //   htmlContent = fs.readFileSync(htmlPath, "utf8");
  // });

  // beforeEach(() => {
  //   global.fetch = jasmine.createSpy("fetch").and.returnValue(
  //     Promise.resolve({
  //       text: () => Promise.resolve(htmlContent),
  //     })
  //   );

  //   window.location.reload = jasmine.createSpy("reload");
  // });

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
    expect(storage["cohortYear"]).toBe(buttons[0].dataset.year);
  });
});
