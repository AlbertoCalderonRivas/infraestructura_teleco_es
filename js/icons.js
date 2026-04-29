async function cargarIcono(nombre, ruta, opciones = {}) {
  try {
    const imagen = await map.loadImage(ruta);
    map.addImage(nombre, imagen.data, opciones);
    console.log(`Icono "${nombre}" cargado correctamente`);
  } catch (error) {
    console.warn(`No se pudo cargar el icono "${nombre}":`, error);
  }
}