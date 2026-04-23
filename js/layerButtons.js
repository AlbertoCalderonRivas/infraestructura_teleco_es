function inicializarBotones() {
  // botón para mostrar/ocultar gestor de capas

  const botonCapas = document.getElementById("layer-button");
  const menuCapas = document.getElementById("menuCapas");
  let estado = false;
  if (!botonCapas) {
    console.warn(`No se encontró botón con id "${idCapa}"`);
    return;
  }
  botonCapas.addEventListener("click", () => {
    estado = !estado;
    botonCapas.innerHTML = estado ? "X" : "&#10855;";
    menuCapas.classList.toggle("visible");
    botonCapas.classList.toggle("visible");
  });

  // Lista de capas que tendrán botón de toggle
  const capas = [
    "edificios-3d",
    "hillshade",
    "ixps",
    "guifi_links",
    "guifi_nodos_2d",
    "guifi_nodos_3d",
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
    "Digi_LTE",
    "Endesa_LTE",
    "Iberdrola_LTE",
    "mnc_40_LTE",
    "mnc_99_LTE",
    "Orange_LTE",
    "Telefonica_LTE",
    "Vodafone_LTE",
    "Yoigo_LTE",
    "Orange_NR",
    "Telefonica_NR",
    "Vodafone_NR",
  ];

  const capasOcultas = [
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
    "Digi_LTE",
    "Endesa_LTE",
    "Iberdrola_LTE",
    "mnc_40_LTE",
    "mnc_99_LTE",
    "Orange_LTE",
    "Telefonica_LTE",
    "Vodafone_LTE",
    "Yoigo_LTE",
    "Orange_NR",
    "Telefonica_NR",
    "Vodafone_NR",
  ];

  capas.forEach((idCapa) => {
    const boton = document.getElementById(idCapa);
    if (!boton) {
      console.warn(`No se encontró botón con id "${idCapa}"`);
      return;
    }
    let visible = !capasOcultas.includes(idCapa);
    boton.style.color = visible ? "white" : "gray";
    boton.addEventListener("click", () => {
      if (!map.getLayer(idCapa)) {
        console.error(`La capa "${idCapa}" no existe en el mapa.`);
        return;
      }
      // Alternar visibilidad
      visible = !visible;
      map.setLayoutProperty(idCapa, "visibility", visible ? "visible" : "none");
      // Cambiar estilo del botón para feedback visual
      boton.classList.toggle("activo", visible);

      boton.style.color = visible ? "white" : "gray";
    });
  });

  // gestionar terreno

  let terrainEnabled = true;

  document.getElementById("hillshade").addEventListener("click", () => {
    if (terrainEnabled) {
      map.setTerrain(null); // desactiva el relieve 3D
    } else {
      map.setTerrain({ source: "terrain-dem", exaggeration: 1 }); // reactiva
    }
    terrainEnabled = !terrainEnabled;
  });
}
