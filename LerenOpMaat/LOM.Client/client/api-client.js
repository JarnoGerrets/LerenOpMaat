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

export async function updateSemester(learningRouteId, semesterData) {
    const res = await fetch(`${API_BASE}/Semesters/updateSemesters/${learningRouteId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(semesterData) // Verstuur de array van semesters
    });

    if (!res.ok) {
        const errorText = await res.text();
        console.error("Server error response:", errorText);
        throw new Error(`Failed to update semester: ${res.status}`);
    }

    // Controleer of de response JSON bevat
    if (res.headers.get("Content-Type")?.includes("application/json")) {
        return await res.json();
    } else {
        console.warn("Response bevat geen JSON, retourneer een standaardwaarde.");
        return { message: "Semesters updated successfully (geen JSON)" }; // Standaardwaarde
    }
}

export async function deleteRoute(learningRouteId) {
    const res = await fetch(`${API_BASE}/learningRoutes/${learningRouteId}`, {
        method: "DELETE",
        headers: {
            "Accept": "application/json"
        }
    });

    if (!res.ok) {
        throw new Error(`Failed to delete learning route: ${res.status}`);
    }

    return res.ok; // Return true if the request was successful
}
