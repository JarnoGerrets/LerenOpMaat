export async function getStartYear(id) {
    try {
      const response = await fetch(`/api/Users/startyear/${id}`, {
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
      const response = await fetch(`/api/Users/startyear/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(startYear)
      });
  
      if (!response.ok) {
        throw new Error('Opslaan mislukt.');
      }
  
      console.log('Startjaar succesvol opgeslagen!');
    } catch (error) {
      console.error('Fout bij opslaan startjaar:', error);
    }
  }
  