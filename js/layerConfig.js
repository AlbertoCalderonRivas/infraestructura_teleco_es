// cada objeto del array corresponde a una capa del mapa
// el orden del array marca el orden de renderizado (las capas que deban quedar por encima del resto deben ser las últimas en renderizarse)
const currentYear = new Date().getFullYear();
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
      "hillshade-shadow-color": "#294376",
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

  // ── COBERTURA SETELECO ─────────────────────────────────────────
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
    visibleByDefault: true,
    popup: true,
  },
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
  // ── ANTENAS MÓVILES ───────────────────────────────────────────────────
  
   {
    id: "rangos", categoria: "privada", label: "rangos",
    sourceId: "antenas", sourceType: "pmtiles", sourceLayer: "antenas",
    data: "pmtiles://./data/openCell/pmtiles/antenas.pmtiles",
    layerType: "circle",
    filter: ["in", ["get", "radio"], ["literal", ["LTE"]]],   // se actualiza por código
    paint: {
      "circle-radius": ["interpolate", ["exponential", 2], ["zoom"], 0, 0, 20, ["/", ["get", "range"], 0.075]],
      "circle-color": colorOperadorExpr(0.55),
      "circle-opacity": 0.03, "circle-blur": 0.1,
      "circle-stroke-color": colorOperadorExpr(0.65), "circle-stroke-width": 0.1,
      "circle-pitch-alignment": "map",
    },
    colorBase: [
  { prop: "circle-color",        expr: colorOperadorExpr(0.55), gov: gobernanzaOperadorExpr() },
  { prop: "circle-stroke-color", expr: colorOperadorExpr(0.65), gov: gobernanzaOperadorExpr() },
],
    visibleByDefault: true, popup: false,
  },
  ...["LTE", "NR"].map(radio => ({
    id: `antenas_${radio}`, categoria: "privada", label: `antenas ${radio}`,
    sourceId: "antenas", sourceType: null, sourceLayer: "antenas",
    layerType: "symbol",
    filter: ["==", ["get", "radio"], radio],
    layout: {
      "icon-image": radio === "NR" ? "icono-antena_NR" : "icono-antena_LTE",
      "icon-size": ["interpolate", ["linear"], ["zoom"], 0, 0.001, 8, 0.006, 16, 0.15],
      "icon-allow-overlap": true, "symbol-avoid-edges": true,
    },
    paint: { "icon-color": colorOperadorExpr() },
    colorBase: { prop: "icon-color", expr: colorOperadorExpr(), gov: gobernanzaOperadorExpr() },
    visibleByDefault: radio === "LTE", popup: true,
  })),

  // ── GUIFI.NET ─────────────────────────────────────────────────────────
  {
    id: "guifi_links",
    categoria: "comunitaria",
    label: "2D links",
    sourceId: "guifi_links",
    sourceType: "geojson",
    data: "./data/guifi.net/guifi_links.geojson",
    layerType: "line",
    colorBase: { prop: "line-color",
       expr: [ 
        "case",
        ["==", ["get", "STATUS"], "Working"],
        "#2de908",
        "#98989877",],
         gov: gobernanzaColorExpr("comunitaria") },
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
    colorBase: { prop: "circle-color",
       expr: [ 
        "case",
        ["==", ["get", "STATUS"], "Working"],
        "#2de908",
        "#98989877",],
         gov: gobernanzaColorExpr("comunitaria") },
    paint: {
      "circle-radius": [
        "interpolate",
        ["linear"],
        ["zoom"],
        5,
        1,
        10,
        2,
        16,
        4,
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
    colorBase: { prop: "fill-extrusion-color",
       expr: [ 
        "case",
        ["==", ["get", "antenna_elevation"], null],
        "#ff8c11",
        "#2de908",],
         gov: gobernanzaColorExpr("comunitaria") },
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

  // ── CABLES SUBMARINOS ─────────────────────────────────────────────────
  {
    id: "cables_sub_spain",
    sourceId: "subCable_spain",
    sourceType: "geojson",
    data: "./data/subCableMap/subCable_spain.geojson",
    layerType: "line",
    filter: ["<=", ["to-number", ["get", "operative in"]], currentYear],
    colorBase: { prop: "line-color", expr: ["get", "color"] },
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
    id: "cables_sub_spain_planned",
    sourceId: "subCable_spain",
    sourceType: "geojson",
    data: "./data/subCableMap/subCable_spain.geojson",
    layerType: "line",
    filter: [">", ["to-number", ["get", "operative in"]], currentYear],
    colorBase: { prop: "line-color", expr: ["get", "color"] }, 
    paint: {
      "line-color": ["get", "color"],
      "line-width": 3,
      "line-opacity": 0.7,
      "line-dasharray": [1, 0.5],
    },
    visibleByDefault: true,
    popup: true,
    popupExclude: ["color", "coordinates", "feature_id", "id"],
  },
  /* Cables submarinos globales 
  {
    id: "cables_sub",
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
*/

  
  // ── IXP ───────────────────────────────────────────────────────────
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
      "icon-size": [
        "interpolate",
        ["linear"],
        ["zoom"],
        5,
        0.025,
        10,
        0.04,
        20,
        0.09,
      ],
      "icon-pitch-alignment": "map",
      "icon-rotation-alignment": "map",
      "icon-allow-overlap": true,
      "symbol-avoid-edges": true,
    },
    visibleByDefault: true,
    popup: true,
    popupExclude: ["url"],
  },



];

// loop para añadir al array las capas de cobertura por cada operadora
/*Object.entries(OPERADORES).forEach(([cif, op]) => {
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
*/

