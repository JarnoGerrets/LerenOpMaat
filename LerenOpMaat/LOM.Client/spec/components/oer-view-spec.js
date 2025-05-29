// import oerView from "../../views/oer-view.js";
// import { JSDOM } from "jsdom";

// const dom = new JSDOM(`<!DOCTYPE html><body></body>`);
// global.window = dom.window;
// global.document = dom.window.document;
// global.customElements = dom.window.customElements;
// global.HTMLElement = dom.window.HTMLElement;
// global.URL = window.URL;
// global.Blob = window.Blob;

// let store = {};

// global.localStorage = {
//   getItem: jasmine.createSpy('getItem').and.callFake((key) => store[key]),
//   setItem: jasmine.createSpy('setItem').and.callFake((key, value) => {
//     store[key] = value;
//   }),
//   removeItem: jasmine.createSpy('removeItem').and.callFake((key) => {
//     delete store[key];
//   }),
//   clear: jasmine.createSpy('clear').and.callFake(() => {
//     store = {};
//   })
// };

// global.fetch = jasmine.createSpy("fetch").and.callFake(() =>
//   Promise.resolve({
//     text: () => Promise.resolve(`
//       <div>
//         <object id="oer-pdf" data="" type="application/pdf" width="100%" height="600px"></object>
//         <button id="uploadBtn">Upload</button>
//       </div>
//     `)
//   })
// );

// describe("OER View Integration", () => {
//   const mockBlob = new Blob(["%PDF-1.4"], { type: "application/pdf" });
//   const mockUploadOerPdf = jasmine.createSpy("uploadOerPdf").and.callFake(() => Promise.resolve());
//   const mockGetCurrentOerPdf = jasmine.createSpy("getCurrentOerPdf").and.callFake(() => Promise.resolve(mockBlob));

//   beforeEach(() => {
//     localStorage.clear();
//     localStorage.setItem("userData", JSON.stringify({ InternalId: null }));
//   });

//   it("laadt en toont de PDF in het object-element", async () => {
//     localStorage.setItem("userData", JSON.stringify({ Roles: ["Administrator"] }));
//     const { fragment } = await oerView(mockUploadOerPdf, mockGetCurrentOerPdf);
//     document.body.appendChild(fragment);

//     console.log(localStorage.getItem("userData"));
//     const objectElement = document.querySelector("object");
//     expect(objectElement.getAttribute("data")).toContain("blob:");
//   });

//   it("verbergt de upload-knop voor gebruikers zonder juiste rol", async () => {
//     localStorage.setItem("userData", JSON.stringify({ Roles: ["Student"] }));
//     const { fragment } = await oerView(mockUploadOerPdf, mockGetCurrentOerPdf);
//     document.body.appendChild(fragment);

//     console.log(localStorage.getItem("userData"));
//     const uploadBtn = document.getElementById("uploadBtn");
//     expect(uploadBtn.style.display).toBe("none");
//   });

//   it("opent de upload popup als op upload geklikt wordt", async () => {
//     localStorage.setItem("userData", JSON.stringify({ Roles: ["Lecturer"] }));
//     const { fragment } = await oerView(mockUploadOerPdf, mockGetCurrentOerPdf);
//     document.body.appendChild(fragment);

//     console.log(localStorage.getItem("userData"));
//     const uploadBtn = document.getElementById("uploadBtn");
//     expect(uploadBtn).not.toBeNull();
//     uploadBtn.click();

//     const popup = document.querySelector(".confirmation-popup-content");
//     expect(popup).not.toBeNull();
//     expect(popup.textContent).toContain("Sleep een PDF-bestand hierheen");
//   });

//   it("toont foutmelding bij upload van een niet-PDF bestand", async () => {
//     localStorage.setItem("userData", JSON.stringify({ Roles: ["Administrator"] }));
//     const { fragment } = await oerView(mockUploadOerPdf, mockGetCurrentOerPdf);
//     document.body.appendChild(fragment);

//     document.getElementById("uploadBtn").click();

//     console.log(localStorage.getItem("userData"));
//     const dropzone = document.getElementById("dropzone");
//     const status = document.getElementById("upload-status");

//     const evt = new window.DragEvent("drop", {
//       dataTransfer: {
//         files: [new File(["test"], "test.txt", { type: "text/plain" })],
//       },
//       bubbles: true,
//       cancelable: true
//     });

//     dropzone.dispatchEvent(evt);
//     expect(status.textContent).toContain("Alleen PDF-bestanden zijn toegestaan.");
//   });

//   it("uploadt een PDF bestand succesvol", async () => {
//     console.log("test");
//     localStorage.setItem("userData", JSON.stringify({ Roles: ["Administrator"] }));
//     console.log(localStorage.getItem("userData"));
//     const { fragment } = await oerView(mockUploadOerPdf, mockGetCurrentOerPdf);
//     document.body.appendChild(fragment);

//     document.getElementById("uploadBtn").click();

//     console.log("DEBUG userData raw:", userData);
//     console.log(localStorage.getItem("test"));
//     fail("Stop hier");

//     const fileInput = document.getElementById("fileInput");
//     const confirmBtn = document.getElementById("confirm-upload");

//     const testPdf = new File(["%PDF-1.4"], "test.pdf", { type: "application/pdf" });
//     Object.defineProperty(fileInput, "files", { value: [testPdf] });

//     confirmBtn.click();

//     // uploadOerPdf is async, wachten op call
//     await new Promise(r => setTimeout(r, 100));

//     expect(mockUploadOerPdf).toHaveBeenCalledWith(testPdf);
//   });
// });
