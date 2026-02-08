import Navbar from '@/components/navbar';
import Sidebar from '../../components/sidebar/sidebar';
import styles from './layout.module.css';
import { FilterProvider } from "@/context/FilterContext";


export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        <FilterProvider>
          <div className={styles.layoutContainer}>
            <Sidebar/>
            <Navbar/>
            
            {/* Contenu principal à droite */}
            <main className={styles.mainContent}>
              <div className={styles.pageScroll}>
                    {children}
              </div>
            </main>
            
          </div>
        </FilterProvider>
      </body>
    </html>
  );
}