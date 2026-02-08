const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const productService = {
  async getAnnees() {
    const res = await fetch(`${API_URL}/annees`);
    return await res.json();
  },

  async getFilieres() {
    const res = await fetch(`${API_URL}/filieres`);
    return await res.json();
  },

  async getProduits(filiere) {
    const url = filiere ? `${API_URL}/produits/${filiere}` : `${API_URL}/produits`;
    const res = await fetch(url);
    return await res.json();
  }
};