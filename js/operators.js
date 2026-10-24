// diccionarios para asociar propiedades a las capas con referencia a operadoras

// informacion extraída de einforma.com
const OPERADORES = {
  A78923125: { nombre: "Telefónica", color: "#0e66ea", clave: "Telefonica" },
  A80907397: { nombre: "Vodafone",   color: "#d72020", clave: "Vodafone"   },
  A82009812: { nombre: "Orange",     color: "#ff6a06", clave: "Orange"     },
  A20609459: { nombre: "MásMóvil",   color: "#cfac1e", clave: "Masmovil"   },
  A82528548: { nombre: "Xfera",      color: "#b226b5", clave: "Xfera"      },
};

// Operadores sin CIF (solo antenas, no cobertura)
const OPERADORES_EXTRA = {
  Digi:    { color: "#00ccff" },
  Endesa:  { color: "#00ff99" },
  Iberdrola:{ color: "#00aa44" },
  Simyo_Orange: { color: "#ff6a06" },
  KPN_Spain_Simyo_Orange: { color: "#ff6a06" },
  Iberdrola_en_desuso: { color: "#00aa44" },
};

// informacion extraida de mcc-mnc.org
const MNC_OPERADOR = {
  1: "Vodafone", 6: "Vodafone", 24: "Vodafone",
  3: "Orange", 9: "Orange",
  4: "Yoigo", 23: "Yoigo", 29: "Yoigo",
  5: "Telefonica", 7: "Telefonica", 38: "Telefonica",
  22: "Digi", 19: "KPN_Spain_Simyo_Orange",
  40: "KPN_Spain_Simyo_Orange", 99: "Iberdrola_en_desuso",
  700: "Iberdrola", 701: "Endesa",   // ?
};

// información extraida de cada operadora según su propiedad.
// telefónica se considera publica-privada porque el estado español tiene una participación del 10% de sus acciones.
const GOBERNANZA_OPERADOR = {
  Telefonica: "publica_privada", Vodafone: "privada", Orange: "privada", Yoigo: "privada",
  Digi: "privada", Endesa: "privada", Iberdrola: "privada", KPN_Spain_Simyo_Orange: "privada", Iberdrola_en_desuso: "nodata",
};

function matchPorMnc(valorDe, fallback) {
  const expr = ["match", ["get", "mnc"]];
  Object.entries(MNC_OPERADOR).forEach(([mnc, clave]) => expr.push(Number(mnc), valorDe(clave)));
  expr.push(fallback);
  return expr;
}
function colorOperadorExpr(factor = 0.65) {
  return matchPorMnc(c => oscurecerColor(colorPorClave(c), factor), "#ffffff");
}
function gobernanzaOperadorExpr() {
  return matchPorMnc(c => GOBERNANZA[GOBERNANZA_OPERADOR[c] ?? "nodata"].color, GOBERNANZA.nodata.color);
}


function colorPorClave(clave) {
  const op = Object.values(OPERADORES).find(o => o.clave === clave);
  return op?.color ?? OPERADORES_EXTRA[clave]?.color ?? "#ffffff";
}

function generarGradienteVelocidad(colorBase) {
    //funcion especifica para cobertura 5G con datos sobre velocidad
  const r = parseInt(colorBase.slice(1,3), 16);
  const g = parseInt(colorBase.slice(3,5), 16);
  const b = parseInt(colorBase.slice(5,7), 16);

  const paradas = [[0,0.1],[50,0.25],[100,0.45],[350,0.7],[500,1.0]];
  const expresion = ["step", ["get", "VELOCIDAD"], "rgba(0,0,0,0)"];
  paradas.forEach(([vel, f]) => {
    expresion.push(vel, `rgb(${Math.round(r*f)},${Math.round(g*f)},${Math.round(b*f)})`);
  });
  return expresion;
}

// funcion para oscurecer colores (usada en iconos principalmente)



function oscurecerColor(hex, factor) {
  const r = Math.round(parseInt(hex.slice(1,3), 16) * factor);
  const g = Math.round(parseInt(hex.slice(3,5), 16) * factor);
  const b = Math.round(parseInt(hex.slice(5,7), 16) * factor);
  return `rgb(${r},${g},${b})`;
}

/// colores de gobernanza y función para aplicar color

const GOBERNANZA = {
  publica:             { label: "publica",                color: "#3b3ef6" },
  publica_comunitaria: { label: "publica-comunitaria",    color: "#22cdd3" },
  comunitaria:         { label: "comunitaria",            color: "#08e97c" },
  comunitaria_privada: { label: "comunitaria-privada",    color: "#ade629" },
  privada:             { label: "privada",                color: "#ff00a2" },
  publica_privada:     { label: "publica-privada",        color: "#b007e8" },
  mixta:               { label: "mixta",                  color: "#ffffff" },
  nodata:              { label: "sin datos",              color: "#666666" },
};

function gobernanzaColorExpr(fallback = "nodata") {
  const expr = ["match", ["get", "governance"]];
  Object.entries(GOBERNANZA).forEach(([k, v]) => expr.push(k, v.color));
  expr.push(GOBERNANZA[fallback].color ?? GOBERNANZA.nodata.color); // fallback si falta la propiedad
  return expr;
}