//Configuración inicial del mapa : estilos y colores base

const map = new maplibregl.Map({
  container: "mapa",
  center: [-4.663, 40.41979], // coordenadas de inicio (centro de Madrid)
  zoom: 5.3, // zoom inicial
  pitch: 0, // inclinación para vista 3D
  hash: true,
  maxZoom: 20,
  maxPitch: 85,
  style: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json", //  estilo de fondo
});


