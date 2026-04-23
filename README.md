# Infraestructura Física de Internet en España
### Visualización Comparativa: Redes Comunitarias · Públicas · Privadas

Herramienta de visualización cartográfica interactiva desarrollada en el contexto de una tesis doctoral en Arquitectura. El proyecto representa y contrasta la infraestructura física de Internet en España, prestando especial atención a la dimensión espacial, urbana y arquitectónica de cables, antenas y nodos de red.

---

## Capas de datos

| Capa | Tipo | Fuente |
|------|------|--------|
| Puntos de intercambio (IXPs) | Puntos | PeeringDB API |
| Nodos y enlaces guifi.net | Puntos / Líneas | guifi.net GML/CNML |
| Cobertura 4G | Polígonos | SETELECO vía ArcGIS |
| Cobertura 5G | Polígonos | SETELECO vía ArcGIS |
| Antenas (celdas LTE/NR) | Puntos (PMTiles) | OpenCelliD |
| Edificios 3D | Vector tiles | MapTiler |
| Terreno 3D | Raster DEM | MapTiler |

---

## Stack técnico

- **[MapLibre GL JS](https://maplibre.org/)** — renderizado de mapas vectoriales
- **[PMTiles](https://protomaps.com/docs/pmtiles)** — formato de tiles locales sin servidor
- **[Tippecanoe](https://github.com/felt/tippecanoe)** — conversión GeoJSON → PMTiles
- **Python** — procesado y transformación de datos
- **MapTiler** — tiles base, edificios 3D y terreno

---

## Metodología de datos

### guifi.net
Los datos de nodos y enlaces se obtienen desde los endpoints GML y CNML de la API de guifi.net. Scripts de Python transforman estos formatos a GeoJSON. Se generan dos variantes: una para representación 2D y otra para 3D con altura de antena.

### Cobertura 4G / 5G
Datos extraídos del visor oficial de cobertura de la Secretaría de Estado de Telecomunicaciones e Infraestructuras Digitales (SETELECO), accediendo directamente a los servicios ArcGIS subyacentes (`services9.arcgis.com/b5sc9d51LIwFoyfR`). Se cargan dinámicamente por bbox según la vista actual del mapa.

> **Nota sobre licencia:** Se ha contactado directamente con SETELECO para confirmar las condiciones de uso y reutilización de estos datos en el contexto de investigación académica sin ánimo de lucro. Pendiente de respuesta.

### OpenCelliD (antenas)
Descarga de los CSV de antenas para España. Conversión a GeoJSON mediante script Python y posterior generación de PMTiles con Tippecanoe, con rango de zoom 8–16.

```bash
tippecanoe -o antenas.pmtiles -z16 -Z8 -l antenas \
  --no-tile-size-limit --no-feature-limit antenas_es.geojson
```

---

## Instalación

1. Clona el repositorio
2. en `js/keis.js` añade tu API key de MapTiler
3. Sirve el proyecto desde un servidor local (necesario para PMTiles)

```bash
# Ejemplo con Python
python -m http.server 8000
```

> Los archivos GeoJSON de gran tamaño no están incluidos en el repositorio. Ver sección de fuentes para obtenerlos.

---

## Fuentes y licencias

| Fuente | Licencia |
|---|---|
| [PeeringDB](https://www.peeringdb.com/) | CC BY-SA 4.0 |
| [guifi.net](https://guifi.net/) | CXSC (Comuns de Xarxes Sense Cables) |
| [OpenCelliD](https://www.opencellid.org/) | CC BY-SA 4.0 |
| [SETELECO – Cobertura móvil 4G/5G](https://avance.digital.gob.es/banda-ancha/cobertura/) | Pendiente de confirmación — datos públicos del Ministerio para la Transformación Digital |
| [MapTiler](https://www.maptiler.com/) | Licencia comercial |

---

## Contexto académico

Proyecto desarrollado como parte de una tesis doctoral en Arquitectura. El enfoque no es exclusivamente técnico: la investigación atiende a las implicaciones espaciales, urbanas y territoriales de la infraestructura de red, y a la distinción entre modelos de gestión comunitaria, pública y privada.

---

*Proyecto sin ánimo de lucro. Uso exclusivamente académico.*