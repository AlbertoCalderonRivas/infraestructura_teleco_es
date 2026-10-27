# Infraestructura de transmisión de Internet en España / Internet Transmission Infrastructure in Spain

### Cartografía crítica según quién gobierna la infraestructura: pública, privada, comunitaria o mixta
### A critical cartography by who governs the infrastructure: public, private, community or mixed

[Castellano](#castellano) | [English](#english)

---

## Castellano

Herramienta de cartografía web interactiva y de código abierto que reúne la infraestructura de transmisión de Internet en España y clasifica cada capa según su modelo de gobernanza. Se ha desarrollado en el marco de una investigación doctoral en arquitectura, mediante investigación a través del diseño (*research through design*) y cartografía crítica.


### Objetivo de la investigación

La infraestructura física de Internet constituye una capa fundacional del territorio contemporáneo. Sin embargo, su sustrato de transmisión permanece opaco al escrutinio democrático. La investigación sostiene que cartografiar esta infraestructura según quién la gobierna es una práctica de diseño democrático.

Siguiendo a Lefebvre y Purcell, la investigación entiende la democracia aplicada al espacio como el derecho de quienes lo habitan a participar en las decisiones que lo producen y a apropiárselo. Esa definición se traduce en tres condiciones verificables en la propia herramienta, que corresponden a tres momentos de la agencia ciudadana: conocer, juzgar y actuar.

- **Legible.** Debe poder saberse quién construye y gobierna cada elemento.
- **Comparable.** Los modelos de gobernanza deben poder situarse uno junto a otro, sobre el mismo territorio y en el mismo formato.
- **Apropiable.** El conocimiento producido y la herramienta que lo produce deben poder reutilizarse y ampliarse sin depender de sus autores.

El Estado publica mapas de cobertura para que las personas consumidoras comparen ofertas en su dirección postal. Esta herramienta reorganiza esos mismos datos, junto con fuentes comunitarias y privadas, para que la ciudadanía pueda comparar modelos de gobernanza sobre el territorio.

La construcción de la herramienta obligó a distinguir dos ejes de gobernanza, que solo coinciden en la capa comunitaria:

1. **Gobernanza de la infraestructura.** Quién posee, opera y toma decisiones sobre un cable, una antena o un nodo. La herramienta la clasifica en cuatro modelos (pública, privada, comunitaria o mixta), con la propiedad como criterio principal.
2. **Gobernanza del dato.** Quién produce el registro de dónde está la infraestructura, con qué licencia, con qué resolución y con qué frecuencia. Se documenta en la ficha informativa de cada capa y en este repositorio.

### Descripción de la herramienta

La herramienta es una aplicación web de cartografía interactiva para visualizar y comparar la infraestructura física de Internet en España según el modelo de gobernanza de cada elemento. Es un sitio web estático escrito en HTML y JavaScript con la biblioteca de código abierto MapLibre GL JS.

- **Capas por elemento infraestructural.** Un menú organiza las capas por elemento y permite activarlas y desactivarlas en paralelo, sobre el mismo territorio y el mismo mapa base.
- **Fichas informativas.** Un botón de información junto a cada capa muestra la descripción del elemento, la fuente de los datos, la licencia de uso, la fecha, la fiabilidad y las limitaciones encontradas.
- **Ventanas emergentes.** Al pulsar sobre un elemento se muestran sus atributos. Los identificadores oficiales se traducen a nombres comprensibles: por ejemplo, la operadora aparece con su nombre comercial en lugar de su CIF o su código de red móvil (MNC). Cuando se dispone de ella, se muestra información sobre propiedad, proveedores y financiación.
- **Modo de gobernanza.** Colorea los elementos según su modelo de gobernanza, con la leyenda correspondiente. El esquema de color simplifica, y declara que lo hace; la información detallada se ofrece en las fichas.
- **Representación tridimensional.** Las capas se superponen a un modelo 3D del terreno y de los volúmenes edificados, lo que permite leer el mapa a escala nacional, comarcal y de edificio.
- **Ausencias visibles.** Las capas que no han podido obtenerse aparecen desactivadas en el menú, con una ficha que explica el motivo y la normativa que restringe su acceso.
- **Extensible.** Cada capa se declara como un objeto de configuración. Incorporar un conjunto de datos solo requiere declarar su fuente y escribir ese objeto (véase la [documentación técnica](./documentation/ARCHITECTURE.md)).

Las capas obtienen sus datos de dos maneras. Algunas consultan APIs de forma dinámica desde el navegador, lo que permite disponer de datos actualizados. Otras usan conjuntos de datos descargados y almacenados en el repositorio, en GeoJSON o, para conjuntos de puntos muy grandes, en PMTiles; estas requieren actualización manual.

### Alcance

La herramienta cubre la infraestructura de transmisión de Internet, es decir, los elementos a través de los cuales los datos viajan de un lugar a otro.

- **Incluye:** cables submarinos; antenas de telefonía móvil (LTE y NR) con su alcance estimado; cobertura 4G y 5G por operadora; puntos de intercambio de Internet (IXP); nodos y enlaces de la red comunitaria guifi.net.
- **Excluye, por el criterio de selección:** el almacenamiento y la computación (centros de datos, servidores de nombres, alojamiento), la infraestructura satelital y los residuos electrónicos.
- **Ausentes por falta de datos reutilizables:** las rutas de fibra óptica y la red académica RedIRIS (véase [Capas ausentes](#capas-ausentes)).

### Capas de datos

| Capa | Gobernanza de la infraestructura | Fuente y gobernanza del dato | Formato y carga | Datos de |
|---|---|---|---|---|
| Nodos y enlaces de guifi.net | Comunitaria; mixta en colaboraciones con municipios | API pública de guifi.net. Comunitaria: producida por la propia red | GeoJSON local (convertido desde GML/CNML) | 2026 |
| Antenas móviles (LTE, NR) y alcance estimado | Privada (operadoras); mixta (operadoras con participación del Estado) | OpenCelliD. Comunitaria: aportaciones de voluntariado | PMTiles local | 2026 |
| Puntos de intercambio de Internet (IXP) | Mixta (operadoras privadas, asociaciones y consorcios públicos) | PeeringDB. Comunitaria: registro mantenido por la comunidad | API, consulta dinámica | Tiempo real |
| Cobertura 4G y 5G por operadora | Privada (operadoras); mixta (operadoras con participación del Estado) | SETELECO. Pública | Servicios ArcGIS, carga dinámica según la extensión visible | 30 de junio de 2024 |
| Cables submarinos | Privada o mixta (consorcios) | TeleGeography. Privada | GeoJSON local | Versión anterior a 2022, con verificación manual |
| Mapa base, edificios 3D y terreno | — | OpenStreetMap a través de MapTiler. Comunitaria | Teselas vectoriales y modelo digital del terreno ráster | 2026 |
| Unidades administrativas (filtrado espacial) | — | Instituto Geográfico Nacional (IGN). Pública | GeoJSON, descarga abierta | 2026 |

### Capas ausentes

| Capa | Gobernanza de la infraestructura | Motivo de la ausencia |
|---|---|---|
| Rutas de fibra óptica | Privada (operadoras); mixta (REINTEL); pública (RedIRIS) | No existe un conjunto de datos reutilizable que cubra el territorio nacional. La Ley 11/2022 y el Real Decreto 330/2016 obligan a informar sobre las infraestructuras susceptibles de alojar redes (conductos, arquetas, torres y postes), pero excluyen expresamente los cables. Esa información se canaliza a través del Punto de Información Único (PIU), cuyo acceso está restringido a la Administración y a los operadores de redes públicas. Solo son accesibles imágenes publicadas por las operadoras. |
| Red académica RedIRIS | Pública | La red se publica únicamente como imagen de baja resolución. |

La ubicación oficial de las estaciones radioeléctricas figura en el Registro Nacional de Frecuencias, cuyo acceso está restringido por el Real Decreto 123/2017. Puede consultarse en el visor Infoantenas, pero no reutilizarse. Por ello, la capa de antenas procede de OpenCelliD.

### Fuentes y licencias

| Fuente | Licencia y condiciones de reutilización |
|---|---|
| [guifi.net](https://guifi.net/) | CXSC (Comuns de Xarxes Sense Cables) |
| [OpenCelliD](https://www.opencellid.org/) | CC BY-SA 4.0 |
| [PeeringDB](https://www.peeringdb.com/) | CC BY-SA 4.0 |
| [SETELECO: cobertura móvil 4G y 5G](https://avance.digital.gob.es/banda-ancha/cobertura/) | Reutilización con atribución conforme al artículo 8 de la Ley 37/2007, sobre reutilización de la información del sector público. Confirmada mediante correspondencia directa con SETELECO. |
| [TeleGeography: Submarine Cable Map](https://www.submarinecablemap.com/) | CC BY-SA 4.0 para la versión pública anterior a 2022, confirmada mediante correspondencia directa con TeleGeography. La versión actual se distribuye con licencia comercial. |
| [IGN: unidades administrativas de primer orden](https://centrodedescargas.cnig.es/) | Reutilización de información del sector público (Real Decreto 1495/2011) |
| [MapTiler](https://www.maptiler.com/) | API comercial con clave. Datos de OpenStreetMap con licencia ODbL. |

La herramienta se publica bajo la licencia GNU GPL v3. Cada conjunto de datos conserva su propia licencia.

### Metodología de datos

#### guifi.net

Los datos se obtienen de los endpoints públicos de la API de guifi.net en formatos GML (Geography Markup Language) y CNML (Community Network Markup Language). Se descargan tres archivos:

- **Nodos:** coordenadas, identificador, nombre, tipo y estado de cada nodo.
- **Enlaces:** identificadores de ambos extremos, distancia, tipo y estado de cada enlace.
- **Detalle:** descripción del propietario, altura, tipo de antena y fechas de creación y actualización de cada nodo.

Varios scripts de Python los transforman a GeoJSON, en dos variantes: una para la representación 2D y otra para la 3D, en la que un polígono representa la altura de instalación de cada nodo y es visible a escala cercana. Los datos contienen errores de usuario, como elevaciones inverosímiles o coordenadas con latitud y longitud intercambiadas. Estos errores están acotados por la plantilla de la red y pueden corregirse porque los registros son abiertos. Es la única fuente que conserva su historia, lo que permitió el visor histórico de la primera versión de la herramienta.

#### Cobertura 4G y 5G

Los datos proceden de la Secretaría de Estado de Telecomunicaciones e Infraestructuras Digitales (SETELECO). Se accede a ellos a través de los servicios ArcGIS, no documentados, que alimentan el visor oficial de cobertura. Se cargan dinámicamente a escala cercana, según la extensión geográfica visible en cada momento.

Corresponden a la instantánea de cobertura del 30 de junio de 2024. Las operadoras, identificadas en el conjunto de datos por su CIF, se traducen a su nombre comercial. Hay una capa por tecnología (4G y 5G), y los datos de 5G incluyen la velocidad de transmisión.

Se contactó directamente con SETELECO para confirmar las condiciones de reutilización en el contexto de una investigación académica sin ánimo de lucro. SETELECO confirmó que la reutilización se rige por el artículo 8 de la Ley 37/2007, que la permite con atribución.

#### Antenas (OpenCelliD)

OpenCelliD es una base de datos colaborativa construida con las aportaciones de personas usuarias de todo el mundo que ejecutan aplicaciones de geolocalización de antenas en sus dispositivos móviles. Se distinguen las antenas con tecnología LTE (asociada al 4G) y NR (asociada al 5G). La base de datos aporta un alcance estimado, que se representa como un círculo de radio equivalente.

Las coordenadas son estimaciones, no emplazamientos. Además, los datos tienen un sesgo espacial: sobrerrepresentan carreteras y zonas urbanizadas, por donde pasan las personas voluntarias.

Proceso: descarga de los CSV de antenas para España, conversión a GeoJSON mediante un script de Python y generación de PMTiles con Tippecanoe para el rango de zoom 8 a 16.

```bash
tippecanoe -o antenas.pmtiles -z16 -Z8 -l antenas \
  --no-tile-size-limit --no-feature-limit antenas_es.geojson
```

#### Cables submarinos

Los trazados proceden del conjunto de datos público de TeleGeography (Submarine Cable Map), en GeoJSON. Un script de Python lo filtra para conservar solo los cables cuya geometría intersecta el territorio español, usando las unidades administrativas de primer orden del IGN.

Ese conjunto de datos no incluye propiedad ni proveedor, por lo que esa información se añadió y verificó manualmente. TeleGeography dejó de mantener la versión pública a finales de 2022; los cables posteriores se contrastaron con otro registro privado (Global Internet DB) y algunos pueden faltar. La herramienta distingue los cables operativos de los planificados según su año de entrada en servicio.

Se exploraron fuentes alternativas como OpenStreetMap, pero su cobertura de este tipo de infraestructura sigue siendo muy incompleta.

#### Puntos de intercambio (IXP)

Se obtienen en tiempo real de la API pública de PeeringDB, que agrega información sobre infraestructura de interconexión de redes en todo el mundo. La capa incluye el nombre, la dirección, la fecha y un enlace al sitio web oficial de cada punto. En octubre de 2026, PeeringDB contenía 17 registros de puntos de intercambio para España.

#### Límite territorial de referencia

Para recortar conjuntos de datos internacionales al territorio español se utiliza la capa de unidades administrativas de primer orden del Instituto Geográfico Nacional, descargable desde el Centro de Descargas del CNIG. Cubre todo el territorio nacional en el sistema de referencia ETRS89 (EPSG:4258), conforme a la directiva INSPIRE.

### Stack técnico

- **[MapLibre GL JS](https://maplibre.org/)**: representación de mapas vectoriales.
- **[PMTiles](https://docs.protomaps.com/pmtiles/)**: formato de teselas en un único archivo, sin servidor de teselas.
- **[Tippecanoe](https://github.com/felt/tippecanoe)**: conversión de GeoJSON a PMTiles.
- **[GeoPandas](https://geopandas.org/) y [Shapely](https://shapely.readthedocs.io/)**: procesado y filtrado espacial de los datos.
- **[MapTiler](https://www.maptiler.com/)**: teselas base, edificios 3D derivados de OpenStreetMap y modelo del terreno.

### Instalación

1. Clona el repositorio.
2. En `js/keis.js`, sustituye la clave de MapTiler por una propia. La clave incluida está restringida al entorno local y al dominio de publicación del proyecto.
3. Sirve el proyecto desde un servidor HTTP local. Es necesario para leer los archivos PMTiles, que se cargan mediante peticiones por rangos.

```bash
# Ejemplo con Python
python -m http.server 8000
```

4. Abre `http://localhost:8000` en el navegador.

### Documentación

La [documentación técnica](./documentation/ARCHITECTURE.md) describe el funcionamiento general, los componentes, las dependencias entre scripts y los pasos para incorporar una capa nueva a partir de una API dinámica, de un conjunto de datos local en GeoJSON o de un conjunto de datos local en PMTiles.

### Limitaciones conocidas

- El esquema de color simplifica la complejidad de los modelos de gobernanza, y la clasificación es deliberadamente gruesa.
- Las fuentes condicionan los datos disponibles. La falta de datos deja infrarrepresentados los modelos de gobernanza pública y privada.
- Las capas tienen fechas de actualización y resoluciones distintas, indicadas en cada ficha informativa.
- La herramienta no realiza análisis cuantitativo y se limita a España, sin comparación entre países.
- Faltan elementos clave, como el despliegue de fibra óptica.
- Ampliar la herramienta requiere conocimientos técnicos (JavaScript, MapLibre, Python y manejo de datos geolocalizados) y, por ahora, una clave de API comercial.
- Los dos ejes de gobernanza todavía no son atributos separados en la configuración.

### Cómo contribuir

La herramienta está diseñada para ampliarse sin depender de sus autores. Para incorporar una capa, sigue los pasos de la [documentación técnica](./documentation/ARCHITECTURE.md#5-incorporar-una-capa-nueva). Registra en su ficha informativa la fuente, la licencia, la legislación aplicable, la fecha y las limitaciones, y añade la fuente a la tabla de fuentes y licencias de este README.

### Licencia

GNU General Public License v3.0. Véase [LICENSE](LICENSE). Cada conjunto de datos conserva su propia licencia, indicada en la sección [Fuentes y licencias](#fuentes-y-licencias).

### Autoría

Autoría anonimizada para el proceso de revisión ciega.

---

## English

An interactive, open-source web mapping tool that brings together Spain's Internet transmission infrastructure and classifies each layer by its governance model. It was developed within doctoral research in architecture, through research through design and critical cartography.


### Research aim

The physical infrastructure of the Internet constitutes a foundational layer of contemporary territory. Yet its transmission substrate remains opaque to democratic scrutiny. The research argues that mapping this infrastructure according to who governs it is a practice of democratic design.

Following Lefebvre and Purcell, the research understands democracy applied to space as the right of those who inhabit it to participate in the decisions that produce it and to appropriate it. This definition is translated into three conditions that can be verified in the tool itself, corresponding to three moments of civic agency: knowing, judging and acting.

- **Legible.** It must be possible to know who builds and governs each element.
- **Comparable.** It must be possible to place governance models side by side, over the same territory and in the same format.
- **Appropriable.** The knowledge produced, and the tool that produces it, must be reusable and extensible without depending on their authors.

The State publishes coverage maps so that consumers can compare offers at their postal address. This tool reorganises the same data, together with community and private sources, so that citizens can compare governance models across the territory.

Building the tool made it necessary to distinguish two axes of governance, which coincide only in the community layer:

1. **Governance of the infrastructure.** Who owns, operates and takes decisions about a cable, an antenna or a node. The tool classifies it into four models (public, private, community or mixed), with ownership as the primary criterion.
2. **Governance of the data.** Who produces the record of where the infrastructure is, under what licence, at what resolution and how frequently. It is documented in each layer's information card and in this repository.

### Tool description

The tool is an interactive web mapping application for visualising and comparing Spain's physical Internet infrastructure according to the governance model of each element. It is a static website written in HTML and JavaScript using the open-source library MapLibre GL JS.

- **Layers by infrastructural element.** A menu organises the layers by element and allows them to be switched on and off in parallel, over the same territory and the same basemap.
- **Information cards.** An information button next to each layer shows a description of the element, the data source, the licence of use, the date, the reliability and the limitations encountered.
- **Pop-ups.** Clicking on a feature shows its attributes. Official identifiers are translated into readable names: for example, an operator appears under its trade name rather than its tax identification number (CIF) or mobile network code (MNC). Information on ownership, suppliers and funding is shown where available.
- **Governance mode.** Colours features according to their governance model, with a corresponding legend. The colour scheme simplifies, and says so; detailed information is given in the information cards.
- **Three-dimensional representation.** Layers are overlaid on a 3D model of the terrain and of building volumes, so the map can be read at national, comarca and building scale.
- **Visible absences.** Layers that could not be obtained appear disabled in the menu, with an information card explaining why and which regulation restricts access.
- **Extensible.** Each layer is declared as a configuration object. Adding a dataset only requires declaring its source and writing that object (see the [technical documentation](./documentation/ARCHITECTURE.md#english)).

Layers obtain their data in two ways. Some query APIs dynamically from the browser, which keeps the data up to date. Others use datasets downloaded and stored in the repository, in GeoJSON or, for very large point sets, in PMTiles; these require manual updating.

### Scope

The tool covers the Internet's transmission infrastructure, that is, the elements through which data travel from one place to another.

- **Included:** submarine cables; mobile phone antennas (LTE and NR) with their estimated range; 4G and 5G coverage by operator; Internet exchange points (IXPs); the nodes and links of the guifi.net community network.
- **Excluded by the selection principle:** storage and computation (data centres, name servers, hosting), satellite infrastructure and electronic waste.
- **Absent for lack of reusable data:** fibre routes and the RedIRIS academic network (see [Absent layers](#absent-layers)).

### Data layers

| Layer | Governance of the infrastructure | Source and governance of the data | Format and loading | Data from |
|---|---|---|---|---|
| guifi.net nodes and links | Community; mixed in collaborations with municipalities | guifi.net public API. Community: produced by the network itself | Local GeoJSON (converted from GML/CNML) | 2026 |
| Mobile antennas (LTE, NR) and estimated range | Private (operators); mixed (operators with State participation) | OpenCelliD. Community: volunteer contributions | Local PMTiles | 2026 |
| Internet exchange points (IXPs) | Mixed (private operators, associations and public consortia) | PeeringDB. Community: community-maintained register | API, dynamic query | Real time |
| 4G and 5G coverage by operator | Private (operators); mixed (operators with State participation) | SETELECO. Public | ArcGIS services, loaded dynamically by visible extent | 30 June 2024 |
| Submarine cables | Private or mixed (consortia) | TeleGeography. Private | Local GeoJSON | Pre-2022 version, manually verified |
| Basemap, 3D buildings and terrain | — | OpenStreetMap via MapTiler. Community | Vector tiles and raster digital elevation model | 2026 |
| Administrative units (spatial filtering) | — | Instituto Geográfico Nacional (IGN; National Geographic Institute). Public | GeoJSON, open download | 2026 |

### Absent layers

| Layer | Governance of the infrastructure | Reason for absence |
|---|---|---|
| Fibre routes | Private (operators); mixed (REINTEL); public (RedIRIS) | No reusable dataset covering the national territory exists. Law 11/2022 and Royal Decree 330/2016 require information on infrastructure capable of hosting networks (ducts, chambers, towers and poles) but expressly exclude cables. That information is channelled through the Single Information Point (Punto de Información Único, PIU), whose access is restricted to the Administration and to operators of public networks. Only images published by operators are accessible. |
| RedIRIS academic network | Public | The network is published only as a low-resolution image. |

The official location of radio stations is held in the National Frequency Register (Registro Nacional de Frecuencias), whose access is restricted under Royal Decree 123/2017. It can be consulted through the Infoantenas viewer but not reused. This is why the antenna layer comes from OpenCelliD.

### Sources and licences

| Source | Licence and reuse conditions |
|---|---|
| [guifi.net](https://guifi.net/) | CXSC (Comuns de Xarxes Sense Cables) |
| [OpenCelliD](https://www.opencellid.org/) | CC BY-SA 4.0 |
| [PeeringDB](https://www.peeringdb.com/) | CC BY-SA 4.0 |
| [SETELECO: 4G and 5G mobile coverage](https://avance.digital.gob.es/banda-ancha/cobertura/) | Reuse with attribution under Article 8 of Law 37/2007 on the reuse of public sector information. Confirmed through direct correspondence with SETELECO. |
| [TeleGeography: Submarine Cable Map](https://www.submarinecablemap.com/) | CC BY-SA 4.0 for the public pre-2022 version, confirmed through direct correspondence with TeleGeography. The current version is distributed under a commercial licence. |
| [IGN: first-level administrative units](https://centrodedescargas.cnig.es/) | Reuse of public sector information (Royal Decree 1495/2011) |
| [MapTiler](https://www.maptiler.com/) | Commercial API with key. OpenStreetMap data under the ODbL. |

The tool is published under the GNU GPL v3 licence. Each dataset retains its own licence.

### Data methodology

#### guifi.net

The data are obtained from the public endpoints of the guifi.net API in GML (Geography Markup Language) and CNML (Community Network Markup Language) formats. Three files are downloaded:

- **Nodes:** coordinates, identifier, name, type and status of each node.
- **Links:** identifiers of both ends, distance, type and status of each link.
- **Detailed:** owner description, height, antenna type, and creation and update dates of each node.

Python scripts convert them into GeoJSON, in two variants: one for 2D representation and one for 3D, in which a polygon represents each node's installation height and is visible at close zoom. The data contain user errors, such as implausible elevations or coordinates with latitude and longitude swapped. These errors are bounded by the network's template and are correctable because the records are open. It is the only source that preserves its history, which made possible the historical viewer of the tool's first version.

#### 4G and 5G coverage

The data come from the Secretaría de Estado de Telecomunicaciones e Infraestructuras Digitales (SETELECO; Secretary of State for Telecommunications and Digital Infrastructure). They are accessed through the undocumented ArcGIS services that feed the official coverage viewer, and are loaded dynamically at close zoom according to the geographic extent visible at each moment.

They correspond to the coverage snapshot of 30 June 2024. Operators, identified in the dataset by their tax identification number (CIF), are translated into their trade names. There is one layer per technology (4G and 5G), and the 5G data include transmission speed.

SETELECO was contacted directly to confirm the conditions for reuse in the context of non-profit academic research. It confirmed that reuse is governed by Article 8 of Law 37/2007, which permits it with attribution.

#### Antennas (OpenCelliD)

OpenCelliD is a collaborative database built from contributions by users worldwide who run cell-tower geolocation apps on their mobile devices. Antennas using LTE technology (associated with 4G) and NR technology (associated with 5G) are distinguished. The database provides an estimated range, displayed as a circle of equivalent radius.

Coordinates are estimates rather than sites. The data also have a spatial bias: they over-represent roads and built-up areas, through which volunteers pass.

Process: download of the antenna CSV files for Spain, conversion to GeoJSON with a Python script, and generation of PMTiles with Tippecanoe for zoom levels 8 to 16.

```bash
tippecanoe -o antenas.pmtiles -z16 -Z8 -l antenas \
  --no-tile-size-limit --no-feature-limit antenas_es.geojson
```

#### Submarine cables

Cable routes come from TeleGeography's public dataset (Submarine Cable Map), in GeoJSON. A Python script filters it to retain only cables whose geometry intersects Spanish territory, using the IGN's first-level administrative units.

The dataset includes neither ownership nor supplier, so that information was added and verified manually. TeleGeography stopped maintaining the public version at the end of 2022; later cables were checked against another private register (Global Internet DB), and some may be missing. The tool distinguishes operational from planned cables by their year of entry into service.

Alternative sources such as OpenStreetMap were explored, but their coverage of this type of infrastructure remains very incomplete.

#### Internet exchange points (IXPs)

They are retrieved in real time from the public API of PeeringDB, which aggregates information on network interconnection infrastructure worldwide. The layer includes each exchange point's name, address, date and a link to its official website. In October 2026, PeeringDB held 17 exchange-point records for Spain.

#### Territorial reference boundary

To clip international datasets to Spanish territory, the tool uses the first-level administrative units layer of the Instituto Geográfico Nacional, downloadable from the CNIG Download Centre. It covers the whole national territory in the ETRS89 reference system (EPSG:4258), in accordance with the INSPIRE Directive.

### Technical stack

- **[MapLibre GL JS](https://maplibre.org/)**: vector map rendering.
- **[PMTiles](https://docs.protomaps.com/pmtiles/)**: single-file tile format, with no tile server.
- **[Tippecanoe](https://github.com/felt/tippecanoe)**: GeoJSON to PMTiles conversion.
- **[GeoPandas](https://geopandas.org/) and [Shapely](https://shapely.readthedocs.io/)**: data processing and spatial filtering.
- **[MapTiler](https://www.maptiler.com/)**: base tiles, 3D buildings derived from OpenStreetMap, and terrain model.

### Installation

1. Clone the repository.
2. In `js/keis.js`, replace the MapTiler key with your own. The key included is restricted to local use and to the project's publication domain.
3. Serve the project from a local HTTP server. This is required to read the PMTiles files, which are loaded through range requests.

```bash
# Example with Python
python -m http.server 8000
```

4. Open `http://localhost:8000` in the browser.

### Documentation

The [technical documentation](./documentation/ARCHITECTURE.md#english) describes the tool's general operation, its components, the dependencies between scripts, and the steps for adding a new layer from a dynamic API, a local GeoJSON dataset or a local PMTiles dataset.

### Known limitations

- The colour scheme simplifies the complexity of the governance models, and the classification is deliberately coarse.
- The available data are limited by the sources. Missing data leave the public and private governance models under-represented.
- Layers have different update dates and resolutions, stated in each information card.
- The tool performs no quantitative analysis and is limited to Spain, with no cross-country comparison.
- Key elements, such as fibre-optic deployment, are missing.
- Extending the tool requires technical skills (JavaScript, MapLibre, Python and the handling of geolocated data) and, for the time being, a commercial API key.
- The two governance axes are not yet separate attributes in the configuration.

### Contributing

The tool is designed to be extended without depending on its authors. To add a layer, follow the steps in the [technical documentation](./documentation/ARCHITECTURE.md#5-adding-a-new-layer). Record in its information card the source, licence, applicable legislation, date and limitations, and add the source to the sources and licences table in this README.

### Licence

GNU General Public License v3.0. See [LICENSE](LICENSE). Each dataset retains its own licence, as listed under [Sources and licences](#sources-and-licences).

### Authorship

Authorship anonymised for blind review.
