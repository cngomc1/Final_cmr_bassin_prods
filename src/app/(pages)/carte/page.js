"use client";
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { mapService } from '@/services/mapService';
import styles from '../page.module.css';
import { useFilters } from '@/context/FilterContext';
import Pancarte from '@/components/map/pancarte';
import { toast } from 'react-hot-toast';

const Map = dynamic(() => import('@/components/map/map'), { ssr: false });

export default function CartePage() {
  const { filters } = useFilters();

  const [geoData, setGeoData] = useState(null);
  const [pancarte, setPancarte] = useState(null);

useEffect(() => {
  const loadGeoData = async () => {
    try {
      let data;
 // 1️⃣ Tous les filtres sont vides → Cameroun
      const hasGeoFilter =
        filters.region_id !== '' ||
        filters.dept_id !== '' ||
        filters.commune_id !== ''||
        filters.filiere_id !== '' ||
        filters.produit_id !== '';

      // 1️⃣ Aucun filtre géographique → Cameroun
      if (!hasGeoFilter) {
        data = await mapService.getCameroun();
      } else {
        // 2️⃣ Filtres globaux d'abord
        data = await mapService.getCoucheGeo(filters);

      }

      setGeoData(data);
      console.log("[MAP] GeoData chargé :", data);

    } catch (err) {
      console.error("Erreur lors du chargement de la carte :", err);
    }
  };

  loadGeoData();
}, [filters]);

  const handleVoirPlus = async (name) => {
    try {
      const data = await mapService.getPancarteDetails(name, filters);
      setPancarte(data);
      toast.success(`Détails chargés pour le bassin de ${name}`);
    } catch (err) {
      console.error("Erreur lors du chargement de la pancarte :", err);
      toast.error(err)
    }
  };

  return (
    <div className={styles.pageWrapper}>
      {/* Barre de recherche */}
      <div className={styles.searchBar}>
        <input
          type="text"
          placeholder="Rechercher une commune..."
          onKeyDown={async (e) => {
            if (e.key === 'Enter' && e.target.value.length > 2) {
              try {
                const results = await mapService.searchCommune(e.target.value);
                // TODO: Centrer la carte sur le résultat
                console.log("Résultats recherche :", results);
              } catch (err) {
                console.error("Erreur recherche commune :", err);
              }
            }
          }}
        />
      </div>

      {/* Composant Carte */}
      <Map
        geoData={geoData}
        onVoirPlus={handleVoirPlus}
      />

      {/* Pancarte descriptive */}
      {pancarte && (
        <Pancarte 
          data={pancarte} 
          onClose={() => setPancarte(null)} 
        />
      )}
    </div>
  );
}
