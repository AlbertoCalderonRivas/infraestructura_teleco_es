// CONTROLS //

map.addControl(
  // escala
  new maplibregl.ScaleControl({
    maxWidth: 300,
    unit: "metric",
  }),
  "bottom-left",
);

map.addControl(
  // brújula
  new maplibregl.NavigationControl({
    visualizePitch: false,
    showZoom: false,
    showCompass: true,
  }),
  "top-right",
);

// loop map

map.on("load", async () => {
  
  map.setSky({
    "sky-color": "#1c1e287f",
    "sky-horizon-blend": 0.5,
    "horizon-color": "#61144926",
    "horizon-fog-blend": 0.5,
    "fog-color": "#1c2520",
    "fog-ground-blend": 0.5,
    "atmosphere-blend": [
      "interpolate",
      ["linear"],
      ["zoom"],
      0,
      1,
      10,
      1,
      12,
      0,
    ],
  });
  // Inicialización de fuentes y capas
  // iconos //

  await cargarIcono("icono-antena_LTE", "icons/LTE.png", { sdf: true });
  await cargarIcono("icono-antena_NR", "icons/NR.png", { sdf: true });
  console.log("icono procesado, iniciando capas...");
  inicializarSources();
  inicializarLayers();
  cargarCobertura5G();
  map.on("moveend", cargarCobertura5G);
  cargarCobertura4G();
  map.on("moveend", cargarCobertura4G);
  inicializarBotones();

  

  // Popups //

  [
    "guifi_nodos_2d",
    "ixps",
    "cobertura_5g",
    "cobertura_4g",
    "cobertura_5g_telefonica",
    "cobertura_4g_telefonica",
    "cobertura_5g_vodafone",
    "cobertura_4g_vodafone",
    "cobertura_5g_orange",
    "cobertura_4g_orange",
    "cobertura_5g_yoigo",
    "cobertura_4g_yoigo",
    "cobertura_5g_masmovil",
    "cobertura_4g_masmovil",
    "antenas",
  ].forEach((capa) => {
    map.on("click", capa, (e) => {
      const coordenadas = e.lngLat; // ← posición del click, funciona para cualquier geometría
      const props = e.features[0].properties;
      const propsLegibles = { ...props }; // copia independiente

      if (propsLegibles.COBERTURA) {
        propsLegibles.COBERTURA = propsLegibles.COBERTURA.split(";")
          .filter((cif) => cif.trim())
          .map((cif) => operadores5g[cif.trim()]?.nombre || cif.trim())
          .join(", ");
      }
      console.log(propsLegibles.COBERTURA);
      const propName = [];
      const excluir = ["NODE_NAME", "name", "url"];

      for (const prop in propsLegibles) {
        if (!excluir.includes(prop)) {
          propName.push(`<b>${prop}:</b> ${propsLegibles[prop]}`);
        }
      }
      new maplibregl.Popup()
        .setLngLat(coordenadas)
        .setHTML(
          `
                <h3>${propsLegibles.NODE_NAME || propsLegibles.name || propsLegibles.COBERTURA || ""}</h3>
                <p>${propName.join("<br>")}</p>
                ${propsLegibles.url ? `<a href="${propsLegibles.url}" target="_blank">🔗</a>` : ""}
            `,
        )
        .addTo(map);
    });
  });
});




/*map.on("zoomend", () => {
  const zoom = map.getZoom();
  if (zoom >= 6) {
    mapa2D();
  }
  else {
    mapaGlobo();
  }
});
*/

// añadir una opción para sacar las coordenadas (y copiarlas al portapapeles) al hacer click derecho
