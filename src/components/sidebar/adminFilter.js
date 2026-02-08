"use client";
import { useState, useEffect } from "react";
import { geoService } from "../../services/geoService";
import { productService } from "../../services/productService";
import { useFilters } from "@/context/FilterContext";
import styles from "./filter.module.css";

export default function AdminFilter() {
  const { filters, setFilters } = useFilters();
  const [data, setData] = useState({
    regions: [],
    departements: [],
    communes: [],
    annees: [],
    filieres: [],
    produits: []
  });

  // 1. Chargement initial (Régions, Filières, Années)
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [reg, fil, ann] = await Promise.all([
          geoService.getRegions(),
          productService.getFilieres(),
          productService.getAnnees()
        ]);
        setData(prev => ({ ...prev, regions: reg, filieres: fil, annees: ann }));
      } catch (err) {
        console.error("Erreur lors du chargement initial :", err);
      }
    };
    loadInitialData();
  }, []);


  // 2. Chargement des départements selon la région
  useEffect(() => {
    const loadDepts = async () => {
      if (filters.region_id) {
        try {
          const depts = await geoService.getDepartements(filters.region_id);
          setData(prev => ({ ...prev, departements: depts, communes: [] }));
        } catch (err) {
          console.error("Erreur chargement départements:", err);
        }
      } else {
        setData(prev => ({ ...prev, departements: [], communes: [] }));
      }
    };
    loadDepts();
  }, [filters.region_id]);

  // 3. Chargement des communes selon le département
  useEffect(() => {
    const loadComs = async () => {
      if (filters.dept_id) {
        try {
          const coms = await geoService.getCommunes(filters.dept_id);
          setData(prev => ({ ...prev, communes: coms }));
        } catch (err) {
          console.error("Erreur chargement communes:", err);
        }
      } else {
        setData(prev => ({ ...prev, communes: [] }));
      }
    };
    loadComs();
  }, [filters.dept_id]);

  // 4. Chargement des produits selon la filière
  useEffect(() => {
    const loadProds = async () => {
      if (filters.filiere_id) {
        try {
          const prods = await productService.getProduits(filters.filiere_id);
          setData(prev => ({ ...prev, produits: prods }));
        } catch (err) {
          console.error("Erreur chargement produits:", err);
        }
      } else {
        setData(prev => ({ ...prev, produits: [] }));
      }
    };
    loadProds();
  }, [filters.filiere_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "region_id") setFilters({ ...filters, region_id: value, dept_id: '', commune_id: '' });
    else if (name === "dept_id") setFilters({ ...filters, dept_id: value, commune_id: '' });
    else if (name === "filiere_id") setFilters({ ...filters, filiere_id: value, produit_id: '' });
    else setFilters({ ...filters, [name]: value });
  };

  return (
    <div className={styles.filterContainer}>
      <h5 className={styles.sectionTitle}>Zone Administrative</h5>

      <div className={styles.field}>
        <label htmlFor="region">Région</label>
        <select
          id="region"
          name="region_id"
          value={filters.region_id || ""}
          onChange={handleChange}
        >
          <option value="">Toutes les régions</option>
          {data.regions.map(r => (
            <option key={r.region} value={r.region}>{r.region}</option>
          ))}
        </select>
      </div>

      <div className={`${styles.field} ${!filters.region_id ? styles.disabled : ''}`}>
        <label htmlFor="dept">Département</label>
        <select
          id="dept"
          name="dept_id"
          value={filters.dept_id || ""}
          onChange={handleChange}
          disabled={!filters.region_id}
        >
          <option value="">Sélectionner...</option>
          {data.departements.map(d => (
            <option key={d.nom} value={d.nom}>{d.nom}</option>
          ))}
        </select>
      </div>

      <div className={`${styles.field} ${!filters.dept_id ? styles.disabled : ''}`}>
        <label htmlFor="commune">Commune</label>
        <select
          id="commune"
          name="commune_id"
          value={filters.commune_id || ""}
          onChange={handleChange}
          disabled={!filters.dept_id}
        >
          <option value="">Sélectionner...</option>
          {data.communes.map(c => (
            <option key={c.adm3_pcode} value={c.nom}>{c.nom}</option>
          ))}
        </select>
      </div>

      <hr className={styles.separator} />
      <h5 className={styles.sectionTitle}>Production</h5>

      <div className={styles.field}>
        <label htmlFor="annee">Année</label>
        <select
          id="annee"
          name="annee"
          value={filters.annee || ""}
          onChange={handleChange}
        >
            <option value="">Toutes les années</option>
          {data.annees.map(a => (
            <option key={a.annee} value={a.annee}>{a.annee}</option>
          ))}
        </select>
      </div>

      <div className={styles.field}>
        <label htmlFor="filiere">Filière</label>
        <select
          id="filiere"
          name="filiere_id"
          value={filters.filiere_id || ""}
          onChange={handleChange}
        >
          <option value="">Sélectionner une filière</option>
          {data.filieres.map(f => (
            <option key={f.filiere} value={f.filiere}>{f.filiere}</option>
          ))}
        </select>
      </div>

      <div className={`${styles.field} ${!filters.filiere_id ? styles.disabled : ''}`}>
        <label htmlFor="produit">Produit</label>
        <select
          id="produit"
          name="produit_id"
          value={filters.produit_id || ""}
          onChange={handleChange}
          disabled={!filters.filiere_id}
        >
          <option value="">Tous les produits</option>
          {data.produits.map(p => (
            <option key={p.nom} value={p.nom}>{p.nom}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
