//definición de capas y propiedades base

function inicializarLayers() {
  // BASE PROPERTIES //

  map.setPaintProperty("water", "fill-color", "#03275a66");
  map.setPaintProperty("water_shadow", "fill-color", "#050d0588");
  map.setPaintProperty("waterway", "line-color", "#03275a66");
  map.setPaintProperty("road_path", "line-color", "#440044");
  map.setPaintProperty(
    "road_mot_fill_noramp",
    "line-color",
    "rgba(55, 61, 88, 1)",
  );

  const mostrarMVP = true;

  if (mostrarMVP) {
    // TERRAIN //
    map.setTerrain({
      source: "terrain-dem",
      exaggeration: 1,
    });

    // LAYERS //
    map.addLayer({
      // capa de sombra para el relieve del terreno
      id: "hillshade",
      type: "hillshade",
      source: "terrain-dem",
      paint: {
        "hillshade-illumination-direction": 195,
        "hillshade-exaggeration": 0.4,
        "hillshade-shadow-color": "#001133",
        "hillshade-highlight-color": "#cbc7fc",
        "hillshade-accent-color": "#ff00aa",
      },
    });

    // COBERTURA //

    map.addLayer({
      id: "cobertura_5g",
      type: "fill",
      source: "cobertura_5g",
      filter: [">=", "VELOCIDAD", 48],
      minzoom: 13,
      paint: {
        "fill-color": generarGradienteVelocidad(operadores5g.x.color),
        "fill-opacity": 1,
      },
    });

    map.addLayer({
      id: "cobertura_4g",
      type: "fill",
      source: "cobertura_4g",
      minzoom: 13,
      paint: {
        "fill-color": operadores5g.x.color,
        "fill-opacity": 1,
      },

      layout: { visibility: "none" },
    });

    // Telefónica
    //5g

    map.addLayer({
      id: "cobertura_5g_telefonica",
      type: "fill",
      source: "cobertura_5g",
      minzoom: 13,
      filter: [
        "all",
        [">=", ["get", "VELOCIDAD"], 48],
        [">", ["index-of", "A78923125", ["get", "COBERTURA"]], -1],
      ],
      paint: {
        "fill-color": generarGradienteVelocidad(operadores5g.A78923125.color),
        "fill-opacity": 1,
      },

      layout: { visibility: "none" },
    });

    //4g

    map.addLayer({
      id: "cobertura_4g_telefonica",
      type: "fill",
      source: "cobertura_4g",
      minzoom: 13,

      filter: [
        "all",
        [">", ["index-of", "A78923125", ["get", "COBERTURA"]], -1],
      ],
      paint: {
        "fill-color": operadores5g.A78923125.color,
        "fill-opacity": 1,
      },

      layout: { visibility: "none" },
    });

    // Vodafone
    //5g

    map.addLayer({
      id: "cobertura_5g_vodafone",
      type: "fill",
      source: "cobertura_5g",
      minzoom: 13,
      filter: [
        "all",
        [">=", ["get", "VELOCIDAD"], 48],
        [">", ["index-of", "A80907397", ["get", "COBERTURA"]], -1],
      ],
      paint: {
        "fill-color": generarGradienteVelocidad(operadores5g.A80907397.color),
        "fill-opacity": 1,
      },

      layout: { visibility: "none" },
    });

    //4g

    map.addLayer({
      id: "cobertura_4g_vodafone",
      type: "fill",
      source: "cobertura_4g",
      minzoom: 13,

      filter: [
        "all",
        [">", ["index-of", "A80907397", ["get", "COBERTURA"]], -1],
      ],
      paint: {
        "fill-color": operadores5g.A80907397.color,
        "fill-opacity": 1,
      },

      layout: { visibility: "none" },
    });

    // Orange
    //5g

    map.addLayer({
      id: "cobertura_5g_orange",
      type: "fill",
      source: "cobertura_5g",
      minzoom: 13,
      filter: [
        "all",
        [">=", ["get", "VELOCIDAD"], 48],
        [">", ["index-of", "A82009812", ["get", "COBERTURA"]], -1],
      ],
      paint: {
        "fill-color": generarGradienteVelocidad(operadores5g.A82009812.color),
        "fill-opacity": 1,
      },

      layout: { visibility: "none" },
    });

    //4g

    map.addLayer({
      id: "cobertura_4g_orange",
      type: "fill",
      source: "cobertura_4g",
      minzoom: 13,

      filter: [
        "all",
        [">", ["index-of", "A82009812", ["get", "COBERTURA"]], -1],
      ],
      paint: {
        "fill-color": operadores5g.A82009812.color,
        "fill-opacity": 1,
      },

      layout: { visibility: "none" },
    });

    // Yoigo
    //5g

    map.addLayer({
      id: "cobertura_5g_yoigo",
      type: "fill",
      source: "cobertura_5g",
      minzoom: 13,
      filter: [
        "all",
        [">=", ["get", "VELOCIDAD"], 48],
        [">", ["index-of", "A82528548", ["get", "COBERTURA"]], -1],
      ],
      paint: {
        "fill-color": generarGradienteVelocidad(operadores5g.A82528548.color),
        "fill-opacity": 1,
      },

      layout: { visibility: "none" },
    });

    //4g

    map.addLayer({
      id: "cobertura_4g_yoigo",
      type: "fill",
      source: "cobertura_4g",
      minzoom: 13,

      filter: [
        "all",
        [">", ["index-of", "A82528548", ["get", "COBERTURA"]], -1],
      ],
      paint: {
        "fill-color": operadores5g.A82528548.color,
        "fill-opacity": 1,
      },

      layout: { visibility: "none" },
    });

    // Masmovil
    //5g

    map.addLayer({
      id: "cobertura_5g_masmovil",
      type: "fill",
      source: "cobertura_5g",
      minzoom: 13,
      filter: [
        "all",
        [">=", ["get", "VELOCIDAD"], 48],
        [">", ["index-of", "A20609459", ["get", "COBERTURA"]], -1],
      ],
      paint: {
        "fill-color": generarGradienteVelocidad(operadores5g.A20609459.color),
        "fill-opacity": 1,
      },

      layout: { visibility: "none" },
    });

    //4g

    map.addLayer({
      id: "cobertura_4g_masmovil",
      type: "fill",
      source: "cobertura_4g",
      minzoom: 13,

      filter: [
        "all",
        [">", ["index-of", "A20609459", ["get", "COBERTURA"]], -1],
      ],
      paint: {
        "fill-color": operadores5g.A20609459.color,
        "fill-opacity": 1,
      },

      layout: { visibility: "none" },
    });

    map.addLayer({
      // capa de edificios en 3D
      id: "edificios-3d",
      type: "fill-extrusion",
      source: "maptiler",
      "source-layer": "building",
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
    });

    map.addLayer({
      id: "guifi_nodos_2d",
      type: "circle",
      source: "guifi_nodos_2d",
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
          "#989898",
        ],

        "circle-pitch-alignment": "map",
        "circle-pitch-scale": "map",
      },
    });

    map.addLayer({
      id: "guifi_nodos_3d",
      type: "fill-extrusion",
      source: "guifi_nodos_3d",
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
    });

    map.addLayer({
      // capa de enlaces guifi.net
      id: "guifi_links",
      type: "line",
      source: "guifi_links",

      paint: {
        "line-color": "#00ff15a9",
        "line-width": 2,
        "line-opacity": 0.7,
      },
    });

    map.addLayer({
      // capa de puntos de intercambio de internet
      id: "ixps",
      type: "circle",
      source: "ixps",
      paint: {
        "circle-radius": ["interpolate", ["linear"], ["zoom"], 5, 6, 20, 25],
        "circle-color": "#56a2ff",
        "circle-stroke-color": "#000000",
        "circle-stroke-width": 3,
        "circle-pitch-alignment": "map",
        "circle-pitch-scale": "map",
      },
    });
  }

  // capa de antenas de telefonía móvil
