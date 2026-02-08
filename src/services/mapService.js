const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const mapService = {
  // Récupère la couche géo avec les couleurs d'intensité
  async getCameroun() {
    const res = await fetch(`${API_URL}/carte/cameroun`);
    return await res.json();
  },

  async getCoucheGeo(filters) {
    console.log(filters)
    const params = new URLSearchParams();
    if (filters.dept_id) params.append('dept', filters.dept_id);
    if (filters.region_id) params.append('region', filters.region_id);
    if (filters.filiere_id) params.append('filiere', filters.filiere_id);
    if (filters.annee) params.append('annee', filters.annee);

    const res = await fetch(`${API_URL}/carte/couche-geo?${params.toString()}`);
    return await res.json();
  },

  async getZoneGeo(zone, level) {
    const res = await fetch(`${API_URL}/carte/couche-geo/${zone}?level=${level}`);
    return await res.json();
  },

  // Recherche textuelle de commune
  async searchCommune(query) {
    const res = await fetch(`${API_URL}/carte/recherche-commune?q=${query}`);
    return await res.json();
  },

  async getPancarteDetails(communeName, filters) {
    if (!communeName) return null;
    
    const annee = filters.annee;
    const filiere = filters.filiere_id || 'Agriculture';
    
    // On utilise encodeURIComponent car les noms peuvent avoir des espaces/accents
    const url = `${API_URL}/carte/pancarte-details/${encodeURIComponent(communeName)}?filiere=${encodeURIComponent(filiere)}&annee=${annee}`;
    
    try {
      const res = await fetch(url);
      if (!res.ok) return null;
      return await res.json();
    } catch (error) {
      console.error("Erreur Pancarte:", error);
      return null;
    }
  },
  
};