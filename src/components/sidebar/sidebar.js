"use client";
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import AdminFilter from './adminFilter';
import styles from './sidebar.module.css';

// export default function Sidebar({ filters, onFilterChange }) {
export default function Sidebar() {
  const pathname = usePathname();
  const isCarte = pathname === '/carte';

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>CMR BASSIN PRODS</div>
      
      <nav className={styles.nav}>
        <div className={styles.menuItem}>
          <Link href="/carte" className={isCarte ? styles.active : ''}>
            Carte
          </Link>
          {isCarte && (
            <div className={styles.subFilters}>
              <AdminFilter/>
            </div>
          )}
        </div>

        <div className={styles.menuItem}>
          <Link href="/stats" className={pathname === '/stats' ? styles.active : ''}>
            Statistiques
          </Link>
        </div>
      </nav>
    </aside>
  );
}