import { getUserData, getEffectiveRole } from '../../client/api-client.js';

export let userData;

function base64Encode(str) {
    return btoa(unescape(encodeURIComponent(str)));
}

function base64Decode(str) {
    return decodeURIComponent(escape(atob(str)));
}

export function setUserDataCookie(value) {
    // Store userData in a cookie that expires after 20 minutes (not HTTP-only, as JS cannot set HTTP-only)
    const expires = new Date(Date.now() + 20 * 60 * 1000).toUTCString();
    const encoded = base64Encode(JSON.stringify(value));
    document.cookie = `userData=${encoded}; expires=${expires}; path=/; secure; samesite=strict`;
}

export function getUserDataCookie() {
    const match = document.cookie.match(/(?:^|;\s*)userData=([^;]*)/);
    if (match) {
        try {
            return JSON.parse(base64Decode(match[1]));
        } catch {
            return null;
        }
    }
    return null;
}


const storedUserData = getUserDataCookie();

async function resolveUserData() {
    let baseData;

    if (storedUserData) {
        try {
            baseData = JSON.parse(storedUserData);
        } catch {
            baseData = null;
        }
    }

    if (!baseData) {
        baseData = await getUserData();
        if (baseData) {
            setUserDataCookie(baseData)
        }
    }

    if (!baseData) {
        return null;
    }

    const simulatedRole = await getEffectiveRole();
    if (simulatedRole) {
        baseData.EffectiveRole = simulatedRole;
    } else {
        baseData.EffectiveRole = baseData?.Roles?.[0] ?? null;
    }

    return baseData;
}

userData = resolveUserData();
window.userData = userData;
