const BASE = "http://localhost:5073";
const API_BASE = `${BASE}/api`;

/**
 * LerenOpMaat fetch methode met alle standaard opties ingesteld.
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Extra opties (Zie fetch(); )
 * @param {string} [options.method='GET'] - HTTP methode
 * @param {Object} [options.body] - Request body
 * @param {Object} [options.headers={}] - Optionele extra headers
 * @param {boolean} [options.credentials=true] - Wel of geen credentials meesturen, standaard aan
 * @returns {Promise<any>} De response data
 * @throws {Error} Als de request mislukt
 */
const lerenOpMaatApiFetch = async (endpoint, options = {}) => {
    const {
        method = 'GET',
        body,
        headers = {},
        credentials = true,
    } = options;

    // For non-GET requests, fetch CSRF token first
    if (method !== 'GET') {
        await getCsrfToken();
    }

    const defaultHeaders = {
        'Accept': 'application/json',
        ...(body && {'Content-Type': 'application/json'}),
        ...headers
    };

    const fetchOptions = {
        method,
        headers: defaultHeaders,
        ...(credentials && {credentials: 'include'}),
        ...(body && {body: JSON.stringify(body)})
    };

    const response = await fetch(`${API_BASE}${endpoint}`, fetchOptions);

    if (!response.ok) {
        let errorMessage;
        try {
            const errorData = await response.json();
            errorMessage = errorData.message || JSON.stringify(errorData);
        } catch {
            errorMessage = await response.text();
        }
        throw new Error(`Request failed: ${response.status} - ${errorMessage}`);
    }

    // Handle empty responses
    if (response.status === 204) {
        return null;
    }

    return await response.json();
};

//region Authenticatie
/**
 * Haalt de login URL op voor authenticatie
 * @returns {string} De login URL met gecodeerde return URL
 */
export function getLoginUrl() {
    const returnUrl = encodeURIComponent(window.location.href);
    return `${BASE}/authenticate?returnUrl=${returnUrl}`;
}

/**
 * Logt de huidige gebruiker uit en verwijdert sessiegegevens
 * @returns {Promise<void>}
 */
const logout = async () => {
    await lerenOpMaatApiFetch('/authenticate/logout', {
        method: 'GET',
    });

    document.cookie = "userData=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; secure; samesite=strict";
    localStorage.removeItem("cohortYear");
    location.reload();
}
//endregion Authenticatie

//region CSRF Token logica
/**
 * Haalt het CSRF-token op van de server en slaat het op in cookies
 * @returns {Promise<string>} De CSRF-token
 * @throws {Error} Als de CSRF-token niet gegenereerd en/of gevonden kan worden
 */
export const getCsrfToken = async () => {
    await fetch(BASE + '/api/csrf-token', {
        credentials: 'include'
    });

    const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
    if (!match) {
        throw new Error('CSRF token not found');
    }

    return decodeURIComponent(match[1]);
}
//endregion CSRF Token logica

//region Api - Account
/**
 * Haalt gebruiker account informatie op
 * @returns {Promise<*>} De account informatie
 * @throws {Error} Als de gebruiker niet is ingelogd
 */
export const getUserData = async () => {
    const loggedIn = await isLoggedIn();
    if (!loggedIn) {
        throw new Error('Gebruiker is niet ingelogt');
    }

    return await lerenOpMaatApiFetch('/account');
}

/**
 * Haalt student informatie op via hun ID
 * @param {string} id - Het student ID
 * @returns {Promise<Object>} De student informatie
 * @throws {Error} Als de student niet kan worden opgehaald
 */
export const getStudent = async (id) => {
    return await lerenOpMaatApiFetch(`/account/getstudent/${id}`);
}

/**
 * Haalt alle beschikbare rollen in het systeem op
 * @returns {Promise<Array<string>|null>} Array van rollen of null bij een fout
 */
export const getAllRoles = async () => {
    return await lerenOpMaatApiFetch('/account/roles');
}
//endregion Api - Account

//region Api - Roles
/**
 * Controleert of de huidige gebruiker een specifieke rol heeft
 * @param {string} role - De rol om te controleren
 * @returns {Promise<boolean>} Of de gebruiker de opgegeven rol heeft
 * @throws {Error} Als de gebruiker niet is ingelogd of als er een 4xx status code is
 */
