// components/adminFilter.jsx
'use client'
import React, { useState, useEffect } from 'react';
import { getFilterOptions } from '@/services/geoserver';

import styles from './filter.module.css';

const AdminFilter = ({ onFilterChange }) => {
    const [regions, setRegions] = useState([]);
    const [depts, setDepts] = useState([]);
    const [communes, setCommunes] = useState([]);

    const [selectedRegion, setSelectedRegion] = useState("");
    const [selectedDept, setSelectedDept] = useState("");

    useEffect(() => {
        getFilterOptions("region").then(setRegions);
    }, []);

    const handleRegionChange = (e) => {
        const val = e.target.value;
        setSelectedRegion(val);
        setSelectedDept("");
        setCommunes([]);
        if (val) {
            getFilterOptions("departement", val).then(setDepts);
            onFilterChange({ type: 'region', value: val });
        }
    };

    const handleDeptChange = (e) => {
        const val = e.target.value;
        setSelectedDept(val);
        if (val) {
            getFilterOptions("commune", val).then(setCommunes);
            onFilterChange({ type: 'departement', value: val });
        }
    };

    const handleCommuneChange = (e) => {
        const val = e.target.value;
        if (val) {
            onFilterChange({ type: 'commune', value: val });
        }
    };

    return (
        <div className={styles.adminPanel}>
            <select onChange={handleRegionChange} className={styles.toggleAdminBtn}>
                <option value="">Région</option>
                {regions.map(r => <option key={r} value={r}>{r}</option>)}
            </select>

            <select disabled={!depts.length} onChange={handleDeptChange} className={styles.toggleAdminBtn}>
                <option value="">Département</option>
                {depts.map(d => <option key={d} value={d}>{d}</option>)}
            </select>

            <select disabled={!communes.length} onChange={handleCommuneChange} className={styles.toggleAdminBtn}>
                <option value="">Commune</option>
                {communes.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
        </div>
    );
};

export default AdminFilter;