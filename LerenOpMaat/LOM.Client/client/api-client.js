const BASE = "https://lerenopmaat.info";
const API_BASE = `${BASE}/api`;

export function getLoginUrl() {
  const returnUrl = encodeURIComponent(window.location.href);

  return `${BASE}/authenticate?returnUrl=${returnUrl}`;
}

export async function logout() {
  document.cookie = "userData=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; secure; samesite=strict";
  localStorage.removeItem("cohortYear");
  window.location.href = `${BASE}/authenticate/logout`;
  setTimeout(() => {
    window.location.href = "/";
  }, 1000);
}

export async function getUserData() {
  const loggedIn = await isLoggedIn();
  if (!loggedIn) {
    return null;
  }
  try {
    const res = await fetch(`${API_BASE}/account`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Accept": "application/json"
      }
    });

    const userData = await res.json();

    return userData;
  } catch {
    return null;
  }
}

export async function isLoggedIn() {
  const res = await fetch(`${API_BASE}/status`, {
    credentials: "include",
    headers: { "Accept": "application/json" }
  });
  const json = await res.json();
  if (json.IsAuthenticated) return true;
  return false;
}

export async function hasPermission(role) {
  const loggedIn = await isLoggedIn();
  if (!loggedIn) {
    return false;
  }
  try {
    const res = await fetch(`${API_BASE}/roles/${role}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Accept": "application/json"
      }
    });
    const allowed = await res.json();
    if (res.ok) {
      return allowed;
    }

    if (res.status === 403) return false;

    if (res.status === 401) return false;

    throw new Error(`Unexpected response: ${res.status}`);
  } catch (err) {
    console.error("Error while checking permission:", err);
    throw err;
  }
}

export async function getEffectiveRole() {
  try {
    const res = await fetch(`${API_BASE}/roles/effective-role`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Accept": "application/json"
      }
    });

    const role = await res.json();
    return role;
  } catch (err) {
    throw err;
  }
}

export async function setEffectiveRole(role) {
  try {
    const res = await fetch(`${API_BASE}/roles/effective-role`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(role)
    });
    if (res.ok) return true;
    return false;
  } catch (err) {
    return false;
  }
}

export async function getStudent(id) {
  const res = await fetch(`${API_BASE}/account/getstudent/${id}`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Accept": "application/json"
    }
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch student: ${res.status}`);
  }
  return res.json();
}

export async function getAllRoles() {
  try {
    const res = await fetch(`${API_BASE}/account/roles`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Accept": "application/json"
      }
    });

    const roles = await res.json();
    return roles;
  } catch {
    return null;
  }
}



export async function getModules(q) {
  const res = await fetch(`${API_BASE}/Module?q=${q || ''}`, {
    method: "GET",
    headers: {
      "Accept": "text/plain"
    },
    credentials: "include"
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
    throw new Error(`Failed to fetch module: ${res.status}`);
  }

  return await res.json();

}

export async function updateModule(module) {
  const res = await fetch(`${API_BASE}/Module/${module.Id}`, {
    method: "PUT",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json"
    },
    credentials: "include",
    body: JSON.stringify(module)
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
    credentials: "include",
    body: JSON.stringify(moduleData)
  });

  if (res.status === 409) {
    const errorBody = await res.json().catch(() => null);
    throw new Error(errorBody?.message);
  }

  if (!res.ok) {
    throw new Error(`Failed to save module: ${res.status}`);
  }

  return res.json();
}

export async function existenceModule(id) {
  const res = await fetch(`${API_BASE}/Module/existence/${id}`, {
    method: "GET",
    headers: {
      "Accept": "text/plain"
    },
    credentials: "include"
  });
  if (!res.ok) {
    throw new Error(`Failed to check module existence: ${res.status}`);
  }
  return await res.json();
}

export async function activateModule(id) {
  const res = await fetch(`${API_BASE}/Module/activate/${id}`, {
    method: "PATCH",
    headers: {
      "Accept": "text/plain"
    },
    credentials: "include"
  });

  if (!res.ok) {
    throw new Error(`Failed to activate module: ${res.status}`);
  }

  return res.text();

}

export async function deactivateModule(id) {
  const res = await fetch(`${API_BASE}/Module/deactivate/${id}`, {
    method: "PATCH",
    headers: {
      "Accept": "text/plain"
    },
    credentials: "include"
  });

  if (!res.ok) {
    throw new Error(`Failed to deactivate module: ${res.status}`);
  }

  return res.text();

}

