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

export async function getModule(id) {
    const res = await fetch(`${API_BASE}/Module/${id}`, {
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

export async function deleteModule(id) {
    const res = await fetch(`${API_BASE}/Module/${id}`, {
        method: "DELETE",
        headers: {
            "Accept": "text/plain"
        }
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch modules: ${res.status}`);
    }

    return res.text();
    
}