const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const geoService = {
  async getRegions() {
    const res = await fetch(`${API_URL}/regions`);
    const rawData = await res.json();
    const regions = rawData.map(r => ({ region: r.adm1_name1 }));
    console.log("Regions chargées:", regions);
    return regions;
  },

  async getDepartements(region) {
    const url = region ? `${API_URL}/departements/${region}` : `${API_URL}/departements`;
    const res = await fetch(url);
    return await res.json();
  },

  async getCommunes(deptId) {
    const url = deptId ? `${API_URL}/communes/${deptId}` : `${API_URL}/communes`;
    const res = await fetch(url);
    return await res.json();
  }
};