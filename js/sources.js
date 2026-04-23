// definición de las fuentes de datos para el mapa

const apiKey = KEYS.maptilerKey;

//// añade protocolo de pmTiles ////
// de momento lo uso en OpenCellid

const protocol = new pmtiles.Protocol();
maplibregl.addProtocol("pmtiles", protocol.tile);

function inicializarSources() {
  //Inicialización de las capas

  // SOURCES //
  map.addSource("maptiler", {
    //source para edificios en 3D
    type: "vector",
    url: `https://api.maptiler.com/tiles/v3/tiles.json?key=${apiKey}`,
  });
  map.addSource("terrain-dem", {
    //source para terreno y hillshade en 3D
    type: "raster-dem",
    url: `https://api.maptiler.com/tiles/terrain-rgb-v2/tiles.json?key=${apiKey}`,
    tileSize: 256,
  });

  //-------- IXPs --------//
  map.addSource("ixps", {
    //source para puntos de intercambio de internet
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: [],
    },
  });
  cargarIXPs();

  //-------- guifi.net --------//
  map.addSource("guifi_nodos_2d", {
    //source para nodos de guifi.net
    type: "geojson",
    data: "./data/guifi.net/guifi_nodos_completo.geojson",
  });

  map.addSource("guifi_nodos_3d", {
    //source para nodos de guifi.net
    type: "geojson",
    data: "./data/guifi.net/guifi_nodos_completo3D.geojson",
  });

  map.addSource("guifi_links", {
    //source para enlaces de guifi.net
    type: "geojson",
    data: "./data/guifi.net/guifi_links.geojson",
  });

  //-------- coberturas --------//

  map.addSource("cobertura_5g", {
    type: "geojson",
    data: { type: "FeatureCollection", features: [] },
  });

  map.addSource("cobertura_4g", {
    type: "geojson",
    data: { type: "FeatureCollection", features: [] },
  });

  //-------- openCellid --------//
// LTE - 4G 
  map.addSource("Digi_LTE", {
    type: "vector",
    url: "pmtiles://./data/openCell/pmtiles/Digi_LTE.pmtiles",
  });
    map.addSource("Endesa_LTE", {
    type: "vector",
    url: "pmtiles://./data/openCell/pmtiles/Endesa_LTE.pmtiles",
  });
    map.addSource("Iberdrola_LTE", {
    type: "vector",
    url: "pmtiles://./data/openCell/pmtiles/Iberdrola_LTE.pmtiles",
  });
    map.addSource("mnc_40_LTE", {
    type: "vector",
    url: "pmtiles://./data/openCell/pmtiles/mnc_40_LTE.pmtiles",
  });
    map.addSource("mnc_99_LTE", {
    type: "vector",
    url: "pmtiles://./data/openCell/pmtiles/mnc_99_LTE.pmtiles",
  });
    map.addSource("Orange_LTE", {
    type: "vector",
    url: "pmtiles://./data/openCell/pmtiles/Orange_LTE.pmtiles",
  });
    map.addSource("Telefonica_LTE", {
    type: "vector",
    url: "pmtiles://./data/openCell/pmtiles/Telefonica_LTE.pmtiles",
  });
    map.addSource("Vodafone_LTE", {
    type: "vector",
    url: "pmtiles://./data/openCell/pmtiles/Vodafone_LTE.pmtiles",
  });
    map.addSource("Yoigo_LTE", {
    type: "vector",
    url: "pmtiles://./data/openCell/pmtiles/Yoigo_LTE.pmtiles",
  });
  // NR - 5G
    map.addSource("Orange_NR", {
    type: "vector",
    url: "pmtiles://./data/openCell/pmtiles/Orange_NR.pmtiles",
  });
    map.addSource("Telefonica_NR", {
    type: "vector",
    url: "pmtiles://./data/openCell/pmtiles/Telefonica_NR.pmtiles",
  });
    map.addSource("Vodafone_NR", {
    type: "vector",
    url: "pmtiles://./data/openCell/pmtiles/Vodafone_NR.pmtiles",
  });


  // other functions //

  function cargarIXPs() {
    const geojson = {
      type: "FeatureCollection",
      features: [],
    };

    fetch("https://api.peeringdb.com/api/ix?country=ES")
      .then((r) => r.json())
      .then((data) => {
        const ids = data.data.map((ix) => ix.id);

        Promise.all(
          ids.map((id) =>
            fetch(`https://api.peeringdb.com/api/ix/${id}`).then((r) =>
              r.json(),
            ),
          ),
        ).then((resultados) => {
          resultados.forEach((res) => {
            res.data[0].fac_set.forEach((fac) => {
              geojson.features.push({
                type: "Feature",
                geometry: {
                  type: "Point",
                  coordinates: [fac.longitude, fac.latitude],
                },
                properties: {
                  name: fac.name,
                  city: fac.city,
                  address: fac.address1,
                  logo: fac.logo,
                  url: fac.website,
                  fecha_creacion: fac.created,
                },
              });
            });
          });

          map.getSource("ixps").setData(geojson);
        });
      });
  }
}

