//definición de capas y propiedades base

function inicializarLayers() {

  // Propiedades base del estilo
  map.setPaintProperty("water", "fill-color", "#03275a66");
  map.setPaintProperty("water_shadow", "fill-color", "#050d0588");
  map.setPaintProperty("waterway", "line-color", "#03275a66");
  map.setPaintProperty("road_path", "line-color", "#440044");
  map.setPaintProperty("road_mot_fill_noramp", "line-color", "rgba(55, 61, 88, 1)");

  map.setTerrain({ source: "terrain-dem", exaggeration: 1 });

  // Capas generadas desde LAYER_CONFIG
  LAYER_CONFIG.forEach(({ id, sourceId, sourceLayer, layerType, filter, minzoom, paint, layout, visibleByDefault }) => {

    const layerDef = {
      id,
      type: layerType,
      source: sourceId,
      paint: paint ?? {},
    };

    if (sourceLayer) layerDef["source-layer"] = sourceLayer;
    if (filter)      layerDef.filter = filter;
    if (minzoom)     layerDef.minzoom = minzoom;

    layerDef.layout = {
      ...(layout ?? {}),
      visibility: visibleByDefault ? "visible" : "none",
    };

    map.addLayer(layerDef);
  });
}
