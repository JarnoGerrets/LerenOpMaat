import { getConversationByUserId, getAllTeachers, postConversation, postMessage } from "../client/api-client.js";

export default async function Feedback() {
    const response = await fetch("/templates/feedback.html");
    const html = await response.text();

    const currentUserId = localStorage.getItem("currentUserId");
    const currentLearningRouteId = localStorage.getItem("learningRouteId");

    // Maak een tijdelijke DOM om alleen de body-content te pakken
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    const bodyContent = tempDiv.querySelector("body") ? tempDiv.querySelector("body").innerHTML : html;

    const template = document.createElement("template");
    template.innerHTML = bodyContent;
    const fragment = template.content.cloneNode(true);

    // Messages ophalen en tonen + gekoppelde teacher bepalen
    let conversation = null;
    let selectedTeacherIdFromConversation = null;
    const messageContainer = fragment.querySelector(".message-feedback-container");
    async function renderMessages() {
        messageContainer.innerHTML = "";
        try {
            conversation = await getConversationByUserId(currentUserId);
            if (conversation && conversation.TeacherId) {
                selectedTeacherIdFromConversation = conversation.TeacherId;
            }
            if (conversation && conversation.Message && Array.isArray(conversation.Message)) {
                const sortedMessages = conversation.Message.slice().sort((a, b) => b.Id - a.Id);
                sortedMessages.forEach(msg => {
                    const msgBox = document.createElement("div");
                    msgBox.className = "message-feedback-box";
                    msgBox.innerHTML = `
                        <div style="font-weight: bold; margin-bottom: 6px;">
                            ${msg.UserType || (msg.UserId === conversation.StudentId ? "Student" : "Begeleider")}
                        </div>
                        ${msg.Commentary}
                    `;
                    messageContainer.appendChild(msgBox);
                });
            } else {
                messageContainer.innerHTML = "<div class='message-feedback-box'>Geen berichten gevonden.</div>";
            }
        } catch (error) {
            messageContainer.innerHTML = "<div class='message-feedback-box'>Geen berichten gevonden.</div>";
        }
    }
    await renderMessages();

    // Vul de dropdown met leraren en selecteer gekoppelde indien aanwezig
    const dropdown = fragment.querySelector(".feedback-dropdown");
    // Validatie error element boven de dropdown
    const errorMsg = document.createElement("div");
    errorMsg.style.color = "red";
    errorMsg.style.marginBottom = "6px";
    errorMsg.style.display = "none";
    dropdown.parentNode.insertBefore(errorMsg, dropdown);

    if (dropdown) {
        dropdown.innerHTML = "";

        const placeholder = document.createElement("option");
        placeholder.value = "";
        placeholder.disabled = true;
        placeholder.selected = !selectedTeacherIdFromConversation;
        placeholder.hidden = true;
        placeholder.textContent = "Kies de leraar";
        dropdown.appendChild(placeholder);


        const teachers = await getAllTeachers();
        teachers.forEach(teacher => {
            const option = document.createElement("option");
            option.value = teacher.Id;
            option.textContent = teacher.FirstName + " " + teacher.LastName;
            if (selectedTeacherIdFromConversation && teacher.Id == selectedTeacherIdFromConversation) {
                option.selected = true;
            }
            dropdown.appendChild(option);
        });
    }

    const saveButton = fragment.querySelector(".save-btn");
    const textarea = fragment.querySelector(".feedback-box");
    if (saveButton && textarea && dropdown) {
        saveButton.addEventListener("click", async () => {
            const feedback = textarea.value.trim();
            const selectedTeacherId = dropdown.value;

            // Validatie
            let valid = true;
            errorMsg.style.display = "none";
            textarea.placeholder = "Typ hier je feedback...";
            textarea.style.borderColor = "";
            textarea.style.setProperty("color", "");

            if (!selectedTeacherId) {
                errorMsg.textContent = "Selecteer een leraar.";
                errorMsg.style.display = "block";
                dropdown.style.borderColor = "red";
                valid = false;
            }
            if (!feedback) {
                textarea.placeholder = "Feedback mag niet leeg zijn!";
                textarea.style.borderColor = "red";
                textarea.style.setProperty("color", "red", "important");
                valid = false;
            } else {
                textarea.style.setProperty("color", "", "important");
            }
            if (!valid) return;

            // Controleer of er al een conversatie is
            let conversationId = conversation && conversation.Id ? conversation.Id : null;

            // Als er geen conversatie is, maak er eerst een aan
            if (!conversationId) {
                const body = {
                    LearningRouteId: Number(currentLearningRouteId),
                    TeacherId: Number(selectedTeacherId),
                    StudentId: Number(currentUserId)
                };
                try {
                    const newConversation = await postConversation(body);
                    conversationId = newConversation.Id;
                    conversation = newConversation;
                } catch (err) {
                    return;
                }
            }

            const messageBody = {
                DateTime: new Date().toISOString(),
                Commentary: feedback,
                ConversationId: conversationId,
                UserId: currentUserId
            };
            try {
                await postMessage(messageBody);
                textarea.value = "";
                textarea.placeholder = "Typ hier je feedback...";
                textarea.style.borderColor = "";
                textarea.style.setProperty("color", "");
                errorMsg.style.display = "none";
                await renderMessages();
            } catch (err) {
                // Geen foutmelding tonen
            }
        });
    }

    return { fragment };
}