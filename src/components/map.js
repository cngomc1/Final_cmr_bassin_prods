'use client'

import React, { useRef, useEffect, useState } from 'react';
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import styles from './map.module.css';
import { MaptilerLayer } from "@maptiler/leaflet-maptilersdk";
import { GeocodingControl } from "@maptiler/geocoding-control/leaflet";
import "@maptiler/geocoding-control/style.css";

// Importation de ton service GeoServer
import { fetchProductionGeoJSON, fetchZoneGeoJSON } from '@/services/geoserver';

const Map = ({ currentSelection, activeFiliere }) => {
    // Références pour manipuler la carte et les couches sans déclencher de re-renders inutiles
    const mapContainer = useRef(null);
    const map = useRef(null);
    const currentLayer = useRef(null); // Pour stocker la couche GeoJSON actuelle

    const center = { lat: 7.3697, lng: 12.3547 };
    const key = process.env.NEXT_PUBLIC_MAPTILER_KEY;

    // --- 1. INITIALISATION DE LA CARTE (Une seule fois) ---
    useEffect(() => {
        if (map.current) return; 

        map.current = new L.Map(mapContainer.current, {
            center: L.latLng(center.lat, center.lng),
            zoom: 6,
            zoomControl: false // On le désactive pour le placer en bas à droite
        });

        // Fond de carte MapTiler
        new MaptilerLayer({ apiKey: key }).addTo(map.current);

        // Barre de recherche (Geocoding)
        const gc = new GeocodingControl({ apiKey: key, position: 'topright' });
        map.current.addControl(gc);

        // Boutons de zoom en bas à droite
        L.control.zoom({ position: 'bottomright' }).addTo(map.current);
    }, [key, center.lat, center.lng]);

 
    // Réagir aux changements de Filière (Agriculture, etc.)
    useEffect(() => {
        if (activeFiliere) {
            try {
                fetchProductionGeoJSON(activeFiliere).then(displayGeoData);
            } catch (error) {
                console.error("Erreur lors du chargement des données GeoJSON :", error);
            }
        }
    }, [activeFiliere]);

    // Réagir aux changements de Sélection Admin (Région, Dept)
    useEffect(() => {
    if (!currentSelection || !map.current) return;

    const { type, value } = currentSelection;
    console.log(`PROUVE : La Map a reçu le filtre ${type} avec la valeur : ${value}`);

    const updateAdminDisplay = async () => {
        try {
            // 1. Appel au traducteur geoserver.js
            const geojson = await fetchZoneGeoJSON(type, value);
            
            if (geojson.features.length === 0) {
                console.warn("GeoServer n'a trouvé aucun polygone pour cette sélection.");
                return;
            }

            // 2. Affichage et Zoom
            displayGeoData(geojson);

        } catch (error) {
            console.error("Erreur de communication avec GeoServer :", error);
        }
    };

    updateAdminDisplay();
}, [currentSelection]); 
    // --- 3. FONCTIONS UTILITAIRES ---

    // Fonction centrale pour afficher les données GeoJSON et zoomer
    // map.js - Extrait de la fonction displayGeoData

const displayGeoData = (geojson) => {
    if (!map.current) return;

    if (currentLayer.current) {
        map.current.removeLayer(currentLayer.current);
    }

    // Définition des couleurs par filière
    const getFiliereColor = (filiere) => {
        switch (filiere?.toLowerCase()) {
            case 'agriculture': return "#2e7d32"; // Vert
            case 'pêche': return "#0288d1";      // Bleu
            case 'elevage': return "#f57c00";    // Orange
            default: return "gray";
        }
    };

    currentLayer.current = L.geoJSON(geojson, {
        style: (feature) => ({
            color: getFiliereColor(feature.properties.filiere),
            weight: 2,
            fillOpacity: 0.5,
            fillColor: getFiliereColor(feature.properties.filiere)
        }),
        onEachFeature: (feature, layer) => {
            const p = feature.properties;
            
            // Construction d'un popup élégant en HTML
            const popupContent = `
                <div class="${styles.popupContainer}">
                    <header class="${styles.popupHeader}">
                        <strong>${p.adm3_name1 || p.nom || 'Zone'}</strong>
                        <small>${p.adm1_name1 || ''}</small>
                    </header>
                    <div class="${styles.popupBody}">
                        <p><strong>Produit:</strong> ${p.produit || 'N/A'}</p>
                        <p><strong>Production:</strong> <span class={styles.tonnage}>${p.quantite || 0}</span> Tonnes</p>
                        <p><strong>Année:</strong> ${p.annee || '2024'}</p>
                    </div>
                    <footer class="${styles.popupFooter}">
                        Filière: ${p.filiere || 'Générale'}
                    </footer>
                </div>
            `;
            
            layer.bindPopup(popupContent, {
                className: styles.customPopup // Pour styliser davantage en CSS
            });

            // Effet au survol
            layer.on({
                mouseover: (e) => {
                    const l = e.target;
                    l.setStyle({ fillOpacity: 0.8, weight: 3 });
                },
                mouseout: (e) => {
                    const l = e.target;
                    l.setStyle({ fillOpacity: 0.5, weight: 2 });
                }
            });
        }
    }).addTo(map.current);

    const bounds = currentLayer.current.getBounds();
    if (bounds.isValid()) {
        map.current.flyToBounds(bounds, { padding: [50, 50], duration: 1.5 });
    }
};

 

  

    return (
        <div className={styles.mapWrap}>  
            <div ref={mapContainer} className={styles.map}/>
        </div>
    );
};

export default Map;