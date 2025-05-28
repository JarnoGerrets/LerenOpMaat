import { getConversationByAdminId } from '../client/api-client.js';

export default async function renderTeacherLearningRoutes() {
    const res = await fetch('./templates/teacher-Dashboard.html');
    const html = await res.text();
    document.getElementById('app').innerHTML = html;
    const fragment = document.createDocumentFragment();

    let userData = null;
    let tries = 0;
    // Wacht tot userData in localStorage staat (max 2 seconden)
    while (!userData && tries < 20) {
        userData = JSON.parse(localStorage.getItem("userData"));
        if (!userData) await new Promise(res => setTimeout(res, 100));
        tries++;
    }

    // Haal conversations op voor deze admin (teacher)
    let routes = [];
    if (userData && userData.InternalId) {
        try {
            const conversations = await getConversationByAdminId(userData.InternalId);
            console.log('Conversation:', conversations);
            routes = conversations.map(conv => {
                const user = conv.LearningRoute?.User;
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

    routes.forEach(route => {
        const routeDiv = document.createElement('div');
        routeDiv.className = 'learning-route-row';
        routeDiv.innerHTML = `
        <span class="learning-route-title">${route.title}</span>
        <button class="open-route-btn">Openen</button>
    `;
        listContainer.appendChild(routeDiv);
    });

    return { fragment };
}