import xml.etree.ElementTree as ET
import json
import re

# Configuración
archivo_entrada = 'nodes.gml'  
archivo_salida = 'guifi_nodos.geojson'

# Espacios de nombres del XML
namespaces = {
    'ogr': 'http://ogr.maptools.org/',
    'gml': 'http://www.opengis.net/gml'
}

# Función para parsear coordenadas
def parse_coordinates(coord_text):
    # Limpiar y dividir
    coord_text = coord_text.strip()
    partes = re.split('[, ]+', coord_text)
    
    if len(partes) >= 2:
        try:
            lon = float(partes[0])
            lat = float(partes[1])
            return [lon, lat]  # GeoJSON usa [lon, lat]
        except:
            return None
    return None

# Leer el archivo XML
tree = ET.parse(archivo_entrada)
root = tree.getroot()

# Preparar estructura GeoJSON
geojson = {
    "type": "FeatureCollection",
    "features": []
}

# Buscar todos los featureMember
for feature in root.findall('.//gml:featureMember', namespaces):
    dnodes = feature.find('.//dnodes')
    if dnodes is not None:
        feature_data = {"type": "Feature", "properties": {}, "geometry": None}
        
        # Extraer coordenadas
        geom = dnodes.find('.//gml:coordinates', namespaces)
        if geom is not None and geom.text:
            coords = parse_coordinates(geom.text)
            if coords:
                feature_data["geometry"] = {
                    "type": "Point",
                    "coordinates": coords
                }
        
        # Extraer todas las propiedades
        for elem in dnodes:
            tag = elem.tag.split('}')[-1]  # Quitar namespace
            if tag != 'geometryProperty' and elem.text and elem.text.strip():
                feature_data["properties"][tag] = elem.text.strip()
        
        # Solo añadir si tiene geometría
        if feature_data["geometry"]:
            geojson["features"].append(feature_data)

# Guardar GeoJSON
with open(archivo_salida, 'w', encoding='utf-8') as f:
    json.dump(geojson, f, indent=2, ensure_ascii=False)

print(f"✅ Convertidos {len(geojson['features'])} nodos a {archivo_salida}")