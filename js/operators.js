// diccionarios para asociar propiedades a las capas con referencia a operadoras

const OPERADORES = {
  A78923125: { nombre: "Telefónica", color: "#0e66ea", clave: "Telefonica" },
  A80907397: { nombre: "Vodafone",   color: "#d72020", clave: "Vodafone"   },
  A82009812: { nombre: "Orange",     color: "#ff6a06", clave: "Orange"     },
  A20609459: { nombre: "MásMóvil",   color: "#cfac1e", clave: "Masmovil"   },
  A82528548: { nombre: "Yoigo",      color: "#b226b5", clave: "Yoigo"      },
};

// Operadores sin CIF (solo antenas, no cobertura)
const OPERADORES_EXTRA = {
  Digi:    { color: "#00ccff" },
  Endesa:  { color: "#00ff99" },
  Iberdrola:{ color: "#00aa44" },
  mnc_40:  { color: "#aaaaaa" },
  mnc_99:  { color: "#666666" },
};

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