export async function deleteModule(id) {
  const res = await fetch(`${API_BASE}/Module/${id}`, {
    method: "DELETE",
    headers: {
      "Accept": "text/plain"
    },
    credentials: "include"
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch modules: ${res.status}`);
  }

  return res.text();

}


export async function getModuleProgress(id) {
  const userData = await window.userData;
  if (!userData) return null;

  try {
    const res = await fetch(`${API_BASE}/Module/${id}/progress`, {
      method: "GET",
      headers: {
        "Accept": "application/json"
      },
      credentials: "include"
    });

    if (res.status === 401 || res.status === 403 || res.status === 204) {
      return null;
    }

    if (!res.ok) {
      throw new Error(`Failed to fetch progress: ${res.status}`);
    }

    return await res.json();

  } catch (error) {
    console.error("Fetch failed:", error);
    return null;
  }
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
    },
    credentials: "include"
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
    credentials: "include",
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
    },
    credentials: "include"
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
    credentials: "include",
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
    },
    credentials: "include"
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
    credentials: "include",
    body: JSON.stringify(learningRoute)
  });


  if (!res.ok) {
    let bodyText = await res.text();

    let errorMessage;
    try {
      const errorData = JSON.parse(bodyText);
      errorMessage = errorData.message || JSON.stringify(errorData);
    } catch {
      errorMessage = bodyText;
    }

    throw new Error(`Failed to validate learning route: ${res.status} - ${errorMessage}`);
  }
  return await res.json();
}

export async function getLearningRoutesByUserId(id = null) {
  const url = id
    ? `${API_BASE}/LearningRoute/User?userId=${id}`
    : `${API_BASE}/LearningRoute/User`;
  const res = await fetch(url, {
    method: "GET",
    credentials: "include",
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
  const res = await fetch(`${API_BASE}/learningRoute`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "text/plain"
    },
    credentials: "include",
    body: JSON.stringify(learningRoute)
  });

  if (!res.ok) {
    throw new Error(`Failed to post learning route: ${res.status}`);
  }

  return true;
}

export async function deleteRoute(learningRouteId) {

  const res = await fetch(`${API_BASE}/LearningRoute/${learningRouteId}`, {
    method: "DELETE",
    headers: {
      "Accept": "application/json",
    },
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(`Failed to delete learning route: ${res.status}`);
  }

  return res.ok;
}

//------------------------------------------------------------------------------------------------------------------------------------------------------------------//

export async function updateSemester(learningRouteId, semesterData) {
  const res = await fetch(`${API_BASE}/Semester/updateSemesters/${learningRouteId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    credentials: "include",
    body: JSON.stringify(semesterData)
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
    return { message: "Semesters updated successfully (geen JSON)" };
  }
}


export async function updateLockedSemester(semesterData) {
  const res = await fetch(`${API_BASE}/Semester/updatedlockedsemester`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(semesterData),
    credentials: "include"
  });

  if (!res.ok) {
    throw new Error(`Failed to change locked status semester: ${res.status}`);
  }

  return true;
}
//------------------------------------------------------------------------------------------------------------------------------------------------------------------//

export async function getConversationByUserId(id) {
  const userId = id || (await window.userData).InternalId;
  const res = await fetch(`${API_BASE}/Conversation/conversationByStudentId/${userId}`, {
    method: "GET",
    headers: {
      "Accept": "application/json"
    },
    credentials: "include"
  });

  if (res.status === 404) {
    return null;
  }

  if (!res.ok) {
    throw new Error(`Failed to fetch conversation: ${res.status}`);
  }

  return await res.json();
}

export async function updateConversation(id, conversationData) {

  const res = await fetch(`${API_BASE}/Conversation/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    credentials: "include",
    body: JSON.stringify(conversationData)
  });

  if (!res.ok) {
    throw new Error(`Failed to update conversation: ${res.status}`);
  }

  const contentType = res.headers.get("Content-Type");
  if (contentType && contentType.includes("application/json")) {
    return await res.json();
  }

  return;
}

export async function getAllTeachers() {
  const res = await fetch(`${API_BASE}/User/teachers`, {
    method: "GET",
    credentials: "include",
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
  const res = await fetch(`${API_BASE}/Conversation`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    credentials: "include",
    body: JSON.stringify(body)
  });
  if (!res.ok) {
    throw new Error(`Failed to post conversation: ${res.status}`);
  }
  return await res.json();
}

export async function getMessagesByConversationId(conversationId) {
  const res = await fetch(`${API_BASE}/Message/messagesByConversationId/${conversationId}`, {
    method: "GET",
    credentials: "include",
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
  const res = await fetch(`${API_BASE}/Message`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    credentials: "include",
    body: JSON.stringify(messageBody)
  });
  if (!res.ok) {
    throw new Error(`Failed to post message: ${res.status}`);
  }
  return await res.json();
}

//------------------------------------------------------------------------------------------------------------------------------------------------------------------//

export async function getStartYear() {
  try {
    const response = await fetch(`${API_BASE}/User/startyear`, {
      method: 'GET',
      credentials: "include",
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
    return null;
  }
}

export async function setStartYear(startYear) {
  try {
    const response = await fetch(`${API_BASE}/User/startyear`, {
      method: 'POST',
      credentials: "include",
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
    method: "PUT",
    credentials: "include",
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

export async function getConversationByAdminId() {
  const res = await fetch(`${API_BASE}/Conversation/conversationByAdministratorId`, {
    method: "GET",
    headers: {
      "Accept": "application/json"
    },
    credentials: "include"
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch conversation: ${res.status}`);
  }

  return await res.json();
}

export async function getNotificationsForActiveUser() {
  const res = await fetch(`${API_BASE}/Conversation/notifications`, {
    method: "GET",
    headers: {
      "Accept": "application/json"
    },
    credentials: "include"
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch notifications: ${res.status}`);
  }

  return await res.json();
}

export async function markNotificationsAsRead(body) {
  const res = await fetch(`${API_BASE}/Conversation/notifications/markasread`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    credentials: "include",
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    throw new Error(`Failed to mark notifications as read: ${res.status}`);
  }
}

export async function getModulesEngagement(year = null, profile = null) {
  let url = `${API_BASE}/Module/reporting/modules-engagement`;
  const params = [];

  if (year !== null) {
    params.push(`year=${encodeURIComponent(year)}`);
  }
  if (profile !== null) {
    params.push(`profileId=${encodeURIComponent(profile)}`);
  }
  if (params.length > 0) {
    url += `?${params.join("&")}`;
  }

  const response = await fetch(url, {
    method: "GET",
    credentials: "include"
  });
  if (!response.ok) throw new Error("Failed to fetch modules engagement");
  return await response.json();
}

export async function getAvailableYears() {
  const response = await fetch(`${API_BASE}/Module/reporting/available-years`, {
    method: "GET",
    credentials: "include"
  });
  if (!response.ok) throw new Error("Failed to fetch available years");
  return await response.json();
}
