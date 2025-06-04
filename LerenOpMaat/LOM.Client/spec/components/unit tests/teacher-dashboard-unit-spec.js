import renderTeacherLearningRoutes from "../../../views/teacher-Dashboard.js";
window.userData = Promise.resolve({ InternalId: 3 });

const templateHtml = `
<div class="teacher-learning-route-container">
    <h2>Gekoppelde Leerroutes</h2>
    <div class="learning-route-content">
        <div class="learning-route-list" id="list">
        </div>
    </div>
</div>
`;

describe("renderTeacherLearningRoutes", () => {
    let app;

    beforeEach(() => {
        app = document.createElement("div");
        app.id = "app";
        document.body.appendChild(app);

        spyOn(window, "fetch").and.callFake(async (url) => {
            if (url.endsWith("teacher-Dashboard.html")) {
                return { text: async () => templateHtml };
            }
            if (url.includes("/api/Conversation/conversationByAdministratorId/")) {
                return {
                    ok: true,
                    status: 200,
                    json: async () => window.__testConversations || []
                };
            }
            // Geef altijd een geldige response terug voor andere fetches
            return {
                ok: true,
                status: 200,
                json: async () => ({}),
                text: async () => ""
            };
        });
    });

    afterEach(() => {
        const app = document.getElementById("app");
        if (app) app.remove();
        delete window.__testConversations;
    });

    it("toont melding als er geen conversaties zijn", async () => {
        window.__testConversations = [];
        await renderTeacherLearningRoutes();

        await new Promise(res => setTimeout(res, 0));

        const msg = document.querySelector("#list div");
        expect(msg).not.toBeNull();
        expect(msg.textContent).toContain("Geen Conversaties beschikbaar");
    });

});