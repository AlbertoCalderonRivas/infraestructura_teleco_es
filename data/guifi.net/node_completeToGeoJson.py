import xml.etree.ElementTree as ET
import json
import re
import math

# ─── CONFIGURACIÓN ────────────────────────────────────────────────────────────
ARCHIVO_GML  = 'nodes.gml'
ARCHIVO_CNML = 'detail.cnml'
SALIDA_NODOS = 'guifi_nodos_completo3D.geojson'
SALIDA_LINKS = 'guifi_links-mal.geojson'

# Solo se exportan nodos con estos estados
STATUS_PERMITIDOS = {'Working'}

# Tamaño del triángulo en grados (~4px a zoom 16 ≈ 0.0003°)
TRIANGULO_RADIO = 0.00003

# Namespaces GML
NS = {
    'ogr': 'http://ogr.maptools.org/',
    'gml': 'http://www.opengis.net/gml'
}

# ─── UTILIDADES ───────────────────────────────────────────────────────────────

def parse_coords(text):
    partes = re.split('[, ]+', text.strip())
    if len(partes) >= 2:
        try:
            return [float(partes[0]), float(partes[1])]
        except ValueError:
            pass
    return None

def hacer_triangulo(lon, lat, radio=TRIANGULO_RADIO):
    """Devuelve un polígono triangular centrado en (lon, lat)."""
    # Triángulo equilátero apuntando hacia arriba
    angulos = [90, 210, 330]
    coords = []
    for a in angulos:
        rad = math.radians(a)
        coords.append([
            round(lon + radio * math.cos(rad), 7),
            round(lat + radio * math.sin(rad), 7)
        ])
    coords.append(coords[0])  # cerrar el polígono
    return {"type": "Polygon", "coordinates": [coords]}

# ─── PASO 1: LEER GML → diccionario de nodos ──────────────────────────────────

def leer_gml(archivo):
    print(f"🔍 Leyendo {archivo}...")
    tree = ET.parse(archivo)
    root = tree.getroot()

    nodos = {}
    for fm in root.findall('.//gml:featureMember', NS):
        dnode = fm.find('.//dnodes')
        if dnode is None:
            continue

        props = {}
        coords = None

        geom = dnode.find('.//gml:coordinates', NS)
        if geom is not None and geom.text:
            coords = parse_coords(geom.text)

        for elem in dnode:
            tag = elem.tag.split('}')[-1]
            if tag != 'geometryProperty' and elem.text and elem.text.strip():
                props[tag] = elem.text.strip()

        node_id = props.get('NODE_ID')
        if node_id and coords:
            nodos[node_id] = {'coords': coords, 'props': props}

    print(f"  ✅ {len(nodos)} nodos leídos del GML")
    return nodos

# ─── PASO 2: LEER CNML → diccionario de info extra ────────────────────────────

def leer_cnml(archivo):
    print(f"🔍 Leyendo {archivo}...")
    info = {}

    # Intentar XML estándar primero
    try:
        tree = ET.parse(archivo)
        root = tree.getroot()
        for node in root.findall('.//node'):
            nid = node.get('id')
            if nid:
                info[nid] = {
                    'antenna_elevation': node.get('antenna_elevation'),
                    'status':            node.get('status'),
                    'created':           node.get('created'),
                    'updated':           node.get('updated'),
                    'cnml_title':        node.get('title'),
                    'node_type':         node.get('type'),
                }
        print(f"  ✅ {len(info)} nodos leídos del CNML (XML)")
        return info
    except Exception:
        pass

    # Fallback con regex
    with open(archivo, 'r', encoding='utf-8', errors='ignore') as f:
        contenido = f.read()

    patron = (
        r'<node\b[^>]*\bid=["\'](\d+)["\'][^>]*'
        r'(?:antenna_elevation=["\']([^"\']*)["\'])?[^>]*'
        r'status=["\']([^"\']*)["\'][^>]*'
        r'(?:created=["\']([^"\']*)["\'])?[^>]*'
        r'(?:updated=["\']([^"\']*)["\'])?[^>]*'
        r'(?:title=["\']([^"\']*)["\'])?[^>]*'
        r'(?:type=["\']([^"\']*)["\'])?[^>]*/?>'
    )
    for m in re.finditer(patron, contenido, re.DOTALL):
        nid = m.group(1)
        info[nid] = {
            'antenna_elevation': m.group(2) or None,
            'status':            m.group(3) or None,
            'created':           m.group(4) or None,
            'updated':           m.group(5) or None,
            'cnml_title':        m.group(6) or None,
            'node_type':         m.group(7) or None,
        }

    print(f"  ✅ {len(info)} nodos leídos del CNML (regex)")
    return info

# ─── PASO 3: COMBINAR Y GENERAR GEOJSON DE NODOS ─────────────────────────────

