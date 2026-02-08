Voici une structure de **README.md** claire, professionnelle et adaptée à ton projet. Il est conçu pour que tes camarades et ton enseignant puissent mettre le projet en route en moins de 5 minutes.

---

# 🌍 AgroMap Cameroon - Système de Visualisation Agro-pastorale

Bienvenue sur le projet **AgroMap Cameroon**. Cette application web permet de visualiser les zones de production (Agriculture, Pêche, Élevage) du Cameroun via une interface cartographique interactive type Google Maps.

## 🛠 Prérequis
Avant de commencer, assurez-vous d'avoir installé :
*   **Node.js** (v18 ou plus récent)
*   **PostgreSQL 16+** avec l'extension **PostGIS**
*   **GeoServer** (tournant sur le port `8080`)

---

## 🚀 Installation Rapide

### 1. Cloner et installer le Frontend
```bash
# Dans votre terminal
npm install
```

### 2. Configurer les variables d'environnement
Créez un fichier `.env.local` à la racine du projet et ajoutez votre clé MapTiler :
```env
NEXT_PUBLIC_MAPTILER_KEY=VOTRE_CLE_ICI
NEXT_PUBLIC_API_URL = 'http://localhost:5000'
```

---

## 📦 Configuration de la Base de Données & GeoServer

Pour que l'application puisse afficher les données, vous devez suivre scrupuleusement ces étapes de configuration.

### Étape 1 : PostGIS (La Base de Données)
1.  Créez une base de données nommée : `bassins_productions`.
2.  Activez PostGIS dans l'outil de requête (Query Tool) :
    ```sql
    CREATE EXTENSION postgis;
    ```
3.  Créez une table `productions` et importez le fichier CSV fournie (fichier `.csv` ) dans cette table. La table résultante doit s'appeler : `productions`.
<!-- 
### Étape 2 : GeoServer (Le Serveur Cartographique)
Configurez GeoServer via son interface web (`localhost:8080/geoserver`) :
1.  **Workspace :** Créez un espace de travail nommé `cameroun`.
2.  **Store :** Créez un nouvel entrepôt PostGIS pointant vers votre base `cmr_prods`.
3.  **Layer :** Publiez la table `cmr_admin3`. 
    *   *Important :* Dans l'onglet "Données", cliquez sur **"Calculer à partir des données"** pour les emprises (Bounding Boxes).

> **Note sur le CORS :** Inutile de modifier les fichiers système de GeoServer. L'application utilise un proxy interne qui gère automatiquement la sécurité.

---

## 🧪 Vérification de la Configuration

Une fois GeoServer lancé et l'application démarrée, nous avons mis à disposition un **Tutoriel Interactif** directement dans l'application pour valider votre installation.

1.  Lancez l'application : `npm run dev`
2.  Ouvrez votre navigateur sur : **[http://localhost:3000/TUTORIEL_CONFIG.html](http://localhost:3000/TUTORIEL_CONFIG.html)**
3.  Cliquez sur le bouton **"Vérifier la connexion"** en bas de page.

--- -->

## 📂 Structure du Projet
*   `/app` : Pages de l'application (Carte et Statistiques).
*   `/components` : Composants React (Moteur Leaflet, Filtres, Navbar).
*   `/services` : Logique de communication avec GeoServer.
*   `/public` : Fichiers statiques et guide de configuration.

<!-- --- -->

<!-- ## 👥 Équipe de développement
*   **[Ton Nom]** - Lead Dev & SIG
*   **[Noms des membres]** - Groupe [X] -->

---
*Fait en Janvier 2026 dans le cadre du cours de [Nom du cours].*