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