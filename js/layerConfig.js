// cada objeto del array corresponde a una capa del mapa
// el orden del array marca el orden de renderizado (las capas que deban quedar por encima del resto deben ser las últimas en renderizarse)

const LAYER_CONFIG = [
  // ── BASE ──────────────────────────────────────────────────────────────
  {
    id: "hillshade",
    categoria: "base",
    label: "3D hills",
    sourceId: "terrain-dem",
    sourceType: null, 
    layerType: "hillshade",
    paint: {
      "hillshade-illumination-direction": 195,
      "hillshade-exaggeration": 0.4,
      "hillshade-shadow-color": "#001133",
      "hillshade-highlight-color": "#cbc7fc",
      "hillshade-accent-color": "#ff00aa",
    },
    visibleByDefault: true,
    popup: false,
  },
  {
    id: "edificios-3d",
    categoria: "base",
    label: "3D buildings",
    sourceId: "maptiler",
    sourceType: null,
    sourceLayer: "building",
    layerType: "fill-extrusion",
    minzoom: 13,
    paint: {
      "fill-extrusion-color": [
        "interpolate",
        ["linear"],
        ["get", "render_height"],
        0,
        "#ec589555",
        10,
        "#f021df55",
        40,
        "#80005e55",
      ],
      "fill-extrusion-height": ["get", "render_height"],
      "fill-extrusion-base": ["get", "render_min_height"],
      "fill-extrusion-opacity": 0.8,
    },
    visibleByDefault: true,
    popup: false,
  },
  // ── PRIVADA: cobertura agregada ───────────────────────────────────────
  {
    id: "cobertura_5g",
    categoria: "privada",
    label: "cobertura 5G",
    grupo: "todas",
    sourceId: "cobertura_5g",
    sourceType: "geojson-dynamic", 
    layerType: "fill",
    filter: [">=", "VELOCIDAD", 48],
    minzoom: 13,
    paint: {
      "fill-color": generarGradienteVelocidad(OPERADORES.x?.color ?? "#a2a7ca"),
      "fill-opacity": 1,
    },
    visibleByDefault: false,
    popup: true,
  },
  {
    id: "cobertura_4g",
    categoria: "privada",
    label: "cobertura 4G",
    grupo: "todas",
    sourceId: "cobertura_4g",
    sourceType: "geojson-dynamic",
    layerType: "fill",
    minzoom: 13,
    paint: {
      "fill-color": "#a2a7ca77",
      "fill-opacity": 1,
    },
    visibleByDefault: false,
    popup: true,
  },

  // ── PÚBLICA ───────────────────────────────────────────────────────────
  {
    id: "ixps",
    categoria: "publica",
    label: "IXPs",
    sourceId: "ixps",
    sourceType: "geojson",
    data: { type: "FeatureCollection", features: [] }, 
    layerType: "symbol",
    layout: {
      "icon-image": "icono-ixp",
      "icon-size": ["interpolate", ["linear"], ["zoom"], 5, 0.025, 10, 0.04, 20, 0.09],
      "icon-pitch-alignment": "map",
      "icon-rotation-alignment": "map",
      "icon-allow-overlap": true,
      "symbol-avoid-edges": true,
    },
    visibleByDefault: true,
    popup: true,
    popupExclude: ["url"],
  },

  // ── COMUNITARIA ───────────────────────────────────────────────────────
  {
    id: "guifi_links",
    categoria: "comunitaria",
    label: "2D links",
    sourceId: "guifi_links",
    sourceType: "geojson",
    data: "./data/guifi.net/guifi_links.geojson",
    layerType: "line",
    paint: {
      "line-color": [
        "case",
        ["==", ["get", "STATUS"], "Working"],
        "#2de908",
        "#98989877",
      ],
      "line-width": 2,
      "line-opacity": 0.7,
    },
    visibleByDefault: true,
    popup: true,
  },
  {
    id: "guifi_nodos_2d",
    categoria: "comunitaria",
    label: "2D nodes",
    sourceId: "guifi_nodos_2d",
    sourceType: "geojson",
    data: "./data/guifi.net/guifi_nodos_completo.geojson",
    layerType: "circle",
    paint: {
      "circle-radius": [
        "interpolate",
        ["linear"],
        ["zoom"],
        5,
        1,
        10,
        3,
        16,
        5,
        20,
        45,
        22,
        70,
      ],
      "circle-color": [
        "case",
        ["==", ["get", "STATUS"], "Working"],
        "#2de908",
        "#98989877",
      ],
      "circle-pitch-alignment": "map",
      "circle-pitch-scale": "map",
    },
    visibleByDefault: true,
    popup: true,
    popupExclude: ["NODE_NAME", "cnml_title"],
  },
  {
    id: "guifi_nodos_3d",
    categoria: "comunitaria",
    label: "3D nodes",
    sourceId: "guifi_nodos_3d",
    sourceType: "geojson",
    data: "./data/guifi.net/guifi_nodos_completo3D.geojson",
    layerType: "fill-extrusion",
    minzoom: 16,
    paint: {
      "fill-extrusion-color": [
        "case",
        ["==", ["get", "antenna_elevation"], null],
        "#ff8c11",
        "#2de908",
      ],
      "fill-extrusion-height": [
        "max",
        ["coalesce", ["get", "antenna_elevation"], 3],
        3,
      ],
      "fill-extrusion-opacity": 0.8,
    },
    visibleByDefault: true,
    popup: false,
  },

  // ── PRIVADA: cables submarinos ───────────────────────────────────────
  {
    id: "cables_sub_spain",
    categoria: "privada",
    label: "nacionales",
    sourceId: "subCable_spain",
    sourceType: "geojson",
    data: "./data/subCableMap/subCable_spain.geojson",
    layerType: "line",
    paint: {
      "line-color": ["get", "color"],
      "line-width": 3,
      "line-opacity": 0.7,
    },
    visibleByDefault: true,
    popup: true,
    popupExclude: ["color", "coordinates", "feature_id", "id"],
  },

  {
    id: "cables_sub",
    categoria: "privada",
    label: "globales",
    sourceId: "subCable",
    sourceType: "geojson",
    data: "./data/subCableMap/subCable.geojson",
    layerType: "line",
    paint: {
      "line-color": ["get", "color"],
      "line-width": 2,
      "line-opacity": 0.7,
    },
    visibleByDefault: false,
    popup: true,
    popupExclude: ["color", "coordinates", "feature_id", "id"],
  },

  // ── PRIVADA: cobertura por operadora ─────────────────────────────────
  // Generadas programáticamente justo debajo del array
];