export const hasPermission = async role => {
    const loggedIn = await isLoggedIn();
    if (!loggedIn) {
        throw new Error('Gebruiker is niet ingelogt');
    }

    return await lerenOpMaatApiFetch(`/roles/${role}`);
}

/**
 * Haalt de effectieve rol van de huidige gebruiker op
 * @returns {Promise<string>} De effectieve rol
 * @throws {Error} Als er een fout optreedt bij het ophalen van de rol
 */
export const getEffectiveRole = async () => {
    return await lerenOpMaatApiFetch('/roles/effective-role');
}

/**
 * Stelt de effectieve rol in voor de huidige gebruiker
 * @param {string} role - De rol om in te stellen als effectief
 * @returns {Promise<boolean>} Of het gelukt is
 */
export const setEffectiveRole = async (role) => {
    const loggedIn = await isLoggedIn();
    if (!loggedIn) {
        throw new Error('Gebruiker is niet ingelogt');
    }

    return await lerenOpMaatApiFetch('/roles/effective-role', {
        method: 'POST',
        body: role
    });
}
//endregion Api - Roles

//region Api - Modules
/**
 * Haalt modules op met een optioneel filter
 * @param {string} [q] - Optioneel filter
 * @returns {Promise<Array>} Array van modules
 * @throws {Error} Als modules niet kunnen worden opgehaald
 */
export const getModules = async (q) => {
    return await lerenOpMaatApiFetch(`/Module?q=${q || ''}`);
}

/**
 * Haalt actieve modules op met een optioneel filter
 * @param {string} [q] - Optioneel filter
 * @returns {Promise<Array>} Array van actieve modules
 * @throws {Error} Als modules niet kunnen worden opgehaald
 */
export const getActiveModules = async (q) => {
    return await lerenOpMaatApiFetch(`/Module/Active?q=${q || ''}`);
}

/**
 * Haalt een specifieke module op via ID
 * @param {string} id - Het module ID
 * @returns {Promise<Object>} De module informatie
 * @throws {Error} Als de module niet kan worden opgehaald
 */
export const getModule = async (id) => {
    return await lerenOpMaatApiFetch(`/Module/${id}`);
}

/**
 * Werkt een bestaande module bij
 * @param {Object} module - De modulegegevens om bij te werken
 * @returns {Promise<void>}
 * @throws {Error} Als de module niet kan worden bijgewerkt
 */
export const updateModule = async (module) => {
    const loggedIn = await isLoggedIn();
    if (!loggedIn) {
        throw new Error('Gebruiker is niet ingelogt');
    }

    return await lerenOpMaatApiFetch(`/Module/${module.Id}`, {
        method: 'PUT',
        body: module
    });
}

/**
 * Voegt een nieuwe module toe
 * @param {Object} moduleData - De modulegegevens om toe te voegen
 * @returns {Promise<Object>} De aangemaakte module
 * @throws {Error} Als de module niet kan worden toegevoegd
 */
export const addModule = async (moduleData) => {
    const loggedIn = await isLoggedIn();
    if (!loggedIn) {
        throw new Error('Gebruiker is niet ingelogt');
    }

    return await lerenOpMaatApiFetch('/Module', {
        method: 'POST',
        body: moduleData
    });
}

/**
 * Controleert of een module bestaat
 * @param {string} id - Het module ID om te controleren
 * @returns {Promise<boolean>} Of de module bestaat
 * @throws {Error} Als de controle mislukt
 */
export const existenceModule = async (id) => {
    return await lerenOpMaatApiFetch(`/Module/existence/${id}`);
}

/**
 * Activeert een module
 * @param {string} id - Het module ID om te activeren
 * @returns {Promise<string>} OK
 * @throws {Error} Als de module niet kan worden geactiveerd
 */
export const activateModule = async (id) => {
    const loggedIn = await isLoggedIn();
    if (!loggedIn) {
        throw new Error('Gebruiker is niet ingelogt');
    }

    return await lerenOpMaatApiFetch(`/Module/activate/${id}`, {
        method: 'PATCH'
    });
}

/**
 * Deactiveert een module
 * @param {string} id - Het module ID om te deactiveren
 * @returns {Promise<string>} OK
 * @throws {Error} Als de module niet kan worden gedeactiveerd
 */
