import { userData } from "../scripts/utils/getUserData.js";
import { getLoginUrl, logout, getNotificationsByUserId, markNotificationsAsRead, getAllRoles } from '../client/api-client.js';

export default class Header extends HTMLElement {
  constructor() {
    super();
  }

  async connectedCallback() {
    const res = await fetch("/templates/header.html");
    const html = await res.text();

    const template = document.createElement("template");
    template.innerHTML = html.trim();

    this.appendChild(template.content.cloneNode(true));

    this.runScripts(this);
  }

  runScripts(root) {
    this.initializeLogin();
    this.initializeNotifications();
    this.setupNotificationHandlers();

    const scripts = root.querySelectorAll("script");
    scripts.forEach(oldScript => {
      const newScript = document.createElement("script");
      if (oldScript.src) {
        newScript.src = oldScript.src;
      } else {
        newScript.textContent = oldScript.textContent;
      }
      document.body.appendChild(newScript);
    });
  }

  async initializeLogin() {
    const loginObj = this.querySelector("#login-url");
    const logoutObj = this.querySelector("#logout");
    const simulatedRoleObj = this.querySelector("#simulated-role");
    const simulatedDropdown = this.querySelector("#simulated-role-dropdown");
    const bell = this.querySelector("#notification-bell");
    const _userData = await userData;

    if (_userData) {
      if (_userData.Roles.includes("Administrator")) {
        simulatedRoleObj.classList.remove("hidden");
        loginObj.innerHTML = "Administrator";
        simulatedRoleObj.style.display = "inline-block";
        const roles = await getAllRoles();

        simulatedRoleObj.innerHTML = `Toon applicatie als: ${roleTranslations[_userData.EffectiveRole] || _userData.EffectiveRole} ⯆`;

        simulatedDropdown.innerHTML = "";
        roles.forEach(role => {
          const option = document.createElement("div");
          option.textContent = roleTranslations[role.RoleName] || role.RoleName;
          option.classList.add("simulated-role-option");
          option.addEventListener("click", () => {
            simulatedRoleObj.innerHTML = `Toon applicatie als: ${roleTranslations[role.RoleName] || role.RoleName} ⯆`;
            simulatedDropdown.classList.add("hidden");
            sessionStorage.setItem("simulatedRole", JSON.stringify(role));
            window.location.reload();
          });
          simulatedDropdown.appendChild(option);
        });

        simulatedRoleObj.addEventListener("click", (e) => {
          e.stopPropagation();
          simulatedDropdown.classList.toggle("hidden");
        });

        document.addEventListener("click", () => {
          simulatedDropdown.classList.add("hidden");
        });
      } else {
        loginObj.innerHTML = _userData.Username;
      }

      logoutObj.classList.remove("d-none");
      logoutObj.addEventListener("click", () => logout());
    } else {
      loginObj.href = getLoginUrl();
      bell.classList.add("hidden");
      return;
    }

    const dashboardLink = this.querySelector('a[data-link][href="#Dashboard"]')
    if (_userData && _userData?.EffectiveRole?.toLowerCase() != "student") {
      dashboardLink.classList.remove("hidden");
    }
    const reportLink = this.querySelector('a[data-link][href="#rapportage"]')
    if (_userData && _userData?.EffectiveRole?.toLowerCase() === "administrator") {
      reportLink.classList.remove("hidden");
    }
  }


  async initializeNotifications() {
    const bell = this.querySelector("#notification-bell");
    const dropdown = this.querySelector("#notification-dropdown");
    const badge = this.querySelector("#notificationAmount");

    const _userData = await userData;
    if (!_userData) return;
    const currentUserId = _userData.InternalId;

    const notifications = await getNotificationsByUserId(_userData.InternalId);
    console.log(notifications);
    const grouped = {};
    notifications.forEach(msg => {
      const conversationId = msg.Conversation.Id;

      let otherUser = null;
      if (msg.Conversation.Student?.id !== currentUserId) {
        otherUser = msg.Conversation.Student;
      } else {
        otherUser = msg.Conversation.Teacher;
      }

      const otherUserName = `${otherUser?.FirstName} ${otherUser?.LastName}` || "Onbekend";

      if (!grouped[conversationId]) {
        grouped[conversationId] = {
          count: 0,
          otherUserName: otherUserName,
          conversationId: conversationId,
          userId: (msg.Conversation.Student?.Id === currentUserId ? msg.Conversation.Teacher?.Id : msg.Conversation.Student?.Id)
        };
      }
      grouped[conversationId].count++;
    });

    const groups = Object.values(grouped);
    const totalCount = groups.reduce((sum, group) => sum + group.count, 0);

    if (totalCount > 0) {
      badge.textContent = totalCount;
      badge.classList.remove("hidden");
    } else {
      badge.classList.add("hidden");
    }

    dropdown.innerHTML = '';

    if (groups.length === 0) {
      dropdown.innerHTML = '<div class="notification-item">Geen nieuwe meldingen</div>';
    } else {
      groups.forEach(group => {
        const item = document.createElement("div");
        item.className = "notification-item";
        item.textContent = `${group.count} nieuwe berichten in gesprek met ${group.otherUserName}`;

        item.addEventListener('click', async () => {
          dropdown.classList.add("hidden");
          sessionStorage.setItem('lom_conversationId', group.conversationId);
          sessionStorage.setItem('lom_userId', group.userId);
          window.location.hash = "#beheerder-feedback";
          let body = {
            UserId: currentUserId,
            ConversationId: group.conversationId
          }
          await markNotificationsAsRead(body);
          await this.initializeNotifications();
        });

        dropdown.appendChild(item);
      });

    }
  }
  setupNotificationHandlers() {
    const bell = this.querySelector("#notification-bell");
    const dropdown = this.querySelector("#notification-dropdown");

    bell.addEventListener("click", (event) => {
      dropdown.classList.toggle("hidden");
      event.stopPropagation();
    });

    document.addEventListener("click", () => {
      dropdown.classList.add("hidden");
    });

    dropdown.addEventListener("click", (event) => {
      event.stopPropagation();
    });
  }

}

customElements.define("lom-header", Header);

const roleTranslations = {
  "Administrator": "Beheerder",
  "Teacher": "Docent",
  "Student": "Student",
  "Developer": "Ontwikkelaar"
};