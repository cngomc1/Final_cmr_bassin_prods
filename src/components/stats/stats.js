"use client";
import React, { useState, useEffect } from 'react';
import { statsService } from '../../services/statsService';
import { geoService } from '../../services/geoService';
import { productService } from '../../services/productService';
import styles from './stats.module.css';
import { 
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
    Cell, PieChart, Pie, Legend, CartesianGrid 
} from 'recharts';
import { TrendingUp, MapPin, BarChart3, Trophy, Building2, Scale } from 'lucide-react';

const FILIERES_CONFIG = {
    'Agriculture': '#2e7d32',
    'Élevage': '#f57c00',
    'Pêche': '#0288d1'
};

export default function StatsPage() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [options, setOptions] = useState({ years: [], regions: [], departments: [] });
    
    const [filters, setFilters] = useState({
        annee: '2023',
        filiere_id: 'Agriculture',
        region_id: '',
        dept_id: ''
    });

    // 1. Chargement initial des options (Années et Régions)
    useEffect(() => {
        const loadOptions = async () => {
            const [years, regions] = await Promise.all([
                productService.getAnnees(),
                geoService.getRegions()
            ]);
            setOptions({ years, regions });
        };
        loadOptions();
    }, []);

    useEffect(() => {
        const loadDepts = async () => {
          if (filters.region_id) {
            try {
              const depts = await geoService.getDepartements(filters.region_id);
              setOptions(prev => ({ ...prev, departments: depts }));
            } catch (err) {
              console.error("Erreur chargement départements:", err);
            }
          } 
        };
        loadDepts();
      }, [filters.region_id]);
    

    // 2. Chargement des statistiques globales
    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            try {
                const data = await statsService.getGlobalStats(filters);
                setStats(data);
            } catch (error) {
                console.error("Erreur stats:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [filters]);

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1><BarChart3 size={28} /> Statistiques de Production</h1>
                
                {/* Onglets horizontaux pour les filières */}
                <div className={styles.tabs}>
                    {Object.keys(FILIERES_CONFIG).map((f) => (
                        <button 
                            key={f}
                            className={filters.filiere_id === f ? styles.activeTab : ''} 
                            onClick={() => setFilters({ ...filters, filiere_id: f })}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                {/* Filtres horizontaux */}
                <div className={styles.filtersBar}>
                    <div className={styles.selectWrapper}>
                        <TrendingUp size={16} />
                        <select 
                            value={filters.annee} 
                            onChange={(e) => setFilters({...filters, annee: e.target.value})}
                        >
                            {options.years.map(y => (<option key={y.annee} value={y.annee}> {y.annee}</option>))}
                        </select>
                    </div>

                    <div className={styles.selectWrapper}>
                        <MapPin size={16} />
                        <select 
                            value={filters.region_id} 
                            onChange={(e) => setFilters({...filters, region_id: e.target.value})}
                        >
                            <option value="">Tout le Cameroun</option>
                            {options.regions.map(r => (
                                <option key={r.region} value={r.region}>{r.region}</option>
                            ))}
                        </select>
                    </div>
                    <div className={styles.selectWrapper}>
                        <MapPin size={16} />
                        <select 
                            value={filters.dept_id} 
                            onChange={(e) => setFilters({...filters, dept_id: e.target.value})}
                        >
                            <option value="">Tous les départements</option>
                            {options.departments?.map(d => (
                                <option key={d.nom} value={d.nom}>{d.nom}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </header>

            {/* Cartes KPI (Production Totale) */}
            <div className={styles.kpiGrid}>
                <div className={styles.kpiCard} style={{ borderBottom: `4px solid ${FILIERES_CONFIG[filters.filiere_id]}` }}>
                    <span className={styles.kpiLabel}>Production Totale ({filters.filiere_id})</span>
                    <h2 className={styles.kpiValue}>
                        {loading ? "..." : stats?.production_totale?.toLocaleString()} <small>Tonnes</small>
                    </h2>
                </div>
            </div>

            <main className={styles.accordions}>
                {/* 1. TOP 5 PRODUITS */}
                <details className={styles.card} open>
                    <summary><Trophy size={18} /> Top 5 des produits</summary>
                    <div className={styles.content}>
                        <div className={styles.chartWrapper}>
                            {
                                stats?.top_5_produits && stats.top_5_produits.length > 0 ?(
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={stats?.top_5_produits} layout="vertical">
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="label" type="category" fontSize={12} width={100} />
                                    <Tooltip />
                                    <Bar dataKey="valeur" fill={FILIERES_CONFIG[filters.filiere_id]} radius={[0, 4, 4, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                             ): (
                                    <p className={styles.noData}>Aucun produit correspondant à ce filtre</p>
                                )
                            }
                        </div>
                    </div>
                </details>

                {/* 2. TOP 5 BASSINS */}
                <details className={styles.card}>
                    <summary><Building2 size={18} /> Top 5 des bassins de production</summary>
                    <div className={styles.content}>
                        <div className={styles.chartWrapper}>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={stats?.top_5_bassins}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="nom" fontSize={11} />
                                    <YAxis fontSize={12} />
                                    <Tooltip />
                                    <Bar dataKey="valeur" fill="#475569" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                            {
                                stats?.top_5_bassins && stats.top_5_bassins.length === 0 && (
                                    <p className={styles.noData}>Aucune bassin correspondant à ce filtre</p>
                                )
                            }
                        </div>
                    </div>
                </details>

                {/* 3. COMPARAISON INTRA-ZONE */}
                <details className={styles.card}>
                <summary>
                    <Scale size={18} /> 
                    {stats?.comparaison?.titre || "Comparaison"}
                </summary>
                
                <div className={styles.content}>
                    {stats?.comparaison?.donnees && stats.comparaison.donnees.length > 0 ? (
                        <div className={styles.chartWrapper} style={{ height: '350px', width: '100%' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie 
                                        data={stats.comparaison.donnees} 
                                        dataKey="valeur" 
                                        nameKey="zone" 
                                        cx="50%" cy="50%" 
                                        innerRadius={60} 
                                        outerRadius={100} 
                                        label
                                    >
                                        {stats.comparaison.donnees.map((entry, index) => (
                                            <Cell 
                                                key={`cell-${index}`} 
                                                fill={index % 2 === 0 ? '#2d5a27' : '#94a3b8'} 
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <p className={styles.noData}>Aucune donnée de comparaison disponible</p>
                    )}
                </div>
            </details>
            </main>
        </div>
    );
}