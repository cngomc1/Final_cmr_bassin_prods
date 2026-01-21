// app/map/page.jsx
'use client';
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import styles from './mapage.module.css';
import AdminFilter from '@/components/adminFilter';
import { Sprout, Fish, Beef, Settings2, X } from 'lucide-react'; // Import des icônes

const Map = dynamic(() => import('@/components/map'), {
    ssr: false,
    loading: () => <div className={styles.loading}>Chargement de la carte...</div>
});

const MapPage = () => {
    const [isAdminOpen, setIsAdminOpen] = useState(false);
    const [currentSelection, setCurrentSelection] = useState(null);
    const [activeFiliere, setActiveFiliere] = useState(null);

    return (
        <div className={styles.mapWrap}>  
            {/* 1. BARRE DES FILIÈRES (TOP) */}
            <div className={styles.filiereBar}>
                <button 
                    className={`${styles.filiereBtn} ${activeFiliere === 'Agriculture' ? styles.active : ''}`} 
                    onClick={() => setActiveFiliere('Agriculture')}
                >
                    <Sprout size={20} />
                    <span className={styles.btnLabel}>Agriculture</span>
                </button>
                <button 
                    className={`${styles.filiereBtn} ${activeFiliere === 'Pêche' ? styles.active : ''}`} 
                    onClick={() => setActiveFiliere('Pêche')}
                >
                    <Fish size={20} />
                    <span className={styles.btnLabel}>Pêche</span>
                </button>
                <button 
                    className={`${styles.filiereBtn} ${activeFiliere === 'Elevage' ? styles.active : ''}`} 
                    onClick={() => setActiveFiliere('Elevage')}
                >
                    <Beef size={20} />
                    <span className={styles.btnLabel}>Élevage</span>
                </button>
            </div>

            {/* 2. BOUTON ADMIN (FLOTTANT) */}
            <button 
                className={styles.toggleAdminBtn} 
                onClick={() => setIsAdminOpen(!isAdminOpen)}
            >
                {isAdminOpen ? <X size={20} /> : <Settings2 size={20} />}
                <span className={styles.btnLabel}>{isAdminOpen ? 'Fermer' : 'Zones Admin'}</span>
            </button>

            {/* 3. PANNEAU ADMIN */}
            {isAdminOpen && (
                <div className={styles.adminPanelContainer}>
                    <AdminFilter onFilterChange={(sel) => setCurrentSelection(sel)}/>
                </div>
            )}

            {/* LA CARTE */}
            <Map 
                currentSelection={currentSelection} 
                activeFiliere={activeFiliere} 
            />
        </div>
    );
};

export default MapPage;