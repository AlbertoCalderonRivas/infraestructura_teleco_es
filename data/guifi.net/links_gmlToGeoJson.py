import xml.etree.ElementTree as ET
import json
import re

# Configuración
archivo_entrada = 'links.gml'  # Cambia por el nombre de tu archivo de links
archivo_salida = 'guifi_links.geojson'

# Espacios de nombres del XML
namespaces = {
    'ogr': 'http://ogr.maptools.org/',
    'gml': 'http://www.opengis.net/gml'
}

def parse_line_string(coord_text):
    """
    Convierte "2.235825,42.008684 2.241277,42.004250" en 
    [[2.235825, 42.008684], [2.241277, 42.004250]] para GeoJSON
    """
    if not coord_text:
        return None
    
    # Limpiar espacios y dividir por pares de coordenadas
    coord_text = coord_text.strip()
    # Separa por espacios (cada par de coordenadas)
    pares = re.split(r'\s+', coord_text)
    
    puntos = []
    for par in pares:
        # Cada par es "lon,lat"
        partes = par.split(',')
        if len(partes) == 2:
            try:
                lon = float(partes[0].strip())
                lat = float(partes[1].strip())
                puntos.append([lon, lat])
            except ValueError:
                continue
    
    return puntos if len(puntos) >= 2 else None

def procesar_links(archivo_xml):
    """Extrae todos los links y los convierte a features de GeoJSON"""
    
    tree = ET.parse(archivo_xml)
    root = tree.getroot()
    
    features = []
    
    # Buscar todos los featureMember
    for feature in root.findall('.//gml:featureMember', namespaces):
        dlinks = feature.find('.//dlinks')
        if dlinks is None:
            continue
            
        feature_data = {
            "type": "Feature",
            "properties": {},
            "geometry": None
        }
        
        # Extraer todas las propiedades del link
        for elem in dlinks:
            tag = elem.tag.split('}')[-1]  # Quitar namespace
            
            if tag == 'geometryProperty':
                # Procesar la geometría (LineString)
                geom = elem.find('.//gml:LineString', namespaces)
                if geom is not None:
                    coords_elem = geom.find('.//gml:coordinates', namespaces)
                    if coords_elem is not None and coords_elem.text:
                        puntos = parse_line_string(coords_elem.text)
                        if puntos:
                            feature_data["geometry"] = {
                                "type": "LineString",
                                "coordinates": puntos
                            }
            else:
                # Es una propiedad normal (NODE1_ID, NODE2_ID, KMS, etc.)
                if elem.text and elem.text.strip():
                    # Intentar convertir KMS a número
                    if tag == 'KMS':
                        try:
                            feature_data["properties"][tag] = float(elem.text.strip())
                        except ValueError:
                            feature_data["properties"][tag] = elem.text.strip()
                    else:
                        feature_data["properties"][tag] = elem.text.strip()
        
        # Solo añadir si tiene geometría válida
        if feature_data["geometry"]:
            features.append(feature_data)
    
    return features

# Procesar el archivo
print(f"Procesando {archivo_entrada}...")
features = procesar_links(archivo_entrada)

# Crear el GeoJSON completo
geojson = {
    "type": "FeatureCollection",
    "features": features
}

# Guardar el archivo
with open(archivo_salida, 'w', encoding='utf-8') as f:
    json.dump(geojson, f, indent=2, ensure_ascii=False)

print(f"✅ Convertidos {len(features)} links a {archivo_salida}")

# Mostrar algunas estadísticas básicas
if features:
    print("\n📊 Estadísticas:")
    estados = {}
    tipos = {}
    for f in features:
        estado = f['properties'].get('STATUS', 'Unknown')
        tipo = f['properties'].get('LINK_TYPE', 'Unknown')
        estados[estado] = estados.get(estado, 0) + 1
        tipos[tipo] = tipos.get(tipo, 0) + 1
    
    print("Estados:", estados)
    print("Tipos:", tipos)