// Genera el menú de capas desde data/layerInfo.json
// y gestiona el panel de información (botón "i") de cada capa.
//
// Debe ejecutarse ANTES de inicializarBotones(), porque esta busca los botones por id.

const LAYER_INFO_URL = "./data/layerInfo.json";
let LAYER_INFO = { meta: {}, groups: {}, layers: {} };

let panelInfo = null;
let infoAbiertaId = null;

// helper para crear elementos de forma segura (textContent, nunca innerHTML)
function el(tag, clase, texto) {
  const nodo = document.createElement(tag);
  if (clase) nodo.className = clase;
  if (texto !== undefined) nodo.textContent = texto;
  return nodo;
}

async function construirMenu() {
  const contenedor = document.getElementById("menu-grupos");

  try {
    const res = await fetch(LAYER_INFO_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    LAYER_INFO = await res.json();
  } catch (err) {
    console.error("No se pudo cargar layerInfo.json:", err);
    contenedor.textContent = "no se pudo cargar el menú de capas";
    return;
  }

  validarContraLayerConfig();

  // un <details> por grupo, en el orden en que aparecen en "groups"
  Object.entries(LAYER_INFO.groups).forEach(([gid, grupo]) => {
    const capas = Object.entries(LAYER_INFO.layers).filter(
      ([, capa]) => capa.group === gid,
    );
    if (!capas.length) return;

    const details = document.createElement("details");
    details.open = !!grupo.open;

    const summary = el("summary", null, grupo.title);
    summary.setAttribute("role", "heading");
    summary.setAttribute("aria-level", "1");
    details.append(summary);

    capas.forEach(([id, capa]) => details.append(crearFila(id, capa)));
    contenedor.append(details);
  });

  crearPanelInfo();
}

// avisa por consola de desajustes entre el JSON y LAYER_CONFIG
function validarContraLayerConfig() {
  const idsConfig = new Set(LAYER_CONFIG.map((c) => c.id));
  const idsMenu = new Set(Object.keys(LAYER_INFO.layers));

  idsMenu.forEach((id) => {
    if (!idsConfig.has(id))
      console.warn(`layerInfo.json: "${id}" no existe en LAYER_CONFIG`);
  });
  idsConfig.forEach((id) => {
    if (!idsMenu.has(id))
      console.warn(`LAYER_CONFIG: "${id}" no tiene entrada en layerInfo.json (no tendrá botón)`);
  });
  Object.entries(LAYER_INFO.layers).forEach(([id, capa]) => {
    if (!LAYER_INFO.groups[capa.group])
      console.warn(`layerInfo.json: "${id}" usa el grupo inexistente "${capa.group}"`);
  });
}

// fila = botón de capa (con el id de la capa, como antes) + botón "i"
function crearFila(id, capa) {
  const fila = el("div", "layer-row");

  const boton = el("button", null, capa.label ?? id);
  boton.id = id;
  fila.append(boton);

  if (capa.info) {
    const botonInfo = el("button", "layer-info-btn", "i");
    botonInfo.type = "button";
    botonInfo.setAttribute("aria-label", `información sobre ${capa.label ?? id}`);
    botonInfo.addEventListener("click", () => alternarInfo(id, botonInfo));
    fila.append(botonInfo);
  }
  return fila;
}

// ── PANEL DE INFORMACIÓN ────────────────────────────────────────────────

function crearPanelInfo() {
  panelInfo = el("aside", "layer-info-panel");
  panelInfo.id = "layer-info-panel";
  panelInfo.setAttribute("role", "dialog");
  document.querySelector(".info").append(panelInfo);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") cerrarInfo();
  });
  // si se cierra el menú de capas, el panel se cierra con él
  document.getElementById("layer-button").addEventListener("click", cerrarInfo);
}

function cerrarInfo() {
  if (!panelInfo) return;
  panelInfo.classList.remove("visible");
  infoAbiertaId = null;
  document
    .querySelectorAll(".layer-info-btn.activo")
    .forEach((b) => b.classList.remove("activo"));
}

function alternarInfo(id, botonInfo) {
  const repetido = infoAbiertaId === id;
  cerrarInfo();
  if (repetido) return;

  rellenarPanel(LAYER_INFO.layers[id]);
  panelInfo.classList.add("visible");
  botonInfo.classList.add("activo");
  infoAbiertaId = id;
}

function rellenarPanel(capa) {
  const info = capa.info;

  const cerrar = el("button", "layer-info-close", "×");
  cerrar.type = "button";
  cerrar.setAttribute("aria-label", "cerrar");
  cerrar.addEventListener("click", cerrarInfo);

  panelInfo.replaceChildren(cerrar, el("h3", null, capa.label));

  if (info.description) panelInfo.append(el("p", "layer-info-desc", info.description));

  const dl = el("dl");
  const añadir = (etiqueta, contenido) => {
    dl.append(el("dt", null, etiqueta));
    dl.append(contenido instanceof Node ? contenido : el("dd", null, contenido));
  };

  // fuente (+ enlaces)
  if (info.source) {
    const dd = el("dd", null, info.source);
    [].concat(info.link ?? []).forEach((url) => {
      const a = el("a", null, "🔗");
      a.href = url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      dd.append(" ", a);
    });
    añadir("fuente", dd);
  }

  if (info.license) añadir("licencia", info.license);
  if (info.date) añadir("datos de", info.date);

  // fiabilidad: puntos (1-5) + etiqueta de la escala + nota
  if (info.fiability) {
    const { level, note } = info.fiability;
    const max = 5;
    const n = Math.max(0, Math.min(max, Number(level) || 0));
    const dd = el("dd");

    const puntos = el("span", "fiab-puntos", "●".repeat(n) + "○".repeat(max - n));
    puntos.setAttribute("aria-label", `${n} de ${max}`);
    dd.append(puntos);

    const etiquetaNivel = LAYER_INFO.meta?.fiabilityScale?.[n - 1];
    if (etiquetaNivel) dd.append(` ${etiquetaNivel}`);
    if (note) dd.append(el("div", "fiab-nota", note));
    añadir("fiabilidad", dd);
  }

  if (info.limitations) añadir("limitaciones", info.limitations);
  if (info.moreinfo) añadir("más info", info.moreinfo);

  panelInfo.append(dl);
}