export const deactivateModule = async (id) => {
    const loggedIn = await isLoggedIn();
    if (!loggedIn) {
        throw new Error('Gebruiker is niet ingelogt');
    }

    return await lerenOpMaatApiFetch(`/Module/deactivate/${id}`, {
        method: 'PATCH'
    });
}

/**
 * Verwijdert een module
 * @param {string} id - Het module ID om te verwijderen
 * @returns {Promise<string>} OK
 * @throws {Error} Als de module niet kan worden verwijderd
 */
export const deleteModule = async (id) => {
    const loggedIn = await isLoggedIn();
    if (!loggedIn) {
        throw new Error('Gebruiker is niet ingelogt');
    }

    return await lerenOpMaatApiFetch(`/Module/${id}`, {
        method: 'DELETE'
    });
}

/**
 * Haalt voortgang op voor een specifieke module
 * @param {string} id - Het module ID
 * @returns {Promise<Object|null>} De module voortgang of null
 */
export const getModuleProgress = async (id) => {
    const loggedIn = await isLoggedIn();
    if (!loggedIn) {
        throw new Error('Gebruiker is niet ingelogt');
    }

    return await lerenOpMaatApiFetch(`/Module/${id}/progress`);
}

/**
 * Voegt een voltooide EVL toe aan een module
 * @param {string} id - Het module ID
 * @param {string} evlId - Het EVL ID om als voltooid te markeren
 * @returns {Promise<Object>} Bijgewerkte voortgangs informatie
 * @throws {Error} Als de update mislukt
 */
export const addCompletedEvl = async (id, evlId) => {
    const loggedIn = await isLoggedIn();
    if (!loggedIn) {
        throw new Error('Gebruiker is niet ingelogt');
    }

    return await lerenOpMaatApiFetch(`/Module/${id}/addcompletedevl`, {
        method: 'POST',
        body: evlId
    });
}

/**
 * Verwijdert een voltooide EVL uit een module
 * @param {string} id - Het module ID
 * @param {string} evlId - Het EVL ID om te verwijderen uit voltooide
 * @returns {Promise<Object>} Bijgewerkte voortgangs informatie
 * @throws {Error} Als de update mislukt
 */
export const removeCompletedEvl = async (id, evlId) => {
    const loggedIn = await isLoggedIn();
    if (!loggedIn) {
        throw new Error('Gebruiker is niet ingelogt');
    }

    return await lerenOpMaatApiFetch(`/Module/${id}/removecompletedevl/${evlId}`, {
        method: 'DELETE'
    });
}

/**
 * Haalt module engagement op
 * @param {string|null} [year] - Optioneel jaar filter
 * @param {string|null} [profile] - Optioneel profiel filter
 * @returns {Promise<Object>} De module engagement informatie
 * @throws {Error} Als module engagement niet kan worden opgehaald
 */
export const getModulesEngagement = async (year = null, profile = null) => {
    const params = [];

    if (year !== null) {
        params.push(`year=${encodeURIComponent(year)}`);
    }
    if (profile !== null) {
        params.push(`profileId=${encodeURIComponent(profile)}`);
    }

    return await lerenOpMaatApiFetch(`/Module/reporting/modules-engagement${params.length ? `?${params.join('&')}` : ''}`);
}

/**
 * Haalt beschikbare jaren op voor modules
 * @returns {Promise<Array>} Array van beschikbare jaren
 * @throws {Error} Als beschikbare jaren niet kunnen worden opgehaald
 */
export const getAvailableYears = async () => {
    return await lerenOpMaatApiFetch('/Module/reporting/available-years');
}
//endregion Api - Module

//region Api - Requirements
/**
 * Haalt een requirement op via ID
 * @param {string} id - Het requirement ID
 * @returns {Promise<Object>} De requirement informatie
 * @throws {Error} Als de requirement niet kan worden opgehaald
 */
export const getRequirement = async (id) => {
    return await lerenOpMaatApiFetch(`/Requirement/${id}`);
}

/**
 * Voeg een nieuwe requirement toe
 * @param {Object} requirement - De requirement gegevens om te plaatsen
 * @returns {Promise<void>}
 * @throws {Error} Als de requirement niet kan worden geplaatst
 */
export const postRequirement = async (requirement) => {
    const loggedIn = await isLoggedIn();
    if (!loggedIn) {
        throw new Error('Gebruiker is niet ingelogt');
    }

    return await lerenOpMaatApiFetch('/Requirement', {
        method: 'POST',
        body: requirement
    });
}

