const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const statsService = {
  async getGlobalStats(filters) {
    const params = new URLSearchParams();
    params.append('annee', filters.annee);
    params.append('filiere', filters.filiere_id); // Nom de la filière
    
    if (filters.region_id) params.append('region', filters.region_id);
    if (filters.dept_id) params.append('dept', filters.dept_id);

    const res = await fetch(`${API_URL}/stats/global?${params.toString()}`);
    if (!res.ok) return null;
    return await res.json();
  }
};