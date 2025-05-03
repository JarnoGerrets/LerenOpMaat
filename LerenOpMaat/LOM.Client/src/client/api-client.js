const API_BASE = "https://api.robhutten.nl/api";

export async function getModules(q) {
  const res = await fetch(`${API_BASE}/Module?q=${q||''}`, {
    method: "GET",
    credentials: 'include',
    headers: {
      "Accept": "application/json"
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
        credentials: 'include',
        headers: {
            "Accept": "application/json"
        }
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch modules: ${res.status}`);
    }

    return await res.json();
}

export async function updateModule(id, moduleData) {
    const res = await fetch(`${API_BASE}/Module/${id}`, {
        method: "PUT",
        credentials: 'include',
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(moduleData)
    });

    if (!res.ok) {
        throw new Error(`Failed to update module: ${res.status}`);
    }

    return;
}

export async function deleteModule(id) {
    const res = await fetch(`${API_BASE}/Module/${id}`, {
        method: "DELETE",
        credentials: 'include',
        headers: {
            "Accept": "application/json"
        }
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch modules: ${res.status}`);
    }

    return res.text();
}

export async function getLearningRoutesByUserId(id) {
  const res = await fetch(`${API_BASE}/LearningRoute/User/${id}`, {
    method: "GET",
    credentials: 'include',
    headers: {
      "Accept": "application/json"
    }
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch learning routes: ${res.status}`);
  }

  return await res.json();
}

export async function postLearningRoute(learningRoute) {
  const res = await fetch(`${API_BASE}/LearningRoute`, {
    method: "POST",
    credentials: 'include',
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(learningRoute)
  });

  if (!res.ok) {
    throw new Error(`Failed to post learning route: ${res.status}`);
  }

  return;
}

export async function updateSemester(learningRouteId, semesterData) {
  const res = await fetch(`${API_BASE}/Semester/UpdateSemesters/${learningRouteId}`, {
    method: "PUT",
    credentials: 'include',
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(semesterData)
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Server error response:", errorText);
    throw new Error(`Failed to update semester: ${res.status}`);
  }

  if (res.headers.get("Content-Type")?.includes("application/json")) {
    return await res.json();
  } else {
    console.warn("Response bevat geen JSON, retourneer een standaardwaarde.");
    return { message: "Semesters updated successfully (geen JSON)" };
  }
}

export async function deleteRoute(learningRouteId) {
  const res = await fetch(`${API_BASE}/LearningRoute/${learningRouteId}`, {
    method: "DELETE",
    credentials: 'include',
    headers: {
      "Accept": "application/json"
    }
  });

  if (!res.ok) {
    throw new Error(`Failed to delete learning route: ${res.status}`);
  }

  return res.ok;
}

export async function getStartYear(id) {
  try {
    const response = await fetch(`${API_BASE}/User/startyear/${id}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Startjaar niet gevonden.');
    }

    const startYear = await response.json();
    return startYear;
  } catch (error) {
    console.error('Fout bij ophalen startjaar:', error);
    return null;
  }
}

export async function setStartYear(id, startYear) {
  try {
    const response = await fetch(`${API_BASE}/User/startyear/${id}`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(startYear)
    });

    if (!response.ok) {
      throw new Error('Opslaan mislukt.');
    }
  } catch (error) {
    console.error('Fout bij opslaan startjaar:', error);
  }
}