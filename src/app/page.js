"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from './redirect.module.css';

export default function RedirectPage() {
    const router = useRouter();

    useEffect(() => {
        // On laisse 2.5 secondes pour l'animation avant de rediriger
        const timer = setTimeout(() => {
            router.push('/dashboard'); // Remplace par ta route
        }, 2500);

        return () => clearTimeout(timer);
    }, [router]);

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                {/* LOGO */}
                <div className={styles.logoWrapper}>
                    <div className={styles.logoHalo}></div>
                    <Image 
                        src="/logo.png"  // Assure-toi que le chemin est correct
                        alt="Logo" 
                        width={100} 
                        height={100} 
                        className={styles.logo}
                    />
                </div>

                {/* NOM ET SLOGAN */}
                <h1 className={styles.appName}>AgriStat <span className={styles.highlight}>CMR</span></h1>
                <p className={styles.slogan}>La data au service de votre productivité</p>

                {/* ANIMATION TROIS POINTS */}
                <div className={styles.loader}>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                
                <p className={styles.redirectText}>Préparation de votre espace...</p>
            </div>
        </div>
    );
}