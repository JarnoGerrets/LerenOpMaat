import Feedback from "../../../views/feedback.js";

// spec/components/unit tests/feedback-unit-spec.test.js

describe("Feedback .message-feedback-container", () => {
    let app;
    let teachersMock, messagesMock, conversationMock;

    beforeEach(() => {
        // Clean up DOM
        const oldApp = document.getElementById('app');
        if (oldApp) oldApp.remove();

        app = document.createElement('div');
        app.id = 'app';
        document.body.appendChild(app);

        // Mock user
        window.userData = Promise.resolve({ InternalId: 42 });

        // Mock API data
        teachersMock = [
            { Id: 1, FirstName: "Jan", LastName: "Jansen" },
            { Id: 2, FirstName: "Piet", LastName: "Pietersen" }
        ];
        conversationMock = { Id: 123, TeacherId: 2, StudentId: 42 };

        // Mock fetch
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
            if (url.includes("/api/Conversation/conversationByStudentId/")) {
                return {
                    ok: true,
                    status: 200,
                    json: async () => conversationMock
                };
            }
            if (url.includes("/api/Message/messagesByConversationId/")) {
                return {
                    ok: true,
                    status: 200,
                    json: async () => messagesMock
                };
            }
            return { text: async () => "" };
        });

        // Mock API client functions
        window.getAllTeachers = async () => teachersMock;
        window.getConversationByUserId = async () => conversationMock;
        window.getMessagesByConversationId = async () => messagesMock;
        window.updateConversation = async () => {};
        window.postMessage = async () => {};
    });

    afterEach(() => {
        const oldApp = document.getElementById('app');
        if (oldApp) oldApp.remove();
        delete window.getAllTeachers;
        delete window.getConversationByUserId;
        delete window.getMessagesByConversationId;
        delete window.updateConversation;
        delete window.postMessage;
        delete window.userData;
    });

    it("toont 'Geen berichten gevonden.' als er geen berichten zijn", async () => {
        messagesMock = [];
        const { fragment } = await Feedback();
        app.appendChild(fragment);

        await new Promise(res => setTimeout(res, 0));

        const container = document.querySelector(".message-feedback-container");
        expect(container.innerHTML).toContain("Geen berichten gevonden.");
    });

    it("toont berichten als er berichten zijn", async () => {
        messagesMock = [
            {
                Id: 1,
                Commentary: "Testbericht!",
                DateTime: "2024-05-30T10:00:00",
                User: { Id: 42, FirstName: "Student", LastName: "Test" }
            }
        ];
        const { fragment } = await Feedback();
        app.appendChild(fragment);

        await new Promise(res => setTimeout(res, 0));

        const container = document.querySelector(".message-feedback-container");
        expect(container.innerHTML).not.toContain("Geen berichten gevonden.");
        expect(container.innerHTML).toContain("Testbericht!");
        expect(container.innerHTML).toContain("Student Test");
    });
});