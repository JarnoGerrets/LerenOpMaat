import oerView from "../../../views/oer-view.js";

describe("oerView", () => {
  let testRoot;
  let mockUploadOerPdf;
  let mockGetCurrentOerPdf;
  
  beforeAll(() => {
    window.showToast = jasmine.createSpy("showToast");

    testRoot = document.createElement("div");
    testRoot.id = "app";
    document.body.appendChild(testRoot);
  });

  beforeEach(() => {
    localStorage.setItem("userData", JSON.stringify({
      Roles: ["Lecturer"]
    }));

    spyOn(window, "fetch").and.callFake((url) => {
      if (url.endsWith("/templates/Oer.html")) {
        return Promise.resolve(new Response(`
          <div>
            <object></object>
            <button id="uploadBtn">Upload</button>
          </div>
        `));
      }
      return Promise.reject(new Error("Unexpected fetch URL: " + url));
    });

    mockUploadOerPdf = jasmine.createSpy("uploadOerPdf").and.returnValue(Promise.resolve());
    mockGetCurrentOerPdf = jasmine.createSpy("getCurrentOerPdf").and.returnValue(
      Promise.resolve(new Blob(["dummy pdf content"], { type: "application/pdf" }))
    );

    testRoot.innerHTML = "";
  });

  afterEach(() => {
    localStorage.clear();
    testRoot.innerHTML = "";
    window.showToast.calls.reset();
    document.body.querySelectorAll(".popup, .confirmation-popup-content").forEach(el => el.remove());
  });

  it("should render the template and set PDF object data attribute", async () => {
    const { fragment } = await oerView(mockUploadOerPdf, mockGetCurrentOerPdf);

    testRoot.appendChild(fragment);
    const objectEl = testRoot.querySelector("object");

    expect(objectEl).toBeTruthy();
    expect(mockGetCurrentOerPdf).toHaveBeenCalled();

    expect(objectEl.getAttribute("data")).toMatch(/^blob:/);
  });

  it("should hide upload button for users without proper role", async () => {
    localStorage.setItem("userData", JSON.stringify({ Roles: ["Student"] }));

    const { fragment } = await oerView(mockUploadOerPdf, mockGetCurrentOerPdf);

    testRoot.appendChild(fragment);

    const uploadBtn = testRoot.querySelector("#uploadBtn");
    expect(uploadBtn.style.display).toBe("none");
  });

  it("should show upload button for Administrator or Lecturer role", async () => {
    localStorage.setItem("userData", JSON.stringify({ Roles: ["Administrator"] }));

    const { fragment } = await oerView(mockUploadOerPdf, mockGetCurrentOerPdf);

    testRoot.appendChild(fragment);

    const uploadBtn = testRoot.querySelector("#uploadBtn");
    expect(uploadBtn.style.display).not.toBe("none");
  });

  it("should show error toast if upload fails", async () => {
    mockUploadOerPdf.and.returnValue(Promise.reject(new Error("Upload failed")));

    const { fragment } = await oerView(mockUploadOerPdf, mockGetCurrentOerPdf);
    testRoot.appendChild(fragment);

    const uploadBtn = testRoot.querySelector("#uploadBtn");
    uploadBtn.click();

    const popupContent = document.body.querySelector(".confirmation-popup-content");
    const fileInput = popupContent.querySelector("#fileInput");
    const confirmBtn = popupContent.querySelector("#confirm-upload");

    const fakeFile = new File(["pdf content"], "fail.pdf", { type: "application/pdf" });
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(fakeFile);
    fileInput.files = dataTransfer.files;
    fileInput.dispatchEvent(new Event("change"));

    confirmBtn.click();

    await new Promise(r => setTimeout(r, 0));

    expect(window.showToast).toHaveBeenCalledWith(
      jasmine.stringMatching(/^Er is een fout opgetreden/),
      "error"
    );
  });

  it("should update file name text when file selected via input", async () => {
    const { fragment } = await oerView(mockUploadOerPdf, mockGetCurrentOerPdf);
    testRoot.appendChild(fragment);

    const uploadBtn = testRoot.querySelector("#uploadBtn");
    uploadBtn.click();

    const popupContent = document.body.querySelector(".confirmation-popup-content");
    const fileInput = popupContent.querySelector("#fileInput");
    const fileNameSpan = popupContent.querySelector("#file-name");

    const fakeFile = new File(["content"], "file.pdf", { type: "application/pdf" });

    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(fakeFile);
    fileInput.files = dataTransfer.files;
    fileInput.dispatchEvent(new Event("change"));

    expect(fileNameSpan.textContent).toBe("file.pdf");
  });
});
