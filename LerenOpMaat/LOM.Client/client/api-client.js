const API_BASE = "https://localhost:7024/api";

export async function getModules() {
    const res = await fetch(`${API_BASE}/Module`, {
        method: "GET",
        headers: {
            "Accept": "text/plain"
        }
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch modules: ${res.status}`);
    }

    return await res.json();
}

export async function getLearningRoutesByUserId(id) {
    const res = await fetch(`${API_BASE}/learningRoutes/User/${id}`, {
        method: "GET",
        headers: {
            "Accept": "text/plain"
        }
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch learning routes: ${res.status}`);
    }

    return await res.json();
}

export async function postLearningRoute(learningRoute) {
    const res = await fetch(`${API_BASE}/learningRoutes`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "text/plain"
        },
        body: JSON.stringify(learningRoute)
    });

    if (!res.ok) {
        throw new Error(`Failed to post learning route: ${res.status}`);
    }

    return;
}