import './globals.css';

export const metadata = {
  title: 'CMR Bassins de Production',
  description: 'Cartographie et statistiques des bassins de production au Cameroun',
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}