// loop para añadir al array las capas de cobertura por cada operadora
Object.entries(OPERADORES).forEach(([cif, op]) => {
  LAYER_CONFIG.push({
    id: `cobertura_5g_${op.clave.toLowerCase()}`,
    categoria: "privada",
    label: "cobertura 5G",
    grupo: op.clave.toLowerCase(),
    sourceId: "cobertura_5g",
    sourceType: null, 
    layerType: "fill",
    minzoom: 13,
    filter: [
      "all",
      [">=", ["get", "VELOCIDAD"], 48],
      [">", ["index-of", cif, ["get", "COBERTURA"]], -1],
    ],
    paint: {
      "fill-color": generarGradienteVelocidad(op.color),
      "fill-opacity": 0.3,
    },
    visibleByDefault: false,
    popup: true,
  });

  LAYER_CONFIG.push({
    id: `cobertura_4g_${op.clave.toLowerCase()}`,
    categoria: "privada",
    label: "cobertura 4G",
    grupo: op.clave.toLowerCase(),
    sourceId: "cobertura_4g",
    sourceType: null,
    layerType: "fill",
    minzoom: 13,
    filter: [">", ["index-of", cif, ["get", "COBERTURA"]], -1],
    paint: {
      "fill-color": op.color,
      "fill-opacity": 0.3,
    },
    visibleByDefault: op.clave === "Telefonica" ? true : false,
    popup: true,
  });
});

// Antenas (PMTiles) por operadora y tecnología
[
  { clave: "Telefonica", techs: ["LTE", "NR"] },
  { clave: "Vodafone", techs: ["LTE", "NR"] },
  { clave: "Orange", techs: ["LTE", "NR"] },
  { clave: "Yoigo", techs: ["LTE"] },
  { clave: "Digi", techs: ["LTE"] },
  { clave: "Endesa", techs: ["LTE"] },
  { clave: "Iberdrola", techs: ["LTE"] },
  { clave: "mnc_40", techs: ["LTE"] },
  { clave: "mnc_99", techs: ["LTE"] },
].forEach(({ clave, techs }) => {
  techs.forEach((tech) => {
    const id = `${clave}_${tech}`;
    // push de capa con los iconos
    LAYER_CONFIG.push({
      id,
      categoria: "privada",
      label: `antenas ${tech}`,
      grupo: clave.toLowerCase(),
      sourceId: id,
      sourceType: "pmtiles",
      sourceLayer: "antenas",
      data: `pmtiles://./data/openCell/pmtiles/${id}.pmtiles`,
      layerType: "symbol",
      layout: {
        "icon-image": tech === "NR" ? "icono-antena_NR" : "icono-antena_LTE",
        "icon-size": [
          "interpolate",
          ["linear"],
          ["zoom"],
          0,
          0.001,
          8,
          0.006,
          16,
          0.15,
        ],
        "icon-allow-overlap": true,
        "symbol-avoid-edges": true,
      },
      paint: {
        "icon-color": oscurecerColor(colorPorClave(clave), 0.65),
      },
      visibleByDefault: clave === "Telefonica" && tech === "LTE" ? true : false,
      popup: true,
    });
    //push de capa con los círculos de rango de las antenas
    LAYER_CONFIG.push({
      id: `${id}_range`,
      linkedTo: id,
      categoria: "publica",
      label: `rango  ${tech}`,
      grupo: clave.toLowerCase(),
      sourceId: id,
      sourceType: "null",
      sourceLayer: "antenas",
      data: `pmtiles://./data/openCell/pmtiles/${id}.pmtiles`,
      layerType: "circle",
      paint: {
        // convertir m to px -> px = m/156543 * cos(latitud)/2^zoom // latitud ~40º // esta conversión es un poco aleatoria hay que revisarla
        "circle-radius": [
          "interpolate",
          ["exponential", 2],
          ["zoom"],
          0,
          0,
          20,
          ["/", ["get", "range"], 0.075],
        ],
        "circle-color": oscurecerColor(colorPorClave(clave), 0.55),
        "circle-opacity": 0.03,
        "circle-blur": 0.1,
        "circle-stroke-color": oscurecerColor(colorPorClave(clave), 0.65),
        "circle-stroke-width": 0.1,
        "circle-pitch-alignment": "map",
      },
      visibleByDefault: clave === "Telefonica" && tech === "LTE" ? true : false,
      popup: false,
    });
  });
});
