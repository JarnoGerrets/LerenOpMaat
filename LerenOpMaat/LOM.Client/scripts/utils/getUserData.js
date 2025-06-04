import { getUserData, getEffectiveRole } from '../../client/api-client.js';

export let userData;

const storedUserData = localStorage.getItem('userData');

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
            localStorage.setItem('userData', JSON.stringify(baseData));
        }
    }

    if (!baseData) {
        return null;
    }

    const simulatedRole = await getEffectiveRole();
    console.log(simulatedRole);
    if (simulatedRole) {
        baseData.EffectiveRole = simulatedRole;
    } else {
        baseData.EffectiveRole = baseData?.Roles?.[0] ?? null;
    }

    return baseData;
}

userData = resolveUserData();
window.userData = userData;