def generar_nodos(nodos_gml, info_cnml):
    print("🔧 Generando GeoJSON de nodos...")

    geojson_puntos  = {"type": "FeatureCollection", "features": []}  # para links
    geojson_triangs = {"type": "FeatureCollection", "features": []}  # para mapa 3D

    omitidos = 0
    for node_id, datos in nodos_gml.items():
        extra = info_cnml.get(node_id, {})

        # Filtrar por status
        status = extra.get('status') or datos['props'].get('STATUS', '')
        if status not in STATUS_PERMITIDOS:
            omitidos += 1
            continue

        lon, lat = datos['coords']

        # Elevación (metros → float, None si falta)
        elev_raw = extra.get('antenna_elevation')
        try:
            elevation = float(elev_raw) if elev_raw else None
        except ValueError:
            elevation = None

        props = {
            **datos['props'],
            'antenna_elevation': elevation,
            'STATUS':            status,
            'created':           extra.get('created'),
            'updated':           extra.get('updated'),
            'cnml_title':        extra.get('cnml_title'),
            'NODE_TYPE':         extra.get('node_type') or datos['props'].get('NODE_TYPE'),
        }

        # Feature de punto (para los links)
        geojson_puntos['features'].append({
            "type": "Feature",
            "properties": props,
            "geometry": {"type": "Point", "coordinates": [lon, lat]}
        })

        # Feature de triángulo (para visualización 3D)
        geojson_triangs['features'].append({
            "type": "Feature",
            "properties": props,
            "geometry": hacer_triangulo(lon, lat)
        })

    total = len(geojson_triangs['features'])
    print(f"  ✅ {total} nodos exportados | {omitidos} omitidos (no Working)")
    return geojson_puntos, geojson_triangs

# ─── PASO 4: GENERAR GEOJSON DE LINKS ─────────────────────────────────────────

def leer_links_cnml(archivo, nodos_coords):
    """
    Extrae los links del CNML y les añade las coordenadas de cada extremo,
    incluyendo la antenna_elevation para poder representar líneas en 3D.
    """
    print("🔧 Generando GeoJSON de links...")

    try:
        tree = ET.parse(archivo)
        root = tree.getroot()
        links_xml = root.findall('.//link')
    except Exception:
        # Fallback regex si el XML falla
        with open(archivo, 'r', encoding='utf-8', errors='ignore') as f:
            contenido = f.read()
        patron = (
            r'<link\b[^>]*\bfrom=["\'](\d+)["\'][^>]*'
            r'\bto=["\'](\d+)["\'][^>]*'
            r'(?:type=["\']([^"\']*)["\'])?[^>]*'
            r'(?:status=["\']([^"\']*)["\'])?[^>]*/?>'
        )
        features = []
        for m in re.finditer(patron, contenido, re.DOTALL):
            id1, id2 = m.group(1), m.group(2)
            link_type = m.group(3) or ''
            status    = m.group(4) or ''
            if id1 in nodos_coords and id2 in nodos_coords:
                c1 = nodos_coords[id1]['coords']
                c2 = nodos_coords[id2]['coords']
                features.append({
                    "type": "Feature",
                    "properties": {
                        "NODE1_ID":   id1,
                        "NODE1_NAME": nodos_coords[id1]['props'].get('NODE_NAME', ''),
                        "NODE2_ID":   id2,
                        "NODE2_NAME": nodos_coords[id2]['props'].get('NODE_NAME', ''),
                        "LINK_TYPE":  link_type,
                        "STATUS":     status,
                        "KMS": round(math.dist(c1, c2) * 111, 3)
                    },
                    "geometry": {"type": "LineString", "coordinates": [c1, c2]}
                })
        print(f"  ✅ {len(features)} links exportados (regex)")
        return {"type": "FeatureCollection", "features": features}

    features = []
    for link in links_xml:
        id1 = link.get('from') or link.get('node_a')
        id2 = link.get('to')   or link.get('node_b')
        if not id1 or not id2:
            continue
        if id1 not in nodos_coords or id2 not in nodos_coords:
            continue
        c1 = nodos_coords[id1]['coords']
        c2 = nodos_coords[id2]['coords']
        features.append({
            "type": "Feature",
            "properties": {
                "NODE1_ID":   id1,
                "NODE1_NAME": nodos_coords[id1]['props'].get('NODE_NAME', ''),
                "NODE2_ID":   id2,
                "NODE2_NAME": nodos_coords[id2]['props'].get('NODE_NAME', ''),
                "LINK_TYPE":  link.get('type', ''),
                "STATUS":     link.get('status', ''),
                "KMS": round(math.dist(c1, c2) * 111, 3)
            },
            "geometry": {"type": "LineString", "coordinates": [c1, c2]}
        })

    print(f"  ✅ {len(features)} links exportados (XML)")
    return {"type": "FeatureCollection", "features": features}

# ─── MAIN ─────────────────────────────────────────────────────────────────────

def main():
    # 1. Leer fuentes
    nodos_gml  = leer_gml(ARCHIVO_GML)
    info_cnml  = leer_cnml(ARCHIVO_CNML)

    # 2. Generar nodos (puntos internos + triángulos para el mapa)
    nodos_puntos, nodos_triangs = generar_nodos(nodos_gml, info_cnml)

    # 3. Guardar nodos con triángulos (lo que carga el mapa)
    with open(SALIDA_NODOS, 'w', encoding='utf-8') as f:
        json.dump(nodos_triangs, f, separators=(',', ':'), ensure_ascii=False)
    print(f"💾 {SALIDA_NODOS} guardado "
          f"({len(nodos_triangs['features'])} features)")

    # 4. Generar y guardar links
    geojson_links = leer_links_cnml(ARCHIVO_CNML, nodos_gml)
    with open(SALIDA_LINKS, 'w', encoding='utf-8') as f:
        json.dump(geojson_links, f, separators=(',', ':'), ensure_ascii=False)
    print(f"💾 {SALIDA_LINKS} guardado "
          f"({len(geojson_links['features'])} features)")

    print("\n✅ Todo listo.")

if __name__ == '__main__':
    main()