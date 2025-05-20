import {
    getConversationByUserId,
    getAllTeachers,
    postConversation,
    postMessage,
    updateConversation,
    getMessagesByConversationId
} from "../client/api-client.js";

export default async function Feedback() {
    const response = await fetch("/templates/feedback.html");
    const html = await response.text();

    const currentUserId = localStorage.getItem("currentUserId");
    const currentLearningRouteId = localStorage.getItem("learningRouteId");

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    const bodyContent = tempDiv.querySelector("body") ? tempDiv.querySelector("body").innerHTML : html;

    const template = document.createElement("template");
    template.innerHTML = bodyContent;
    const fragment = template.content.cloneNode(true);

    let conversation = null;
    let selectedTeacherIdFromConversation = null;

    const messageContainer = fragment.querySelector(".message-feedback-container");
    const dropdown = fragment.querySelector(".feedback-dropdown");
    const textarea = fragment.querySelector(".feedback-box");
    const saveButton = fragment.querySelector(".save-btn");

    const errorMsg = document.createElement("div");
    errorMsg.style.color = "red";
    errorMsg.style.marginBottom = "6px";
    errorMsg.style.display = "none";
    dropdown.parentNode.insertBefore(errorMsg, dropdown);

    async function renderMessages() {
        messageContainer.innerHTML = "";
        try {
            conversation = await getConversationByUserId(currentUserId);
            if (conversation && conversation.TeacherId) {
                selectedTeacherIdFromConversation = conversation.TeacherId;
            }
            if (conversation && conversation.Id) {
                let messages = await getMessagesByConversationId(conversation.Id);
                messages = Array.isArray(messages) ? messages : (messages ? [messages] : []);
                if (messages.length > 0) {
                    const sortedMessages = messages.slice().sort((a, b) => b.Id - a.Id);
                    sortedMessages.forEach(msg => {
                        let senderName = "Onbekend";
                        if (msg.User && msg.User.FirstName && msg.User.LastName) {
                            senderName = `${msg.User.FirstName} ${msg.User.LastName}`;
                        }
                        const msgBox = document.createElement("div");
                        msgBox.className = "message-feedback-box";
                        msgBox.innerHTML = `
                            <div style="font-weight: bold; margin-bottom: 6px;">
                            ${senderName}
                            </div>
                            ${msg.Commentary}`;
                        messageContainer.appendChild(msgBox);
                    });
                } else {
                    messageContainer.innerHTML = "<div class='message-feedback-box' style='opacity: 0.6;'>Geen berichten gevonden.</div>";
                }
            } else {
                messageContainer.innerHTML = "<div class='message-feedback-box' style='opacity: 0.6;'>Geen berichten gevonden.</div>";
            }
        } catch (error) {
            messageContainer.innerHTML = "<div class='message-feedback-box' style='opacity: 0.6;'>Geen berichten gevonden.</div>";
        }
    }
    await renderMessages();

    // Dropdown vullen
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

        // Direct begeleider aanpassen bij wijzigen dropdown
        dropdown.addEventListener("change", async () => {
            const selectedTeacherId = dropdown.value;
            conversation = await getConversationByUserId(currentUserId);

            // Alleen updaten als conversation bestaat en TeacherId echt anders is
            if (conversation && String(conversation.TeacherId) !== String(selectedTeacherId)) {
                try {
                    await updateConversation(conversation.Id, {
                        ...conversation,
                        TeacherId: Number(selectedTeacherId)
                    });
                    conversation = await getConversationByUserId(currentUserId);
                    await renderMessages();
                } catch (err) {
                    errorMsg.textContent = "Kon begeleider niet aanpassen.";
                    errorMsg.style.display = "block";
                }
            } else {
                errorMsg.style.display = "none";
            }
        });
    }

    // Opslaan knop
    if (saveButton && textarea && dropdown) {
        saveButton.addEventListener("click", async () => {
            let feedback = textarea.value.trim();
            const selectedTeacherId = dropdown.value;

            errorMsg.style.display = "none";
            textarea.placeholder = "Typ hier je feedback...";
            textarea.style.borderColor = "";
            textarea.classList.remove("lom-feedback-placeholder-error");
            dropdown.style.borderColor = "";

            // Haal altijd de laatste conversatie op
            conversation = await getConversationByUserId(currentUserId);
            let conversationId = conversation && conversation.Id ? conversation.Id : null;

            // Alleen valideren op begeleider als er nog GEEN conversatie is
            let valid = true;
            if (!conversationId && !selectedTeacherId) {
                errorMsg.textContent = "Selecteer een leraar.";
                errorMsg.style.display = "block";
                dropdown.style.borderColor = "red";
                valid = false;
            }
            if (!feedback) {
                textarea.placeholder = "Feedback mag niet leeg zijn!";
                textarea.style.borderColor = "red";
                textarea.classList.add("lom-feedback-placeholder-error");
                valid = false;
            } else {
                textarea.classList.remove("lom-feedback-placeholder-error");
            }
            if (!valid) return;

            // Als er nog geen conversatie is, maak er een aan
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
                    errorMsg.textContent = "Kon conversatie niet aanmaken.";
                    errorMsg.style.display = "block";
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
                textarea.classList.remove("lom-feedback-placeholder-error");
                errorMsg.style.display = "none";
                dropdown.style.borderColor = "";
                await renderMessages();
            } catch (err) {
                errorMsg.textContent = "Kon bericht niet plaatsen.";
                errorMsg.style.display = "block";
            }
        });
    }

    return { fragment };
}
