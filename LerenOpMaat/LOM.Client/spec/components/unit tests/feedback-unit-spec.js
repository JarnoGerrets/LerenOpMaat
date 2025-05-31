import Feedback from "../../../views/feedback.js";

describe("Feedback frontend", () => {
    let app;
    let teachersMock, messagesMock, conversationMock;

    beforeEach(() => {
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

        // Mock fetch voor template
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
        window.getMessagesByConversationId = async () => messagesMock;
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
    });

    it("vult de dropdown met docenten", async () => {
        const { fragment } = await Feedback();
        app.appendChild(fragment);

        const dropdown = document.querySelector(".feedback-dropdown");
        await new Promise(res => setTimeout(res, 0));

        const options = Array.from(dropdown.options).map(opt => opt.textContent);
        expect(options).toContain("Jan Jansen");
        expect(options).toContain("Piet Pietersen");
    });

    it("toont berichten in message-feedback-container", async () => {
        const { fragment } = await Feedback();
        app.appendChild(fragment);

        await new Promise(res => setTimeout(res, 0));

        const container = document.querySelector(".message-feedback-container");
        expect(container.innerHTML).toContain("Hallo!");
        expect(container.innerHTML).toContain("Goed gedaan!");
        expect(container.innerHTML).toContain("Student Test");
        expect(container.innerHTML).toContain("Piet Pietersen");
    });
});