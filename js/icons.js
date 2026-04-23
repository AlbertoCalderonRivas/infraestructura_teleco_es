async function cargarIcono(nombre, ruta, opciones = {}) {
  try {
    const imagen = await map.loadImage(ruta);
    map.addImage(nombre, imagen.data, opciones);
    console.log(`Icono "${nombre}" cargado correctamente`);
  } catch (error) {
    console.warn(`No se pudo cargar el icono "${nombre}":`, error);
  }
}

function oscurecerColor(hex, factor) {
  const r = Math.round(parseInt(hex.slice(1,3), 16) * factor);
  const g = Math.round(parseInt(hex.slice(3,5), 16) * factor);
  const b = Math.round(parseInt(hex.slice(5,7), 16) * factor);
  return `rgb(${r},${g},${b})`;
}