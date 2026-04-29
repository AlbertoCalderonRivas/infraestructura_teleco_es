# JS Architecture Reference

## Load order (index.html)

```
keis.js → operators.js → layerConfig.js → config.js → sources.js → layerButtons.js → layers.js → icons.js → main.js
```

Order matters: each file depends on globals defined by the ones before it.

---

## File responsibilities

| File | Defines | Depends on |
|---|---|---|
| `keis.js` | `KEYS` | — |
| `operators.js` | `OPERADORES`, `OPERADORES_EXTRA`, `colorPorClave()`, `generarGradienteVelocidad()`, `oscurecerColor()` | — |
| `layerConfig.js` | `LAYER_CONFIG` (array) | `OPERADORES`, `generarGradienteVelocidad()`, `oscurecerColor()`, `colorPorClave()` |
| `config.js` | `map` (MapLibre instance) | — |
| `sources.js` | `inicializarSources()`, `cargarIXPs()`, `cargarCobertura5G()`, `cargarCobertura4G()` | `map`, `LAYER_CONFIG`, `KEYS` |
| `layerButtons.js` | `inicializarBotones()` | `map`, `LAYER_CONFIG` |
| `layers.js` | `inicializarLayers()` | `map`, `LAYER_CONFIG` |
| `icons.js` | `cargarIcono()` | `map` |
| `main.js` | map controls, `map.on("load")` orchestration, popups | everything |

---

## LAYER_CONFIG — the central data structure

Every layer is an object in the `LAYER_CONFIG` array. `sources.js`, `layers.js`, and `layerButtons.js` all iterate over it — nothing is hardcoded in those files.

### Full object spec

```js
{
  id: "my_layer",           // unique string — must match the button id in index.html
  categoria: "publica",     // "base" | "publica" | "comunitaria" | "privada"
  label: "My Layer",        // human-readable name (for future auto-generated UI)
  grupo: "todas",           // optional: operator group for filtering (e.g. "telefonica")

  // Source
  sourceId: "my_source",    // id of the MapLibre source
  sourceType: "geojson",    // "geojson" | "pmtiles" | "geojson-dynamic" | null
                            // null = source already exists (maptiler, terrain-dem, shared sources)
                            // geojson-dynamic = source created manually in sources.js, not by the loop
  sourceLayer: "layer_name",// only for vector tile sources (pmtiles, maptiler)
  data: "./path/to/file.geojson", // url string for geojson/pmtiles; omit for dynamic/null

  // Layer
  layerType: "circle",      // any MapLibre layer type
  filter: [...],            // optional MapLibre filter expression
  minzoom: 13,              // optional
  paint: { ... },           // MapLibre paint properties
  layout: { ... },          // MapLibre layout properties (visibility is set automatically)

  // Behavior
  visibleByDefault: true,   // controls initial visibility + button color
  popup: true,              // if true, clicking the layer opens a property popup
  popupExclude: ["color"],  // optional: additional properties to hide in the popup
}
```

### How sourceType controls source creation (sources.js)

```
sourceType: "geojson"         → map.addSource(sourceId, { type: "geojson", data })
sourceType: "pmtiles"         → map.addSource(sourceId, { type: "vector", url: data })
sourceType: "geojson-dynamic" → skipped by loop (source created manually, filled at runtime)
sourceType: null              → skipped by loop (source already exists)
```

If `map.getSource(sourceId)` already exists, the loop skips it regardless — safe for shared sources like `cobertura_5g` used by multiple layers.

---

## How to add a new layer

### Case 1: static GeoJSON file

1. Drop the `.geojson` in `data/`
2. Add a button `<button id="my_layer">My Layer</button>` in the right `<details>` block in `index.html`
3. Add an object to `LAYER_CONFIG`:

```js
{
  id: "my_layer",
  categoria: "publica",
  label: "My Layer",
  sourceId: "my_layer",
  sourceType: "geojson",
  data: "./data/my_layer.geojson",
  layerType: "circle",
  paint: { "circle-color": "#ffffff", "circle-radius": 5 },
  visibleByDefault: true,
  popup: true,
  popupExclude: ["internal_field"], // optional
}
```

### Case 2: PMTiles

Same as above but:
```js
sourceType: "pmtiles",
sourceLayer: "layer_name_inside_pmtiles",
data: "pmtiles://./data/my_file.pmtiles",
layerType: "symbol",   // or "circle"
```

### Case 3: dynamic source (API, bbox-dependent)

1. Create the source manually in `sources.js` (initialized empty)
2. Write a `cargarX()` function in `sources.js` that fetches and calls `map.getSource("x").setData(data)`
3. In `main.js`, call `cargarX()` on load and `map.on("moveend", cargarX)` if it should refresh on pan
4. In `LAYER_CONFIG`, set `sourceType: "geojson-dynamic"` — the loop will skip source creation but still add the layer

### Case 4: new operator with coverage + antennas

1. Add the operator to `OPERADORES` in `operators.js` (if it has a CIF and coverage data):
```js
A12345678: { nombre: "Nueva Op", color: "#00ffcc", clave: "NuevaOp" }
```
Coverage layers (5G + 4G) are generated automatically by the loop at the bottom of `layerConfig.js`.

2. For antennas, add an entry to the antennas loop in `layerConfig.js`:
```js
{ clave: "NuevaOp", techs: ["LTE"] }
```
And add PMTiles files to `data/openCell/pmtiles/`.

3. If the operator has no CIF (no coverage), add it only to `OPERADORES_EXTRA` in `operators.js` and add it to the antennas loop manually.

4. Add the corresponding buttons to `index.html`.

---

## Special cases

### hillshade + terrain
The hillshade layer toggle (visibility) is handled by the generic button loop. The 3D terrain toggle (`map.setTerrain()`) has a separate listener in `layerButtons.js` because `setTerrain` is not a layer property. **Known issue:** they are not synchronized — disabling hillshade does not disable terrain and vice versa.

### IXPs
Source is initialized empty in the loop (sourceType: "geojson", data: empty FeatureCollection). `cargarIXPs()` fills it via PeeringDB API after initialization. No moveend refresh (data is national, not bbox-dependent).

### Shared sources (cobertura_5g, cobertura_4g)
Multiple layers read from the same source with different filters (per-operator). Only the first layer in `LAYER_CONFIG` that references the source will create it — subsequent ones have `sourceType: null`.

### Popups
A single `map.on("click")` listener in `main.js` handles all popup layers. It uses `map.queryRenderedFeatures()` to get features under the cursor ordered by render order, and opens a popup only for the topmost feature. This avoids multiple simultaneous popups when layers overlap.

`name` propertie always excluded from popup display. `NODE_NAME`, `name`, `COBERTURA`, `url` (these feed the title and link). Per-layer additional exclusions are declared in `popupExclude` in `LAYER_CONFIG`.

If the feature has a `COBERTURA` field, CIF codes are resolved to operator names via `OPERADORES`.

---

## Known technical debt

- `hillshade` visibility and terrain 3D are not synchronized
- `cargarCobertura5G` and `cargarCobertura4G` are near-identical — candidate for a shared `cargarCoberturaDinamica(sourceId, url)` helper when more dynamic layers are added
- Right-click to copy coordinates (noted in main.js) not yet implemented


** This documentation was created using an LLM and it is human reviewed