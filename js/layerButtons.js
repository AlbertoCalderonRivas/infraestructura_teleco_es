function inicializarBotones() {
  // Toggle del menú de capas
  const botonMenu = document.getElementById("layer-button");
  const menuCapas = document.getElementById("menuCapas");
  let menuAbierto = false;

  botonMenu.addEventListener("click", () => {
    menuAbierto = !menuAbierto;
    botonMenu.innerHTML = menuAbierto ? "X" : "&#10855;";
    menuCapas.classList.toggle("visible", menuAbierto);
    botonMenu.classList.toggle("visible", menuAbierto);
  });

  // Toggle de capas — lista generada desde LAYER_CONFIG
  const capas = LAYER_CONFIG;
  const capasOcultas = LAYER_CONFIG.filter((c) => !c.visibleByDefault).map(
    (c) => c.id,
  );

  capas.forEach((capa) => {
    let boton;
    if (capa.linkedTo) {
      boton = document.getElementById(capa.linkedTo);
    } else {
      boton = document.getElementById(capa.id);
    }

    if (!boton) return;
    let visible = !capasOcultas.includes(capa.id);
    boton.style.color = visible ? "white" : "gray";

    boton.addEventListener("click", () => {
      if (!map.getLayer(capa.id)) {
        console.error(`La capa "${capa.id}" no existe en el mapa.`);
        return;
      }
      visible = !visible;
      map.setLayoutProperty(
        capa.id,
        "visibility",
        visible ? "visible" : "none",
      );
      boton.style.color = visible ? "white" : "gray";
      capas
        .filter((c) => c.linkedTo === capa.id)
        .forEach((c) => {
          if (map.getLayer(c.id)) {
            map.setLayoutProperty(
              c.id,
              "visibility",
              visible ? "visible" : "none",
            );
          }
        });
    });
  });

  // Terreno 3D — caso especial porque setTerrain() no es una propiedad de capa
  let terrainEnabled = true;
  const botonHillshade = document.getElementById("hillshade");

  if (botonHillshade) {
    botonHillshade.addEventListener("click", () => {
      terrainEnabled = !terrainEnabled;
      map.setTerrain(
        terrainEnabled ? { source: "terrain-dem", exaggeration: 1 } : null,
      );
      // visibilidad de la capa hillshade ya la gestiona el toggle genérico de arriba
    });
  }

  let modoGobernanza = false;
  document
    .getElementById("toggle-gobernanza")
    .addEventListener("click", (e) => {
      modoGobernanza = !modoGobernanza;
      document.getElementById("leyenda-gobernanza").classList.toggle("visible", modoGobernanza);
      LAYER_CONFIG.forEach(({ id, colorBase }) => {
        if (!colorBase) return;
        [].concat(colorBase).forEach((cb) => {
          map.setPaintProperty(
            id,
            cb.prop,
            modoGobernanza ? (cb.gov ?? gobernanzaColorExpr()) : cb.expr,
          );
        });
      });
      e.target.textContent = modoGobernanza
        ? "no mostrar gobernanza"
        : "mostrar gobernanza";
    });

  function actualizarRangos() {
    const techs = ["LTE", "NR"].filter(
      (t) => map.getLayoutProperty(`antenas_${t}`, "visibility") === "visible",
    );
    map.setFilter("rangos", ["in", ["get", "radio"], ["literal", techs]]);
  }
  ["antenas_LTE", "antenas_NR"].forEach((id) =>
    document.getElementById(id).addEventListener("click", actualizarRangos),
  );
  actualizarRangos();
  construirLeyendaGobernanza();
}

function construirLeyendaGobernanza() {
  const cont = document.getElementById("leyenda-gobernanza");
  cont.innerHTML = Object.values(GOBERNANZA)
    .map(({ label, color }) =>
      `<div class="leyenda-item"><i style="background:${color}"></i>${label}</div>`)
    .join("");
}