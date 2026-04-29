// cada objeto del array corresponde a una capa del mapa
// el orden del array marca el orden de renderizado (las capas que deban quedar por encima del resto deben ser las últimas en renderizarse)

const LAYER_CONFIG = [
  // ── BASE ──────────────────────────────────────────────────────────────
  {
    id: "hillshade",
    categoria: "base",
    label: "3D hills",
    sourceId: "terrain-dem",
    sourceType: null, // null = no crear source, ya existe
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
        "#bdc6ff55",
        10,
        "#fc56e255",
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
    sourceType: "geojson-dynamic", // fuente dinámica, se gestiona aparte
    layerType: "fill",
    filter: [">=", "VELOCIDAD", 48],
    minzoom: 13,
    paint: {
      "fill-color": generarGradienteVelocidad(OPERADORES.x?.color ?? "#7dab00"),
      "fill-opacity": 1,
    },
    visibleByDefault: true,
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
      "fill-color": "#7dab0077",
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
    data: { type: "FeatureCollection", features: [] }, // vacío, cargarIXPs() lo rellena
    layerType: "circle",
    paint: {
      "circle-radius": ["interpolate", ["linear"], ["zoom"], 5, 6, 20, 25],
      "circle-color": "#56a2ff",
      "circle-stroke-color": "#000000",
      "circle-stroke-width": 3,
      "circle-pitch-alignment": "map",
      "circle-pitch-scale": "map",
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
    popupExclude: ["NODE_NAME","cnml_title"],
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
    paint: { "line-color":["get", "color"], "line-width": 2, "line-opacity": 0.7 },
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
    paint: { "line-color":["get", "color"], "line-width": 2, "line-opacity": 0.7 },
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
    sourceType: null, // comparte source con cobertura_5g
    layerType: "fill",
    minzoom: 13,
    filter: [
      "all",
      [">=", ["get", "VELOCIDAD"], 48],
      [">", ["index-of", cif, ["get", "COBERTURA"]], -1],
    ],
    paint: {
      "fill-color": generarGradienteVelocidad(op.color),
      "fill-opacity": 1,
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
      "fill-opacity": 1,
    },
    visibleByDefault: false,
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
          0.03,
          8,
          0.02,
          16,
          0.15,
        ],
        "icon-allow-overlap": true,
      },
      paint: {
        "icon-color": oscurecerColor(colorPorClave(clave), 0.65),
      },
      visibleByDefault: false,
      popup: false,
    });
  });
});