// Cobertura 5G //

const operadores5g = {
  x: { nombre: "deafault", color: "#7dab0077" },
  A78923125: { nombre: "Telefónica", color: "#0066ff" },
  A80907397: { nombre: "Vodafone", color: "#ff0000" },
  A82009812: { nombre: "Orange", color: "#ff6600" },
  A20609459: { nombre: "MásMóvil", color: "#ffcc00" },
  A82528548: { nombre: "Yoigo", color: "#ce2ad1" },
};

function cargarCobertura5G() {
  const bounds = map.getBounds();
  const bbox = `${bounds.getWest()},${bounds.getSouth()},${bounds.getEast()},${bounds.getNorth()}`;
  const url = `https://services9.arcgis.com/b5sc9d51LIwFoyfR/arcgis/rest/services/InfoCob5G_2025/FeatureServer/0/query?f=geojson&where=1=1&outFields=COBERTURA,VELOCIDAD&geometry=${bbox}&geometryType=esriGeometryEnvelope&inSR=4326&resultRecordCount=16000`;

  fetch(url)
    .then((r) => r.json())
    .then((data) => {
      map.getSource("cobertura_5g").setData(data);
    });
}

function cargarCobertura4G() {
  const bounds = map.getBounds();
  const bbox = `${bounds.getWest()},${bounds.getSouth()},${bounds.getEast()},${bounds.getNorth()}`;
  const url = `https://services9.arcgis.com/b5sc9d51LIwFoyfR/ArcGIS/rest/services/InfoCob4G_2024/FeatureServer/0/query?f=geojson&where=1=1&outFields=COBERTURA&geometry=${bbox}&geometryType=esriGeometryEnvelope&inSR=4326&resultRecordCount=16000`;

  fetch(url)
    .then((r) => r.json())
    .then((data) => {
      map.getSource("cobertura_4g").setData(data);
     // console.log(data);
    });
}

function generarGradienteVelocidad(colorBase) {
  // Convierte hex a RGB
  const r = parseInt(colorBase.slice(1, 3), 16);
  const g = parseInt(colorBase.slice(3, 5), 16);
  const b = parseInt(colorBase.slice(5, 7), 16);

  // Genera paradas oscureciendo el color (multiplicando por un factor)
  const paradas = [
    [0, 0.1], // muy oscuro
    [50, 0.25],
    [100, 0.45],
    [350, 0.7],
    [500, 1.0], // color base completo
  ];

  const expresion = ["step", ["get", "VELOCIDAD"], "rgba(0,0,0,0)"];
  paradas.forEach(([velocidad, factor]) => {
    const rc = Math.round(r * factor);
    const gc = Math.round(g * factor);
    const bc = Math.round(b * factor);
    expresion.push(velocidad);
    expresion.push(`rgb(${rc},${gc},${bc})`);
  });

  return expresion;
}
