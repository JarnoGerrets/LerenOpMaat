const BASE = "http://localhost:5073";
const API_BASE = `${BASE}/api`;


export function getLoginUrl() {
  return `${BASE}/authenticate`;
}

export async function logout() {
  try {
    await fetch(`${BASE}/authenticate/logout`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Accept": "application/json"
      }
    });

    localStorage.removeItem("userData");
    location.reload();

  } catch { }
}

export async function getUserData() {
  try {
    const res = await fetch(`${API_BASE}/account`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Accept": "application/json"
      }
    });

    const userData = await res.json();
    localStorage.setItem("userData", JSON.stringify(userData));

    return userData;
  } catch {
    return null;
  }
}


export async function getModules(q) {
  const res = await fetch(`${API_BASE}/Module?q=${q || ''}`, {
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

export async function getActiveModules(q) {
  const res = await fetch(`${API_BASE}/Module/Active?q=${q || ''}`, {
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

export async function updateModule(id, moduleData) {
  const res = await fetch(`${API_BASE}/Module/${id}`, {
    method: "PUT",
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

export async function addModule(moduleData) {
  const res = await fetch(`${API_BASE}/Module`, {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(moduleData)
  });

  if (!res.ok) {
    throw new Error(`Failed to save module: ${res.status}`);
  }

  return res.json();
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


export async function getModuleProgress(id) {
  const res = await fetch(`${API_BASE}/Module/${id}/progress`, {
    method: "GET",
    headers: {
      "Accept": "application/json"
    }
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch progress: ${res.status}`);
  }
  if (res.status === 204) {
    return null;
  }
  return await res.json();

}

export async function addCompletedEvl(id, evlId) {
  const res = await fetch(`${API_BASE}/Module/${id}/addcompletedevl`, {
    method: 'POST',
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(evlId),
    credentials: "include"
  });

  if (!res.ok) {
    throw new Error(`Failed to update progress: ${res.status}`);
  }

  return await res.json();

}

export async function removeCompletedEvl(id, evlId) {
  const res = await fetch(`${API_BASE}/Module/${id}/removecompletedevl/${evlId}`, {
    method: 'DELETE',
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json"
    },
    credentials: "include"
  });
  if (!res.ok) {
    throw new Error(`Failed to update progress: ${res.status}`);
  }

  return await res.json();
}


//------------------------------------------------------------------------------------------------------------------------------------------------------------------//

export async function getRequirement(id) {
  const res = await fetch(`${API_BASE}/Requirement/${id}`, {
    method: "GET",
    headers: {
      "Accept": "text/plain"
    }
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch requirement: ${res.status}`);
  }

  return await res.json();
}

export async function postRequirement(requirement) {
  const res = await fetch(`${API_BASE}/Requirement`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "text/plain"
    },
    body: JSON.stringify(requirement)
  });

  if (!res.ok) {
    throw new Error(`Failed to post requirement: ${res.status}`);
  }

  return;
}

export async function deleteRequirement(id) {
  const res = await fetch(`${API_BASE}/Requirement/${id}`, {
    method: "DELETE",
    headers: {
      "Accept": "text/plain"
    }
  });

  if (!res.ok) {
    throw new Error(`Failed to delete requirement: ${res.status}`);
  }

  return res.text();
}

export async function updateRequirement(id, requirement) {
  const res = await fetch(`${API_BASE}/Requirement/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Accept": "text/plain"
    },
    body: JSON.stringify(requirement)
  });
  if (!res.ok) {
    const errorText = await res.text();
    console.error("Server error response:", errorText);
    throw new Error(`Failed to update requirement: ${res.status}`);
  }

  return;
}

export async function getRequirementTypes() {
  const res = await fetch(`${API_BASE}/Requirement/types`, {
    method: "GET",
    headers: {
      "Accept": "text/plain"
    }
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch requirement types: ${res.status}`);
  }

  return await res.json();
}

//------------------------------------------------------------------------------------------------------------------------------------------------------------------//
export async function getProfiles(q) {
  const res = await fetch(`${API_BASE}/GraduateProfile?q=${q || ''}`, {
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

export async function getProfile(id) {
  const res = await fetch(`${API_BASE}/GraduateProfile/${id}`, {
    method: "GET",
    headers: {
      "Accept": "text/plain"
    }
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch profile: ${res.status}`);
  }

  return await res.json();
}

//------------------------------------------------------------------------------------------------------------------------------------------------------------------//
export async function validateRoute(learningRoute) {
  const res = await fetch(`${API_BASE}/LearningRoute/ValidateRoute`, {
    method: "Post",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(learningRoute)
  });


  if (!res.ok) {
    let errorMessage;
    try {
      const errorData = await res.json();
      errorMessage = errorData.message || JSON.stringify(errorData);
    } catch {
      errorMessage = await res.text();
    }

    throw new Error(`Failed to validate learning route: ${res.status} - ${errorMessage}`);
  }
  return await res.json();
}
export async function getLearningRoutesByUserId(id) {
  const res = await fetch(`${API_BASE}/LearningRoute/User/${id}`, {
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
  const res = await fetch(`${API_BASE}/LearningRoute`, {
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

export async function deleteRoute(learningRouteId) {
  const res = await fetch(`${API_BASE}/LearningRoute/${learningRouteId}`, {
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

//------------------------------------------------------------------------------------------------------------------------------------------------------------------//

export async function updateSemester(learningRouteId, semesterData) {
  const res = await fetch(`${API_BASE}/Semester/updateSemesters/${learningRouteId}`, {
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
//------------------------------------------------------------------------------------------------------------------------------------------------------------------//

export async function getConversationByUserId(userId) {
  const res = await fetch(`${API_BASE}/Conversations/conversationByStudentId/${userId}`, {
    method: "GET",
    headers: {
      "Accept": "application/json"
    }
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch conversation: ${res.status}`);
  }

  return await res.json();
}

export async function updateConversation(id, conversationData) {
  const res = await fetch(`${API_BASE}/Conversations/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(conversationData)
  });

  if (!res.ok) {
    throw new Error(`Failed to update conversation: ${res.status}`);
  }

  const contentType = res.headers.get("Content-Type");
  if (contentType && contentType.includes("application/json")) {
    return await res.json();
  }

  throw new Error("Response bevat geen JSON");
}

export async function getAllTeachers() {
  const res = await fetch(`${API_BASE}/User/teachers`, {
    method: "GET",
    headers: {
      "Accept": "application/json"
    }
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch teachers: ${res.status}`);
  }

  return await res.json();
}

export async function postConversation(body) {
  const res = await fetch(`${API_BASE}/Conversations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    throw new Error(`Failed to post conversation: ${res.status}`);
  }

  return await res.json();
}

export async function getMessagesByConversationId(conversationId) {
  const res = await fetch(`${API_BASE}/Messages/messagesByConversationId/${conversationId}`, {
    method: "GET",
    headers: {
      "Accept": "application/json"
    }
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch messages: ${res.status}`);
  }

  return await res.json();
}

export async function postMessage(messageBody) {
  const res = await fetch(`${API_BASE}/Messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(messageBody)
  });
  if (!res.ok) {
    throw new Error(`Failed to post message: ${res.status}`);
  }
  return await res.json();
}

//------------------------------------------------------------------------------------------------------------------------------------------------------------------//

export async function getStartYear(id) {
  try {
    const response = await fetch(`${API_BASE}/User/startyear/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
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
      headers: {
        'Content-Type': 'application/json'
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

export async function uploadOerPdf(file, userId) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("userId", userId);

  const res = await fetch(`${API_BASE}/Oer/upload`, {
    method: "POST",
    body: formData
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Upload mislukt: ${errorText}`);
  }

  return await res.json();
}

export async function getCurrentOerPdf() {
  const res = await fetch(`${API_BASE}/Oer/current`, {
    method: "GET"
  });

  if (!res.ok) {
    throw new Error(`Ophalen OER mislukt: ${res.status}`);
  }

  return await res.blob();
}