"use client";

import React, { useRef, useEffect } from 'react';
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import styles from './map.module.css';
import { MaptilerLayer } from "@maptiler/leaflet-maptilersdk";
import { GeocodingControl } from "@maptiler/geocoding-control/leaflet";
import "@maptiler/geocoding-control/style.css";

const Map = ({geoData, onVoirPlus }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const currentLayer = useRef(null);

  const center = { lat: 7.3697, lng: 12.3547 };
  const key = process.env.NEXT_PUBLIC_MAPTILER_KEY;

  // --- INITIALISATION DE LA CARTE ---
  useEffect(() => {
    if (map.current) return;

    map.current = new L.Map(mapContainer.current, {
      center: [center.lat, center.lng],
      zoom: 6,
      zoomControl: false,
    });

    new MaptilerLayer({ apiKey: key }).addTo(map.current);

    // Barre de recherche
    const gc = new GeocodingControl({ apiKey: key, position: 'topright' });
    map.current.addControl(gc);

    // Zoom en bas à droite
    L.control.zoom({ position: 'bottomright' }).addTo(map.current);
  }, [key]);

  // --- AFFICHAGE DES DONNEES DEMANDEES SUR LA CARTE (Région / Dept / Commune/ Produit/Filiere/Année) ---
  useEffect(() => {
    if (!geoData ||!map.current) return;
    displayGeoData(geoData);
    console.log("Nombre de features reçues :", geoData.features.length);

geoData.features.forEach((f, i) => {
  if (!f.geometry || !f.geometry.coordinates || f.geometry.coordinates.length === 0) {
    console.warn("Feature sans géométrie", i, f);
  }
});

  }, [geoData]); 

  // --- FONCTION D'AFFICHAGE DES GEOJSON ---
  const displayGeoData = (geojson) => {
    if (!map.current) return;

    if (currentLayer.current) {
      map.current.removeLayer(currentLayer.current);
    }

    const getFiliereColor = (filiere) => {
      switch (filiere?.toLowerCase()) {
        case 'agriculture': return "#2e7d32";
        case 'pêche': return "#0288d1";
        case 'elevage': return "#f57c00";
        default: return "gray";
      }
    };

    currentLayer.current = L.geoJSON(geojson, {
      style: (feature) => ({
        color: getFiliereColor(feature.properties.filiere),
        weight: 2,
        fillOpacity: 0.5,
        fillColor: getFiliereColor(feature.properties.filiere),
      }),
      onEachFeature: (feature, layer) => {
        const p = feature.properties;
        const popupContent = `
          <div class="${styles.popupContainer}">
            <header class="${styles.popupHeader}">
              <strong>${p.adm3_name1 || p.commune || 'Zone'}</strong>
              <small>${p.adm1_name1 || ''}</small>
            </header>
            <div class="${styles.popupBody}">
              <p><strong>Produit dominant:</strong> ${p.produit || 'N/A'}</p>
              <p><strong>Valeur de production:</strong> <span class="${styles.tonnage}">${p.tonnage || 0}</span> Tonnes</p>
              <p><strong>Année:</strong> ${p.annee || 'Inconnu'}</p>
              <button class="${styles.voirPlusBtn}" id="voirPlusBtn_${p.adm3_name1 || p.commune}">
                Voir plus
              </button>
            </div>
            <footer class="${styles.popupFooter}">
              Filière: ${p.filiere || 'Générale'}
            </footer>
          </div>
        `;
        layer.bindPopup(popupContent, { className: styles.customPopup });

        layer.on({
          mouseover: (e) => e.target.setStyle({ fillOpacity: 0.8, weight: 3 }),
          mouseout: (e) => e.target.setStyle({ fillOpacity: 0.5, weight: 2 }),
          popupopen: (e) => {
            const btn = document.getElementById(`voirPlusBtn_${p.adm3_name1 || p.commune}`);
            if (btn && onVoirPlus) {
              btn.addEventListener('click', () => onVoirPlus(p.adm3_name1 || p.commune));
            }
          },
        });
      },
    }).addTo(map.current);

    const bounds = currentLayer.current.getBounds();
    if (bounds.isValid()) {
      map.current.flyToBounds(bounds, { padding: [50, 50], duration: 1.5 });
    }
  };

  return (
    <div className={styles.mapWrap}>
      <div ref={mapContainer} className={styles.map} />
    </div>
  );
};

export default Map;
