import {
    getConversationByUserId,
    getAllTeachers,
    postMessage,
    updateConversation,
    getMessagesByConversationId,
} from "../client/api-client.js";

export default async function beheerderFeedback() {
    const conversationId = sessionStorage.getItem('lom_conversationId');
    const studentId = sessionStorage.getItem('lom_StudentId');
    const response = await fetch("/templates/beheerder-feedback.html");
    const html = await response.text();
    const userData = await window.userData;

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    const bodyContent = tempDiv.querySelector("body") ? tempDiv.querySelector("body").innerHTML : html;

    const template = document.createElement("template");
    template.innerHTML = bodyContent;
    const fragment = template.content.cloneNode(true);

    let conversation = null;
    let selectedTeacherIdFromConversation = null;

    // make scrollbar only visible when scrolling
    const messageContainer = fragment.querySelector(".message-feedback-container");
    messageContainer.addEventListener('scroll', () => {
        messageContainer.classList.add('show-scrollbar');

        clearTimeout(messageContainer._scrollTimer);

        messageContainer._scrollTimer = setTimeout(() => {
            messageContainer.classList.remove('show-scrollbar');
        }, 1500);
    });

    const dropdown = fragment.querySelector(".feedback-dropdown");
    const textarea = fragment.querySelector(".feedback-box");
    const saveButton = fragment.querySelector(".save-btn");

    const errorMsg = document.createElement("div");
    errorMsg.style.color = "red";
    errorMsg.style.marginBottom = "6px";
    errorMsg.style.display = "none";
    dropdown.parentNode.insertBefore(errorMsg, dropdown);

    function updateTextareaPlaceholder() {
        const selectedOption = dropdown.options[dropdown.selectedIndex];
        if (selectedOption && selectedOption.value) {
            textarea.placeholder = `Vraag feedback aan ${selectedOption.textContent}`;
        } else {
            textarea.placeholder = "Typ hier je feedback...";
        }
    }

    const currentUserId = userData.InternalId;
    async function renderMessages() {
        messageContainer.innerHTML = "";
        try {
            conversation = await getConversationByUserId(studentId);
            if (conversation && conversation.TeacherId) {
                selectedTeacherIdFromConversation = conversation.TeacherId;
            }
            if (conversation && conversationId) {
                let messages = await getMessagesByConversationId(conversationId);
                messages = Array.isArray(messages) ? messages : (messages ? [messages] : []);
                if (messages.length > 0) {
                    const sortedMessages = messages.slice().sort((a, b) => a.Id - b.Id);
                    sortedMessages.forEach(msg => {
                        let senderName = "Onbekend";
                        if (msg.User && msg.User.FirstName) {
                            senderName = `${msg.User.FirstName} ${msg.User.LastName}`;
                        }
                        const formattedDate = msg.DateTime ? formatDateTime(msg.DateTime) : "";
                        const msgBox = document.createElement("div");
                        msgBox.className = "message-feedback-box";

                        // Controleer of het bericht van de ingelogde gebruiker is
                        if (msg.User && msg.User.Id === currentUserId) {
                            msgBox.classList.add("role-2");
                            msgBox.innerHTML = `
                            <div style="display: flex; justify-content: space-between; align-items: center; font-weight: bold; margin-bottom: 6px;">
                                <span class="message-date">${formattedDate}</span>
                                <span>${senderName}</span>
                            </div>
                            <div class="message-right">${msg.Commentary}</div>`;
                        } else {
                            msgBox.classList.add("role-1");
                            msgBox.innerHTML = `
                            <div style="display: flex; justify-content: space-between; align-items: center; font-weight: bold; margin-bottom: 6px;">
                                <span>${senderName}</span>
                                <span class="message-date">${formattedDate}</span>
                            </div>
                            <div>${msg.Commentary}</div>`;
                        }
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

        updateTextareaPlaceholder();

        // Direct begeleider aanpassen bij wijzigen dropdown
        dropdown.addEventListener("change", async () => {
            updateTextareaPlaceholder();

            const selectedTeacherId = dropdown.value;

            // Alleen updaten als conversation bestaat en TeacherId echt anders is
            if (conversation && String(conversation.TeacherId) !== String(selectedTeacherId)) {
                const updateBody = {
                    id: conversation.Id,
                    LearningRouteId: conversation.LearningRouteId,
                    TeacherId: Number(selectedTeacherId),
                    StudentId: conversation.StudentId
                };
                try {
                    await updateConversation(conversationId, updateBody);
                    conversation = await getConversationByUserId(studentId);
                    await renderMessages();
                } catch (err) {
                    errorMsg.textContent = "Kon begeleider niet aanpassen.";
                    errorMsg.style.display = "block";
                    console.error("Backend error bij updateConversation:", err);
                }
            } else {
                errorMsg.style.display = "none";
            }
        });
    }


    if (saveButton && textarea && dropdown) {
        saveButton.addEventListener("click", async () => {
            let feedback = textarea.value.trim();
            const selectedTeacherId = dropdown.value;

            errorMsg.style.display = "none";
            updateTextareaPlaceholder();
            textarea.style.borderColor = "";
            textarea.classList.remove("lom-feedback-placeholder-error");
            dropdown.style.borderColor = "";

            let valid = true;
            if (!conversationId) {
                errorMsg.textContent = "Er bestaat nog geen conversatie. Vraag eerst een begeleider aan.";
                errorMsg.style.display = "block";
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

            try {
                // Alleen updateConversation aanroepen als TeacherId gewijzigd is
                if (conversation.TeacherId != Number(selectedTeacherId)) {
                    await updateConversation(conversationId, {
                        ...conversation,
                        TeacherId: Number(selectedTeacherId)
                    });
                    conversation = await getConversationByUserId(studentId);
                }

                await postFeedbackMessage(conversationId, feedback, currentUserId);

                textarea.value = "";
                updateTextareaPlaceholder();
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

    const learningRouteLink = fragment.querySelector('#learning-route-link');
    if (learningRouteLink) {
        learningRouteLink.addEventListener('click', (e) => {
            e.preventDefault();
            sessionStorage.setItem('lom_conversationId', conversationId);
            sessionStorage.setItem('lom_StudentId', studentId);
            window.location.hash = "#beheerder-learning-route";
        });
    }

    const gobackLink = fragment.querySelector('#go-back-link');
    if (gobackLink) {
        gobackLink.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.hash = "#Dashboard";
        });
    }


    return { fragment };
}

async function getOrCreateConversation(studentId) {
    return await getConversationByUserId(studentId);
}

async function postFeedbackMessage(conversationId, feedback, currentUserId) {
    const now = new Date();
    const pad = n => n.toString().padStart(2, "0");
    const localDateTime = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    const messageBody = {
        DateTime: localDateTime, // lokale tijd in ISO-formaat
        Commentary: feedback,
        ConversationId: conversationId,
        UserId: currentUserId
    };
    await postMessage(messageBody);
}

function formatDateTime(dateString) {
    const date = new Date(dateString);
    const pad = n => n.toString().padStart(2, "0");
    const day = pad(date.getDate());
    const month = pad(date.getMonth() + 1);
    const year = date.getFullYear();
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    return `${day}-${month}-${year} ${hours}:${minutes}`;
}