// Colores por operadora
const coloresAntenas = {
  Telefonica: "#0066ff",
  Vodafone: "#ff0000",
  Orange: "#ff6600",
  Yoigo: "#ce2ad1",
  Digi: "#00ccff",
  Endesa: "#00ff99",
  Iberdrola: "#00aa44",
  mnc_40: "#aaaaaa",
  mnc_99: "#666666",
};

const capasAntenas = [
  // LTE
  "Digi_LTE", "Endesa_LTE", "Iberdrola_LTE",
  "mnc_40_LTE", "mnc_99_LTE", "Orange_LTE",
  "Telefonica_LTE", "Vodafone_LTE", "Yoigo_LTE",
  // NR
  "Orange_NR", "Telefonica_NR", "Vodafone_NR",
];

capasAntenas.forEach((id) => {
  const operadora = id.replace("_LTE", "").replace("_NR", "");
  const color = coloresAntenas[operadora] || "#ffffff";
  const icono = id.endsWith("_NR") ? "icono-antena_NR" : "icono-antena_LTE";

  map.addLayer({
    id: id,
    type: "symbol",
    source: id,
    "source-layer": "antenas",
    layout: {
      "icon-image": icono,
      "icon-size": ["interpolate", ["linear"], ["zoom"], 0, 0.03, 8, 0.02, 16, 0.15],
      "icon-allow-overlap": true,
      "visibility": "none",
    },
    paint: {
      "icon-color": oscurecerColor(color, 0.65),
      
    },
  });
});

  /// falta incluir fibra y coaxial
  // las saco de aqui: https://services9.arcgis.com/b5sc9d51LIwFoyfR/ArcGIS/rest/services

  /// añadir cables submarinos también por operadora

  //// Pues creo que necesito una solución doble, por un lado el geojson estático lo necesito completo porque en algún momento quiero hacer análisis de las infraestructuras (como por ejemplo mapas de calor a escala nacional donde se vea donde hay mayor concentración) pero para visualizarlo con que aparezcan a zoom cercano me sirve por lo que la tercera opción (Tile Vector) me encantaría poder implementarla (sobretodo proque habrá más datos en el futuro que tenga que hacer similarmente) Además no me preocupa demasiado ahora mismo la eficiencia de carga del mapa ya que esta web es solo para usarla en local por mí de linea de comandos/python he trabajado con ello en el pasado, pero no diría que tengo fluidez en los comandos específicos
}
