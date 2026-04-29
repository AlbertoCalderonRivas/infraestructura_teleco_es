// definición de las fuentes de datos para el mapa

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
    url: `https://api.maptiler.com/tiles/v3/tiles.json?key=${KEYS.maptilerKey}`,
  });
  map.addSource("terrain-dem", {
    //source para terreno y hillshade en 3D
    type: "raster-dem",
    url: `https://api.maptiler.com/tiles/terrain-rgb-v2/tiles.json?key=${KEYS.maptilerKey}`,
    tileSize: 256,
  });

  // fuentes dinámicas (se inicializan vacías, se llenan en main.js)
  map.addSource("cobertura_5g", {
    type: "geojson",
    data: { type: "FeatureCollection", features: [] },
  });
  map.addSource("cobertura_4g", {
    type: "geojson",
    data: { type: "FeatureCollection", features: [] },
  });

  // Resto de fuentes: generadas desde LAYER_CONFIG
  LAYER_CONFIG.forEach(({ id, sourceId, sourceType, data }) => {
    // Saltar si ya existe esa source o si no hay que crearla
    if (!sourceType || map.getSource(sourceId)) return;

    if (sourceType === "geojson") {
      map.addSource(sourceId, { type: "geojson", data });
    } else if (sourceType === "pmtiles") {
      map.addSource(sourceId, { type: "vector", url: data });
    }
  });

  cargarIXPs();

}

// other functions //

//IXPs

function cargarIXPs() {
  fetch("https://api.peeringdb.com/api/ix?country=ES")
    .then(r => r.json())
    .then(data => {
      const ids = data.data.map(ix => ix.id);
      Promise.all(ids.map(id =>
        fetch(`https://api.peeringdb.com/api/ix/${id}`).then(r => r.json())
      )).then(resultados => {
        const features = resultados.flatMap(res =>
          res.data[0].fac_set.map(fac => ({
            type: "Feature",
            geometry: { type: "Point", coordinates: [fac.longitude, fac.latitude] },
            properties: {
              name: fac.name, city: fac.city, address: fac.address1,
              logo: fac.logo, url: fac.website, fecha_creacion: fac.created,
            },
          }))
        );
        map.getSource("ixps").setData({ type: "FeatureCollection", features });
      });
    });
}


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
