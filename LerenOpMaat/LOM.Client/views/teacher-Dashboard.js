import { getConversationByAdminId } from '../client/api-client.js';

export default async function renderTeacherLearningRoutes() {
    const res = await fetch('./templates/teacher-Dashboard.html');
    const html = await res.text();
    document.getElementById('app').innerHTML = html;
    const fragment = document.createDocumentFragment();

    let userData = await window.userData;
    const conversations = await getConversationByAdminId(userData.InternalId);

    // Haal conversations op voor deze admin (teacher)
    let routes = [];
    if (userData && userData.InternalId) {
        try {
            routes = conversations.map(conv => {
                const user = conv.Student;
                const fullName = user
                    ? `${user.FirstName ?? ''} ${user.LastName ?? ''}`.trim()
                    : 'Onbekende gebruiker';
                return {
                    title: fullName,
                    learningRoute: conv.LearningRoute
                };
            });
        } catch (err) {
            console.error('Fout bij ophalen conversations:', err);
        }
    }

    const listContainer = document.getElementById('list');
    if (!listContainer) {
        console.error('Element .learning-route-list niet gevonden!');
        return;
    }
    listContainer.innerHTML = '';

    routes.forEach((route, idx) => {
        const routeDiv = document.createElement('div');
        routeDiv.className = 'learning-route-row';
        routeDiv.innerHTML = `
        <span class="learning-route-title">${route.title}</span>
        <button class="open-route-btn">Openen</button>
    `;
        listContainer.appendChild(routeDiv);
        const openBtn = routeDiv.querySelector('.open-route-btn');
        openBtn.addEventListener('click', async () => {
            const conversationId = conversations[idx].Id;
            const userId = conversations[idx].StudentId;
            if (!conversationId || !userId) {
                alert("Kan deze conversatie niet openen: ontbrekende gegevens.");
                return;
            }
            sessionStorage.setItem('lom_conversationId', conversationId);
            sessionStorage.setItem('lom_userId', userId);
            window.location.hash = "#beheerder-feedback";
        });
    });

    return { fragment };
}