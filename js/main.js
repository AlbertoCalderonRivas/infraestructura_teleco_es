// CONTROLS //

map.addControl(
  new maplibregl.ScaleControl({ maxWidth: 300, unit: "metric" }),
  "bottom-left",
);
map.addControl(
  new maplibregl.NavigationControl({
    visualizePitch: false,
    showZoom: false,
    showCompass: true,
  }),
  "top-right",
);

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

  await cargarIcono("icono-antena_LTE", "icons/LTE.png", { sdf: true });
  await cargarIcono("icono-antena_NR", "icons/NR.png", { sdf: true });
  await cargarIcono("icono-ixp", "icons/ixp.png", { sdf: false });

  inicializarSources();
  inicializarLayers();
  inicializarBotones();

  cargarCobertura5G();
  cargarCobertura4G();
  map.on("moveend", cargarCobertura5G);
  map.on("moveend", cargarCobertura4G);

  // Popups: solo capas marcadas con popup: true en LAYER_CONFIG
  const capasConPopup = LAYER_CONFIG.filter((c) => c.popup).map((c) => c.id);

  map.on("click", (e) => {
    const capasConPopup = LAYER_CONFIG.filter((l) => l.popup).map((l) => l.id);

    const features = map.queryRenderedFeatures(e.point, {
      layers: capasConPopup,
    });
    if (!features.length) return;

    const feature = features[0]; // solo el más arriba, si no pueden aparecer varios popups
    const capa = feature.layer.id;
    const layerConfig = LAYER_CONFIG.find((l) => l.id === capa);

    const coordenadas = e.lngLat;
    const props = { ...feature.properties };

    if (props.COBERTURA) {
      props.COBERTURA = props.COBERTURA.split(";")
        .filter((cif) => cif.trim())
        .map((cif) => OPERADORES[cif.trim()]?.nombre || cif.trim())
        .join(", ");
    }

    const excluir = [
      
      "name",
      
      ...(layerConfig?.popupExclude || []),
    ];
    const filas = Object.entries(props)
      .filter(([k]) => !excluir.includes(k))
      .map(([k, v]) => `<b>${k}:</b> ${v}`)
      .join("<br>");

    new maplibregl.Popup()
      .setLngLat(coordenadas)
      .setHTML(
        `
          <h3>${props.NODE_NAME || props.name || props.COBERTURA || ""}</h3>
          ${feature.layer.id.includes("cobertura_5g") ? `<p><strong>TECNOLOGÍA:</strong> NR 5G</p>` : feature.layer.id.includes("cobertura_4g") ? `<p><strong>TECNOLOGÍA:</strong> LTE 4G</p>` : ""}
          <p>${filas}</p>
          ${props.url ? `<a href="${props.url}" target="_blank">🔗</a>` : ""}
        `,
      )
      .addTo(map);
  });
});
