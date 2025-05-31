import CohortSelector from "../../../views/cohort-selector.js";

describe("CohortSelector", () => {
  let testRoot;
  let mockSetStartYear;

  beforeAll(() => {
    // Mock window.userData
    window.userData = Promise.resolve({ InternalId: "12345" });
    window.showToast = jasmine.createSpy("showToast");

    // Add test root
    testRoot = document.createElement("div");
    testRoot.id = "app";
    document.body.appendChild(testRoot);
  });

  beforeEach(() => {
    // Mock fetch to return expected HTML structure
    spyOn(window, 'fetch').and.callFake((url) => {
    if (url.endsWith('/templates/cohort-selector.html')) {
      return Promise.resolve(new Response(`
        <div>
          <div id="cohortButtons"></div>
          <button id="submitBtn" disabled>Submit</button>
        </div>
      `));
    } else if (url.endsWith('/templates/learning-route.html')) {
      // Mock response voor LearningRoute fetch
      return Promise.resolve(new Response(`
        <div id="learningRoute">
          Learning route content
        </div>
      `));
    } 
    // fallback mock
    return Promise.reject(new Error('Unknown fetch url: ' + url));
  });
  });

  afterEach(() => {
    testRoot.innerHTML = "";
    localStorage.clear();
  });

  it("should render four cohort buttons for the past four years", async () => {
    mockSetStartYear = jasmine.createSpy("setStartYear");
    const { fragment } = await CohortSelector(mockSetStartYear);

    const buttons = fragment.querySelectorAll(".cohort-button");
    expect(buttons.length).toBe(4);

    const currentYear = new Date().getFullYear() + 1;
    buttons.forEach((button, index) => {
      expect(parseInt(button.dataset.year)).toBe(currentYear - index);
    });
  });

  it("should allow selecting a cohort and enable the submit button", async () => {
    mockSetStartYear = jasmine.createSpy("setStartYear");
    const { fragment } = await CohortSelector(mockSetStartYear);

    const buttons = fragment.querySelectorAll(".cohort-button");
    const submitBtn = fragment.getElementById("submitBtn");

    expect(submitBtn.disabled).toBeTrue();
    buttons[1].click();
    expect(buttons[1].classList.contains("selected")).toBeTrue();
    expect(submitBtn.disabled).toBeFalse();
  });

  it("should store selected cohort year in localStorage upon submit", async () => {
    mockSetStartYear = jasmine.createSpy("setStartYear");
    const { fragment } = await CohortSelector(mockSetStartYear);

    testRoot.appendChild(fragment);

    const buttons = testRoot.querySelectorAll(".cohort-button");
    const submitBtn = testRoot.querySelector("#submitBtn");

    buttons[0].click();
    expect(buttons[0].classList.contains("selected")).toBeTrue();

    submitBtn.click();

    await new Promise(r => setTimeout(r, 20));
    expect(localStorage.getItem("cohortYear")).toBe(buttons[0].dataset.year);
  });

  it("should only have one cohort button selected at a time", async () => {
    mockSetStartYear = jasmine.createSpy("setStartYear");
    const { fragment } = await CohortSelector(mockSetStartYear);

    testRoot.appendChild(fragment);

    const buttons = testRoot.querySelectorAll(".cohort-button");
    const submitBtn = testRoot.querySelector("#submitBtn");

    // Klik eerste button
    buttons[0].click();
    expect(buttons[0].classList.contains("selected")).toBeTrue();
    expect(submitBtn.disabled).toBeFalse();

    // Klik tweede button
    buttons[1].click();
    expect(buttons[1].classList.contains("selected")).toBeTrue();
    expect(buttons[0].classList.contains("selected")).toBeFalse();
  });

  it("should keep submit button disabled if no cohort selected", async () => {
    mockSetStartYear = jasmine.createSpy("setStartYear");
    const { fragment } = await CohortSelector(mockSetStartYear);

    testRoot.appendChild(fragment);

    const submitBtn = testRoot.querySelector("#submitBtn");

    expect(submitBtn.disabled).toBeTrue();
  });
});