/**
 * Verwijdert een requirement via ID
 * @param {string} id - Het requirement ID
 * @returns {Promise<string>} Succesbericht
 * @throws {Error} Als de requirement niet kan worden verwijderd
 */
export const deleteRequirement = async (id) => {
    const loggedIn = await isLoggedIn();
    if (!loggedIn) {
        throw new Error('Gebruiker is niet ingelogt');
    }

    return await lerenOpMaatApiFetch(`/Requirement/${id}`, {
        method: 'DELETE'
    });
}

/**
 * Werkt een requirement bij
 * @param {string} id - Het requirement ID
 * @param {Object} requirement - De bijgewerkte requirement gegevens
 * @returns {Promise<void>}
 * @throws {Error} Als de requirement niet kan worden bijgewerkt
 */
export const updateRequirement = async (id, requirement) => {
    const loggedIn = await isLoggedIn();
    if (!loggedIn) {
        throw new Error('Gebruiker is niet ingelogt');
    }

    return await lerenOpMaatApiFetch(`/Requirement/${id}`, {
        method: 'PUT',
        body: requirement
    });
}

/**
 * Haalt requirement types op
 * @returns {Promise<Array>} Array van requirement types
 * @throws {Error} Als requirement types niet kunnen worden opgehaald
 */
export const getRequirementTypes = async () => {
    return await lerenOpMaatApiFetch('/Requirement/types');
}
//endregion Api - Requirement

//region Api - GraduateProfile
/**
 * Haalt uitstroom profielen op met een optioneel filter
 * @param {string} [q] - Optioneel filter
 * @returns {Promise<Array>} Array van uitstroom profielen
 * @throws {Error} Als uitstroom profielen niet kunnen worden opgehaald
 */
export const getProfiles = async (q) => {
    return await lerenOpMaatApiFetch(`/GraduateProfile?q=${q || ''}`);
}

/**
 * Haalt een uitstroom profiel op via ID
 * @param {string} id - Het uitstroom profiel ID
 * @returns {Promise<Object>} De uitstroom profiel informatie
 * @throws {Error} Als het uitstroom profiel niet kan worden opgehaald
 */
export const getProfile = async (id) => {
    return await lerenOpMaatApiFetch(`/GraduateProfile/${id}`);
}
//endregion Api - GraduateProfile

//region Api - LearningRoute
/**
 * Valideert een leerroute
 * @param {Object} learningRoute - De leerroute om te valideren
 * @returns {Promise<Object>} Het validatie resultaat
 * @throws {Error} Als de leerroute niet kan worden gevalideerd
 */
export const validateRoute = async (learningRoute) => {
    const loggedIn = await isLoggedIn();
    if (!loggedIn) {
        throw new Error('Gebruiker is niet ingelogt');
    }

    return await lerenOpMaatApiFetch('/LearningRoute/ValidateRoute', {
        method: 'POST',
        body: learningRoute
    });
}

/**
 * Haalt leerroutes op via huidige gebruiker ID
 * @returns {Promise<Array>} Array van leerroutes
 * @throws {Error} Als leerroutes niet kunnen worden opgehaald
 */
export const getLearningRoutesByUserId = async () => {
    const loggedIn = await isLoggedIn();
    if (!loggedIn) {
        throw new Error('Gebruiker is niet ingelogt');
    }

    return await lerenOpMaatApiFetch('/LearningRoute/User');
}

/**
 * Voeg een nieuwe leerroute toe
 * @param {Object} learningRoute - De leerroute gegevens
 * @returns {Promise<Object>} De aangemaakte leerroute
 * @throws {Error} Als de leerroute niet kan worden toegevoegd
 */
export const postLearningRoute = async (learningRoute) => {
    return await lerenOpMaatApiFetch('/learningRoute', {
        method: 'POST',
        body: learningRoute
    });
}

/**
 * Verwijdert een leerroute via ID
 * @param {string} learningRouteId - Het leerroute ID om te verwijderen
 * @returns {Promise<boolean>} Of de leerroute is verwijderd
 * @throws {Error} Als de leerroute niet kan worden verwijderd
 */
