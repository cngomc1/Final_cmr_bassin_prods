'use client'
import React, { useEffect, useState, useMemo } from 'react';
import styles from './stats.module.css';
import { getFilterOptions, getStatsData } from '@/services/geoserver';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts';
import { TrendingUp, MapPin, Filter, BarChart3, PieChart as PieIcon } from 'lucide-react';

const Stats = () => {
    // États pour les options des filtres
    const [options, setOptions] = useState({ years: [], regions: [], depts: [] });
    
    // États pour les sélections
    const [filters, setFilters] = useState({
        year: "2022",
        region: "",
        dept: "",
        filiere: ""
    });

    const [rawData, setRawData] = useState([]);
    const [loading, setLoading] = useState(false);

    const FILIERES_CONFIG = {
        'Agriculture': '#2e7d32',
        'Pêche': '#0288d1',
        'Elevage': '#f57c00'
    };

    // 1. Chargement initial des options
    useEffect(() => {
        Promise.all([
            getFilterOptions("year"),
            getFilterOptions("region")
        ]).then(([years, regions]) => {
            setOptions(prev => ({ ...prev, years, regions }));
        });
    }, []);

    // 2. Chargement des départements quand la région change
    useEffect(() => {
        if (filters.region) {
            getFilterOptions("departement", filters.region).then(depts => {
                setOptions(prev => ({ ...prev, depts }));
            });
        }
    }, [filters.region]);

    // 3. Récupération des données brutes de GeoServer (par année)
    useEffect(() => {
        if (filters.year) {
            setLoading(true);
            getStatsData(filters.year).then(data => {
                setRawData(data);
                setLoading(false);
            });
        }
    }, [filters.year]);

    // 4. LOGIQUE DE FILTRAGE DYNAMIQUE (Calculs instantanés)
    const processedData = useMemo(() => {
        // Appliquer les filtres administratifs et thématiques
        let data = rawData.filter(item => {
            const matchRegion = !filters.region || item.adm1_name1 === filters.region;
            const matchDept = !filters.dept || item.adm2_name1 === filters.dept;
            const matchFiliere = !filters.filiere || item.filiere === filters.filiere;
            return matchRegion && matchDept && matchFiliere;
        });

        // Calcul des totaux pour les cartes KPI
        const totals = Object.keys(FILIERES_CONFIG).reduce((acc, f) => {
            acc[f] = data.filter(d => d.filiere === f).reduce((sum, curr) => sum + curr.tonnage, 0);
            return acc;
        }, {});

        // Top 5 Arrondissements (basé sur la sélection actuelle)
        const top5 = [...data]
            .sort((a, b) => b.tonnage - a.tonnage)
            .slice(0, 5)
            .map(item => ({ name: item.adm3_name1, value: item.tonnage, filiere: item.filiere }));

        // Répartition par filière pour le Pie Chart
        const distribution = Object.keys(FILIERES_CONFIG).map(f => ({
            name: f,
            value: totals[f]
        })).filter(d => d.value > 0);

        return { totals, top5, distribution };
    }, [rawData, filters]);

    return (
        <div className={styles.main}>
            <h2>Statistiques de production</h2>
            {/* BARRE DE FILTRES MULTI-NIVEAUX */}
            <section className={styles.filterSection}>
                <div className={styles.filterGroup}>
                    <TrendingUp size={16} />
                    <select value={filters.year} onChange={e => setFilters({...filters, year: e.target.value})}>
                        {options.years.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                </div>
                <div className={styles.filterGroup}>
                    <MapPin size={16} />
                    <select value={filters.region} onChange={e => setFilters({...filters, region: e.target.value, dept: ""})}>
                        <option value="">Toutes les Régions</option>
                        {options.regions.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                    <select disabled={!filters.region} value={filters.dept} onChange={e => setFilters({...filters, dept: e.target.value})}>
                        <option value="">Tous les Départements</option>
                        {options.depts.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                </div>
                <div className={styles.filterGroup}>
                    <Filter size={16} />
                    <select value={filters.filiere} onChange={e => setFilters({...filters, filiere: e.target.value})}>
                        <option value="">Toutes les Filières</option>
                        {Object.keys(FILIERES_CONFIG).map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                </div>
            </section>

            {/* CARTES KPI */}
            <div className={styles.kpiGrid}>
                {Object.entries(FILIERES_CONFIG).map(([name, color]) => (
                    <div key={name} className={styles.kpiCard} style={{ borderBottom: `4px solid ${color}` }}>
                        <span className={styles.kpiLabel}>{name}</span>
                        <h2 className={styles.kpiValue}>
                            {loading ? "..." : processedData.totals[name]?.toLocaleString()} <small>T</small>
                        </h2>
                    </div>
                ))}
            </div>

            {/* GRAPHIQUES */}
            <div className={styles.chartsGrid}>
                {/* TOP 5 */}
                <div className={styles.chartCard}>
                    <div className={styles.chartHeader}><BarChart3 size={18} /> <h4>Top 5 Arrondissements</h4></div>
                    <div className={styles.chartWrapper}>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={processedData.top5} layout="vertical" margin={{ left: 30, right: 30 }}>
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" fontSize={11} width={80} />
                                <Tooltip />
                                <Bar dataKey="value" radius={[0, 5, 5, 0]}>
                                    {processedData.top5.map((entry, index) => (
                                        <Cell key={index} fill={FILIERES_CONFIG[entry.filiere]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* RÉPARTITION */}
                <div className={styles.chartCard}>
                    <div className={styles.chartHeader}><PieIcon size={18} /> <h4>Répartition Sectorielle</h4></div>
                    <div className={styles.chartWrapper}>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie 
                                    data={processedData.distribution} 
                                    innerRadius={60} 
                                    outerRadius={80} 
                                    dataKey="value"
                                    label
                                >
                                    {processedData.distribution.map((entry, index) => (
                                        <Cell key={index} fill={FILIERES_CONFIG[entry.name]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Stats;