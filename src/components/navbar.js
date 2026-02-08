'use client'
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';
import styles from './navbar.module.css';
import AdminFilter from './sidebar/adminFilter';
// import Image from 'next/image';
import { SlidersHorizontal } from 'lucide-react';


const Navbar = () => {
    const pathname = usePathname();
    const isCarte = pathname === '/carte';
    const [isOpen, setIsOpen] = useState(false);
    
    return (
        <div>  
            <div  className={styles.navbar}>
                {/* <Image src="/logo.png" alt="Logo" width={32} height={32} /> */}
                <h3>
                    CMR BASSIN PROD
                </h3>

                <div className={styles.menu}>
                    <a href="/carte" className={isCarte ? styles.active : styles.menuItem}>Carte</a>
                    <a href="/stats" className={pathname === '/stats' ? styles.active : styles.menuItem}>Statistiques</a>
                    {isCarte && (
                        <button onClick={() =>setIsOpen(true)}>
                        <SlidersHorizontal/>
                    </button>
                    )}
                </div>
            </div>

            {isOpen && (
            <div className={styles.subFilters}>
              <AdminFilter/>
              <button onClick={() =>setIsOpen(false)}> Appliquer</button>
            </div>
          )}
        </div>
)
}

export default Navbar;