export const deleteRoute = async (learningRouteId) => {
    const loggedIn = await isLoggedIn();
    if (!loggedIn) {
        throw new Error('Gebruiker is niet ingelogt');
    }

    return await lerenOpMaatApiFetch(`/LearningRoute/${learningRouteId}`, {
        method: 'DELETE'
    });
}
//endregion Api - LearningRoute

//region Api - Semester
/**
 * Werkt een semester bij
 * @param {string} learningRouteId - Het leerroute ID
 * @param {Object} semesterData - De semester gegevens om bij te werken
 * @returns {Promise<Object>} De bijgewerkte semester informatie
 * @throws {Error} Als het semester niet kan worden bijgewerkt
 */
export const updateSemester = async (learningRouteId, semesterData) => {
    const loggedIn = await isLoggedIn();
    if (!loggedIn) {
        throw new Error('Gebruiker is niet ingelogt');
    }

    return await lerenOpMaatApiFetch(`/Semester/updateSemesters/${learningRouteId}`, {
        method: 'PUT',
        body: semesterData
    });
}

/**
 * Werkt een gesloten semester bij
 * @param {Object} semesterData - De semester gegevens om bij te werken
 * @returns {Promise<boolean>} Of het semester is bijgewerkt
 * @throws {Error} Als het semester niet kan worden bijgewerkt
 */
export const updateLockedSemester = async (semesterData) => {
    const loggedIn = await isLoggedIn();
    if (!loggedIn) {
        throw new Error('Gebruiker is niet ingelogt');
    }

    return await lerenOpMaatApiFetch('/Semester/updatedlockedsemester', {
        method: 'PATCH',
        body: semesterData
    });
}
//endregion Api - LearningRoute

//region Api - Conversation
/**
 * Haalt een gesprek op via huidige gebruiker ID
 * @param {string} [id] - Het gebruiker ID
 * @returns {Promise<Object|null>} De feedback of null
 * @throws {Error} Als het gesprek niet kan worden opgehaald
 */
export const getConversationByUserId = async (id) => {
    const loggedIn = await isLoggedIn();
    if (!loggedIn) {
        throw new Error('Gebruiker is niet ingelogt');
    }

    return await lerenOpMaatApiFetch(`/Conversation/conversationByStudentId/${id}`);
}

/**
 * Werkt een gesprek bij
 * @param {string} id - Het gesprek-ID
 * @param {Object} conversationData - De gespreksgegevens om bij te werken
 * @returns {Promise<Object>} De bijgewerkte gespreksinformatie
 * @throws {Error} Als het gesprek niet kan worden bijgewerkt
 */
export const updateConversation = async (id, conversationData) => {
    const loggedIn = await isLoggedIn();
    if (!loggedIn) {
        throw new Error('Gebruiker is niet ingelogt');
    }

    return await lerenOpMaatApiFetch(`/Conversation/${id}`, {
        method: 'PUT',
        body: conversationData
    });
}

/**
 * Plaatst een nieuw gesprek
 * @param {Object} body - De gespreksgegevens om te plaatsen
 * @returns {Promise<Object>} De aangemaakte gespreksinformatie
 * @throws {Error} Als het gesprek niet kan worden geplaatst
 */
export const postConversation = async (body) => {
    const loggedIn = await isLoggedIn();
    if (!loggedIn) {
        throw new Error('Gebruiker is niet ingelogt');
    }

    return await lerenOpMaatApiFetch('/Conversation', {
        method: 'POST',
        body
    });
}

/**
 * Haalt een gesprek op via administrator gebruikers ID
 * @returns {Promise<Object>} De gespreks informatie
 * @throws {Error} Als het gesprek niet kan worden opgehaald
 */
export const getConversationByAdminId = async () => {
    const loggedIn = await isLoggedIn();
    if (!loggedIn) {
        throw new Error('Gebruiker is niet ingelogt');
    }

    return await lerenOpMaatApiFetch('/Conversation/conversationByAdministratorId');
}

/**
 * Haalt notificaties op voor een actieve gebruiker
 * @returns {Promise<Array>} Array van meldingen
 * @throws {Error} Als meldingen niet kunnen worden opgehaald
 */
export const getNotificationsForActiveUser = async () => {
    const loggedIn = await isLoggedIn();
    if (!loggedIn) {
        throw new Error('Gebruiker is niet ingelogt');
    }

    return await lerenOpMaatApiFetch('/Conversation/notifications');
}

