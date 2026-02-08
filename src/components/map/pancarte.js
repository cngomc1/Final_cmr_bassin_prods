"use client";
import React, { useEffect, useState } from 'react';
import styles from './pancarte.module.css';
import { MapPin, Trophy, BarChart3, X, ChevronRight, Package } from 'lucide-react';

export default function Pancarte({ data, onClose }) {
  const [isVisible, setIsVisible] = useState(false);

  // Déclenche l'animation d'entrée au montage
  useEffect(() => {
    if (data) {
      setIsVisible(true);
    }
  }, [data]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Attend la fin de l'animation pour démonter le composant
  };

  if (!data) return null;

  return (
    <div className={`${styles.pancarteContainer} ${isVisible ? styles.visible : ''}`}>
      {/* Header avec bouton fermer */}
      <header className={styles.header}>
        <button onClick={handleClose} className={styles.closeBtn}>
          <X size={24} />
        </button>
        <div className={styles.titleGroup}>
          <h2 className={styles.cityName}>{data.nom}</h2>
          <p className={styles.location}>
            <MapPin size={14} /> {data.localisation.departement}, {data.localisation.region}
          </p>
        </div>
      </header>

      <div className={styles.body}>
        {/* Badge Filière */}
        <div className={styles.filiereBadge}>
            <span className={styles.dot}></span>
            {data.filiere_info.nom} - {data.filiere_info.annee}
        </div>

        {/* Section Rangs (Le Cerveau) */}
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}><Trophy size={16} /> Classements</h3>
          <div className={styles.rankGrid}>
            <div className={styles.rankItem}>
              <span className={styles.rankLabel}>National</span>
              <span className={styles.rankValue}>#{data.statistiques.rangs.national}</span>
            </div>
            <div className={styles.rankItem}>
              <span className={styles.rankLabel}>Régional</span>
              <span className={styles.rankValue}>#{data.statistiques.rangs.regional}</span>
            </div>
            <div className={`${styles.rankItem} ${styles.highlight}`}>
              <span className={styles.rankLabel}>Départemental</span>
              <span className={styles.rankValue}>#{data.statistiques.rangs.departemental}</span>
            </div>
          </div>
        </section>

        {/* Section Production Globale */}
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}><BarChart3 size={16} /> Production</h3>
          <div className={styles.statsCard}>
            <div className={styles.totalRow}>
              <span className={styles.bigNumber}>{data.statistiques.tonnage_total.toLocaleString()}</span>
              <span className={styles.unit}>Tonnes</span>
            </div>
            <div className={styles.contribution}>
              Contribution nationale : <strong>{data.statistiques.contribution_nationale}</strong>
            </div>
          </div>
        </section>

        {/* Liste des produits détaillés */}
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}><Package size={16} /> Détail par produit</h3>
          <div className={styles.productList}>
            {data.produits_detail.map((item, index) => (
              <div key={index} className={styles.productItem}>
                <div className={styles.productInfo}>
                  <span className={styles.productName}>{item.produit}</span>
                  <span className={styles.productTonnage}>{item.tonnage.toLocaleString()} T</span>
                </div>
                <div className={styles.progressBar}>
                  <div 
                    className={styles.progressFill} 
                    style={{ width: `${(item.tonnage / data.statistiques.tonnage_total) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <footer className={styles.footer}>
        <p>Pcode: {data.localisation.pcode}</p>
      </footer>
    </div>
  );
}