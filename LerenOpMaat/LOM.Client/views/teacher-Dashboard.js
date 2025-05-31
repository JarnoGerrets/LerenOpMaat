import { getConversationByAdminId, markNotificationsAsRead } from '../client/api-client.js';

export default async function renderTeacherLearningRoutes() {
    const res = await fetch('./templates/teacher-Dashboard.html');
    const html = await res.text();
    document.getElementById('app').innerHTML = html;
    const fragment = document.createDocumentFragment();

    let userData = await window.userData;
    let conversations = await getConversationByAdminId(userData.InternalId);

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
    if (routes.length === 0) {
        // Voeg deze melding toe als er geen leerroutes zijn
        const msg = document.createElement('div');
        msg.textContent = "Geen Conversaties beschikbaar";
        msg.style.textAlign = "center";
        msg.style.padding = "1rem";
        msg.style.color = "#888";
        listContainer.appendChild(msg);
    } else {
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

                let body = {
                    UserId: userData.InternalId,
                    ConversationId: conversationId
                };

                try {
                    await markNotificationsAsRead(body);
                } catch (err) {
                    console.error("Failed to mark notifications as read:", err);
                }

                sessionStorage.setItem('lom_conversationId', conversationId);
                sessionStorage.setItem('lom_userId', userId);
                window.location.hash = "#beheerder-feedback";
                document.querySelector("lom-header").initializeNotifications();
            });
        });
    }
    return { fragment };
}