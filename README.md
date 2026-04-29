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
| Cables submarinos | Líneas | TeleGeography – Submarine Cable Map |
| Edificios 3D | Vector tiles | MapTiler |
| Terreno 3D | Raster DEM | MapTiler |

---

## Stack técnico

- **[MapLibre GL JS](https://maplibre.org/)** — renderizado de mapas vectoriales
- **[PMTiles](https://protomaps.com/docs/pmtiles)** — formato de tiles locales sin servidor
- **[Tippecanoe](https://github.com/felt/tippecanoe)** — conversión GeoJSON → PMTiles
- **[GeoPandas](https://geopandas.org/) + [Shapely](https://shapely.readthedocs.io/)** — procesado y filtrado espacial de datos
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
### Cables submarinos
Los datos de trazado de cables submarinos proceden del dataset público de [Submarine Cable Map](https://www.submarinecablemap.com/) (TeleGeography), distribuido en formato GeoJSON. Se descarga manualmente y se filtra para incluir únicamente los cables cuya geometría intersecta con el territorio español con un script de Python.
 
> **Nota sobre licencia:** TeleGeography no documenta explícitamente los términos de uso de su dataset público. Los datos se utilizan en este proyecto exclusivamente con fines de investigación académica sin ánimo de lucro, con atribución explícita a la fuente.

## Límite territorial de referencia
 
Para operaciones de filtrado espacial (recorte de datasets internacionales al territorio español) se utiliza la capa de **Unidades Administrativas de primer orden** del IGN, descargable desde el [Centro de Descargas del CNIG](https://centrodedescargas.cnig.es/). Esta capa cubre el territorio nacional completo en el sistema de referencia ETRS89 (EPSG:4258), conforme a la directiva INSPIRE.

---

## Instalación

1. Clona el repositorio
2. en `js/keis.js` añade tu API key de MapTiler
3. Sirve el proyecto desde un servidor local (necesario para PMTiles)

```bash
# Ejemplo con Python
python -m http.server 8000
```


---

## Documentación

[Arquitectura de proyecto](./documentation/ARCHITECTURE.md)

## Fuentes y licencias

| Fuente | Licencia |
|---|---|
| [PeeringDB](https://www.peeringdb.com/) | CC BY-SA 4.0 |
| [guifi.net](https://guifi.net/) | CXSC (Comuns de Xarxes Sense Cables) |
| [OpenCelliD](https://www.opencellid.org/) | CC BY-SA 4.0 |
| [SETELECO – Cobertura móvil 4G/5G](https://avance.digital.gob.es/banda-ancha/cobertura/) | Pendiente de confirmación — datos públicos del Ministerio para la Transformación Digital |
| [TeleGeography – Submarine Cable Map](https://www.submarinecablemap.com/) | Pendiente de confirmación — uso académico sin ánimo de lucro, con atribución |
| [IGN – Unidades Administrativas](https://centrodedescargas.cnig.es/) | Reutilización de información del sector público (Real Decreto 1495/2011) |
| [MapTiler](https://www.maptiler.com/) | Licencia comercial |

---

## Contexto académico

Proyecto desarrollado como parte de una tesis doctoral en Arquitectura. El enfoque no es exclusivamente técnico: la investigación atiende a las implicaciones espaciales, urbanas y territoriales de la infraestructura de red, y a la distinción entre modelos de gestión comunitaria, pública y privada.

---

*Proyecto sin ánimo de lucro. Uso exclusivamente académico.*
**Autoría**: Alberto Calderón Rivas
**web**: [calde-core](https://www.calde-core.com)