/**
 * Markeert notificatie als gelezen
 * @param {Object} body - De notificatie
 * @returns {Promise<void>}
 * @throws {Error} Als meldingen niet als gelezen kunnen worden gemarkeerd
 */
export const markNotificationsAsRead = async (body) => {
    const loggedIn = await isLoggedIn();
    if (!loggedIn) {
        throw new Error('Gebruiker is niet ingelogt');
    }

    return await lerenOpMaatApiFetch('/Conversation/notifications/markasread', {
        method: 'PATCH',
        body
    });
}
//endregion Api - Conversation

//region Api - Message
/**
 * Haalt berichten op via gesprek ID
 * @param {string} conversationId - Het gesprek ID
 * @returns {Promise<Array>} Array van berichten
 * @throws {Error} Als berichten niet kunnen worden opgehaald
 */
export const getMessagesByConversationId = async (conversationId) => {
    const loggedIn = await isLoggedIn();
    if (!loggedIn) {
        throw new Error('Gebruiker is niet ingelogt');
    }

    return await lerenOpMaatApiFetch(`/Message/messagesByConversationId/${conversationId}`);
}

/**
 * Plaatst een nieuw bericht
 * @param {Object} messageBody - De bericht gegevens om te plaatsen
 * @returns {Promise<Object>} De aangemaakte bericht informatie
 * @throws {Error} Als het bericht niet kan worden geplaatst
 */
export const postMessage = async (messageBody) => {
    const loggedIn = await isLoggedIn();
    if (!loggedIn) {
        throw new Error('Gebruiker is niet ingelogt');
    }

    return await lerenOpMaatApiFetch('/Message', {
        method: 'POST',
        body: messageBody
    });
}
//endregion Api - Message

//region Api - User
/**
 * Haalt alle docenten op
 * @returns {Promise<Array>} Array van docenten
 * @throws {Error} Als docenten niet kunnen worden opgehaald
 */
export const getAllTeachers = async () => {
    return await lerenOpMaatApiFetch('/User/teachers');
}

/**
 * Haalt het startjaar van de huidige gebruiker op
 * @returns {Promise<number|null>} Het startjaar of null indien niet beschikbaar
 * @throws {Error} Als het startjaar niet kan worden opgehaald
 */
export const getStartYear = async () => {
    const loggedIn = await isLoggedIn();
    if (!loggedIn) {
        throw new Error('Gebruiker is niet ingelogt');
    }

    return await lerenOpMaatApiFetch('/User/startyear');
}

/**
 * Stelt het startjaar in voor de huidige gebruiker
 * @param {number} startYear - Het startjaar om in te stellen
 * @returns {Promise<void>}
 * @throws {Error} Als het startjaar niet kan worden ingesteld
 */
export const setStartYear = async (startYear) => {
    const loggedIn = await isLoggedIn();
    if (!loggedIn) {
        throw new Error('Gebruiker is niet ingelogt');
    }

    return await lerenOpMaatApiFetch('/User/startyear', {
        method: 'POST',
        body: startYear
    });
}
//endregion Api - User

//region Api - Oer
/**
 * Uploadt een OER PDF
 * @param {File} file - Het OER bestand om te uploaden
 * @param {string} userId - Het gebruikers ID geassocieerd met het bestand
 * @returns {Promise<Object>} De geüploade bestandsinformatie
 * @throws {Error} Als de upload mislukt
 */
export const uploadOerPdf = async (file, userId) => {
    const loggedIn = await isLoggedIn();
    if (!loggedIn) {
        throw new Error('Gebruiker is niet ingelogt');
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", userId);

    const response = await fetch(`${API_BASE}/Oer/upload`, {
        method: "PUT",
        body: formData
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Upload mislukt: ${errorText}`);
    }

    return await response.json();
}

/**
 * Haalt de huidige OER PDF op
 * @returns {Promise<Blob>} Het huidige OER PDF
 * @throws {Error} Als het bestand niet kan worden opgehaald
 */
export const getCurrentOerPdf = async () => {
    return (await fetch(`${API_BASE}/Oer/current`, {
        method: "GET"
    })).blob();
}
//endregion Api - Oer

async function isLoggedIn() {
    const response = await fetch(`${API_BASE}/status`, {
        credentials: "include",
        headers: {"Accept": "application/json"}
    });
    const json = await response.json();

    return (json.IsAuthenticated);
}
