// Dans ce fichier, nous définissons une fonction pour interagir avec GeoServer et récupérer les données GeoJSON
const GEOSERVER_WFS_URL = process.env.NEXT_PUBLIC_GEOSERVER_WFS_URL ;
const GEOSERVER_WFS_LAYER = process.env.NEXT_PUBLIC_GEOSERVER_WFS_LAYER ;

export const fetchProductionGeoJSON = async (filiere, region = null, product = null) => {
    let cqlFilter = `filiere='${filiere}'`;
    if (region) cqlFilter += ` AND region='${region}'`;
    if (product) cqlFilter += ` AND product='${product}'`;
   
    const params = new URLSearchParams({
        service: 'WFS',
        version: '1.0.0',
        request: 'GetFeature',
        typeName: GEOSERVER_WFS_LAYER,
        outputFormat: 'application/json',
        CQL_FILTER: cqlFilter
    });

    const response = await fetch(`${GEOSERVER_WFS_URL}?${params.toString()}`);
    return await response.json();
};



const COLUMN_MAPPING = {
    region: "adm1_name1",
    departement: "adm2_name1",
    commune: "adm3_name1",
    filiere: "filiere",
    product: "produit",
    year: "annee"
};

export const getFilterOptions = async (level, parentName = null) => {
    const propertyName = COLUMN_MAPPING[level];
    let cqlFilter = "";

    if (level === "departement") {
        cqlFilter = `${COLUMN_MAPPING.region}='${parentName}'`;
    } else if (level === "commune") {
        cqlFilter = `${COLUMN_MAPPING.departement}='${parentName}'`;
    }  

    const params = new URLSearchParams({
        service: 'WFS',
        version: '1.0.0',
        request: 'GetFeature',
        typeName: GEOSERVER_WFS_LAYER,
        outputFormat: 'application/json',
        propertyName: propertyName,
        ...(cqlFilter && { CQL_FILTER: cqlFilter })
    });

    const response = await fetch(`${GEOSERVER_WFS_URL}?${params.toString()}`);
    const data = await response.json();
    const list = data.features.map(f => f.properties[propertyName]);
    return [...new Set(list)].sort();
};

export const fetchZoneGeoJSON = async (level, value = null) => {
    let cqlFilter = "";

    // Si value est présent, c'est un filtre Admin (region, departement, commune)
    if (value) {
        const columnName = COLUMN_MAPPING[level];
        cqlFilter = `${columnName}='${value}'`;
    } else {
        // Sinon c'est une filière (le premier paramètre est alors 'Agriculture', etc.)
        cqlFilter = `${COLUMN_MAPPING.filiere}='${level}'`;
    }

    const params = new URLSearchParams({
        service: 'WFS',
        version: '1.0.0',
        request: 'GetFeature',
        typeName: GEOSERVER_WFS_LAYER,
        outputFormat: 'application/json',
        CQL_FILTER: cqlFilter
    });

    const response = await fetch(`${GEOSERVER_WFS_URL}?${params.toString()}`);
    return await response.json();
};


export const getStatsData = async (year) => {
    const params = new URLSearchParams({
        service: 'WFS',
        version: '1.0.0',
        request: 'GetFeature',
        typeName: GEOSERVER_WFS_LAYER,
        outputFormat: 'application/json',
        propertyName: 'adm1_name1,adm2_name1,adm3_name1,filiere,produit,tonnage,annee',
        CQL_FILTER: `annee=${year}`
    });
    const response = await fetch(`/geoserver-api/ows?${params.toString()}`);
    const data = await response.json();
    return data.features.map(f => f.properties);
};

export const fetchAllProductsByCommune = async (pcode) => {
    const params = new URLSearchParams({
        service: 'WFS',
        version: '1.0.0',
        request: 'GetFeature',
        typeName: GEOSERVER_WFS_LAYER,
        outputFormat: 'application/json',
        CQL_FILTER: `adm3_pcode='${pcode}'`
    });

    const response = await fetch(`${process.env.NEXT_PUBLIC_GEOSERVER_WFS_URL}?${params.toString()}`);
    const data = await response.json();
    // On retourne uniquement le tableau des propriétés
    return data.features.map(f => f.properties);
};
// export const getStatsData = async (year) => {
//     const params = new URLSearchParams({
//         service: 'WFS',
//         version: '1.0.0',
//         request: 'GetFeature',
//         typeName: GEOSERVER_WFS_LAYER,
//         outputFormat: 'application/json',
//         // On ne demande que les colonnes nécessaires pour les calculs (gain de performance)
//         propertyName: 'filiere,produit,tonnage,annee,adm3_name1',
//         CQL_FILTER: `annee=${year}`
//     });

//     const response = await fetch(`${process.env.NEXT_PUBLIC_GEOSERVER_WFS_URL}?${params.toString()}`);
//     const data = await response.json();
//     return data.features.map(f => f.properties);
// };
