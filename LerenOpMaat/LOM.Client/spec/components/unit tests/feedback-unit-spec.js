import Feedback from "../../../views/feedback.js";

describe("Feedback frontend", () => {
    let app;
    let teachersMock, messagesMock, conversationMock;

    beforeEach(() => {
        // Reset fetch spy als die al bestaat
        if (window.fetch && window.fetch.and && window.fetch.and.originalFn) {
            window.fetch = window.fetch.and.originalFn;
        }

        // Verwijder oude app-div als die bestaat
        const oldApp = document.getElementById('app');
        if (oldApp) oldApp.remove();

        app = document.createElement('div');
        app.id = 'app';
        document.body.appendChild(app);

        // Mock window.userData
        window.userData = Promise.resolve({ InternalId: 42 });

        // Mock API calls
        teachersMock = [
            { Id: 1, FirstName: "Jan", LastName: "Jansen" },
            { Id: 2, FirstName: "Piet", LastName: "Pietersen" }
        ];
        messagesMock = [
            {
                Id: 1,
                Commentary: "Hallo!",
                DateTime: "2024-05-30T10:00:00",
                User: { Id: 42, FirstName: "Student", LastName: "Test" }
            },
            {
                Id: 2,
                Commentary: "Goed gedaan!",
                DateTime: "2024-05-30T11:00:00",
                User: { Id: 2, FirstName: "Piet", LastName: "Pietersen" }
            }
        ];
        conversationMock = { Id: 123, TeacherId: 2, StudentId: 42 };

        // Mock fetch voor template en API
        spyOn(window, "fetch").and.callFake(async (url) => {
            if (url.endsWith("feedback.html")) {
                return {
                    text: async () => `
                        <div class="container chat-layout">
                            <div class="feedback-header-row">
                                <div class="feedback-dropdown-row">
                                    <select class="feedback-dropdown"></select>
                                    <div class="feedback-error"></div>
                                </div>
                            </div>
                            <div class="message-feedback-outer">
                                <div class="message-feedback-container"></div>
                            </div>
                            <div class="feedback-input-row">
                                <textarea class="feedback-box"></textarea>
                                <button class="save-btn">Verzenden</button>
                            </div>
                        </div>
                    `
                };
            }
            if (url.endsWith("/api/User/teachers") || url.includes("/api/User/teachers")) {
                return {
                    ok: true,
                    status: 200,
                    json: async () => teachersMock
                };
            }
            // Mock conversatie ophalen
            if (url.includes("/api/Conversation/conversationByStudentId/")) {
                return {
                    ok: true,
                    status: 200,
                    json: async () => conversationMock
                };
            }
            // Mock berichten ophalen
            if (url.includes("/api/Message/messagesByConversationId/")) {
                console.log("fetch-mock geeft terug:", messagesMock);
                return {
                    ok: true,
                    status: 200,
                    json: async () => messagesMock
                };
            }
            // fallback
            return { text: async () => "" };
        });

        // Mock api-client.js functies op window
        window.getAllTeachers = async () => teachersMock;
        window.getConversationByUserId = async () => conversationMock;
        window.getMessagesByConversationId = async (id) => messagesMock;
        window.updateConversation = async () => { };
        window.postMessage = async () => { };
    });

    afterEach(() => {
        // Verwijder app-div na elke test
        const oldApp = document.getElementById('app');
        if (oldApp) oldApp.remove();

        delete window.getAllTeachers;
        delete window.getConversationByUserId;
        delete window.getMessagesByConversationId;
        delete window.updateConversation;
        delete window.postMessage;
        delete window.userData;
    });

    it("vult de dropdown met docenten", async () => {
        const { fragment } = await Feedback();
        app.appendChild(fragment);

        await new Promise(res => setTimeout(res, 0)); // wacht op async rendering

        const dropdown = document.querySelector(".feedback-dropdown");
        const options = Array.from(dropdown.options).map(opt => opt.textContent);
        expect(options).toContain("Jan Jansen");
        expect(options).toContain("Piet Pietersen");
    });

    it("toont 'Geen berichten gevonden.' als er geen berichten zijn", async () => {
        const { fragment } = await Feedback();
        app.appendChild(fragment);

        await new Promise(res => setTimeout(res, 0)); // wacht op async rendering

        const container = document.querySelector(".message-feedback-container");
        expect(container.innerHTML).toContain("Geen berichten gevonden.");
    });
});