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