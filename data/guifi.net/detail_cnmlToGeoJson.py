import xml.etree.ElementTree as ET
import json
import re

# Configuración
archivo_cnml = 'detail.cnml'  # Cambia por tu archivo CNML
archivo_nodos_geojson = 'guifi_nodos.geojson'  # Tu GeoJSON actual de nodos
archivo_salida = 'guifi_nodos_completo.geojson'

# Espacios de nombres del CNML
namespaces = {
    'cnml': 'http://guifi.net/cnml'  # Ajusta si tiene otro namespace
}

def parsear_cnml(archivo_cnml):
    """Extrae información de nodos del archivo CNML"""
    print(f"🔍 Leyendo archivo CNML: {archivo_cnml}")
    
    # Intentar parsear con diferentes estrategias
    try:
        tree = ET.parse(archivo_cnml)
        root = tree.getroot()
    except:
        # Si falla, intentar con lectura de texto y regex (el CNML puede ser problemático)
        return parsear_cnml_con_regex(archivo_cnml)
    
    nodos_cnml = {}
    
    # Buscar todos los nodos (pueden estar en diferentes niveles)
    for node in root.findall('.//node'):
        node_id = node.get('id')
        if not node_id:
            continue
            
        nodo_info = {
            'id': node_id,
            'title': node.get('title'),
            'lat': node.get('lat'),
            'lon': node.get('lon'),
            'antenna_elevation': node.get('antenna_elevation'),
            'status': node.get('status'),
            'created': node.get('created'),
            'updated': node.get('updated')
        }
        
        # Limpiar datos
        for key, value in nodo_info.items():
            if value == '' or value is None:
                nodo_info[key] = None
        
        # Convertir a float cuando sea posible
        if nodo_info['lat']:
            try:
                nodo_info['lat'] = float(nodo_info['lat'])
            except:
                pass
        if nodo_info['lon']:
            try:
                nodo_info['lon'] = float(nodo_info['lon'])
            except:
                pass
        
        nodos_cnml[node_id] = nodo_info
    
    print(f"✅ Encontrados {len(nodos_cnml)} nodos en el CNML")
    return nodos_cnml

def parsear_cnml_con_regex(archivo_cnml):
    """Método alternativo usando regex si el XML falla"""
    nodos_cnml = {}
    
    with open(archivo_cnml, 'r', encoding='utf-8', errors='ignore') as f:
        contenido = f.read()
    
    # Buscar patrones de nodos
    # Patrón: <node id="78274" title="AbidjanFactory" lat="5.383386" lon="-4.090127" antenna_elevation="10" status="Planned" created="20150429 0346"/>
    patron = r'<node\s+id="(\d+)"[^>]*title="([^"]*)"[^>]*lat="([^"]*)"[^>]*lon="([^"]*)"[^>]*(?:antenna_elevation="([^"]*)")?[^>]*status="([^"]*)"[^>]*(?:created="([^"]*)")?[^>]*(?:updated="([^"]*)")?[^>]*>'
    
    matches = re.findall(patron, contenido, re.DOTALL)
    
    for match in matches:
        node_id = match[0]
        nodos_cnml[node_id] = {
            'id': node_id,
            'title': match[1] if match[1] else None,
            'lat': float(match[2]) if match[2] else None,
            'lon': float(match[3]) if match[3] else None,
            'antenna_elevation': match[4] if match[4] else None,
            'status': match[5] if match[5] else None,
            'created': match[6] if match[6] else None,
            'updated': match[7] if match[7] else None
        }
    
    print(f"✅ Encontrados {len(nodos_cnml)} nodos en el CNML (método regex)")
    return nodos_cnml

def enriquecer_geojson(archivo_geojson, nodos_cnml):
    """Añade la información del CNML al GeoJSON de nodos"""
    
    # Cargar GeoJSON existente
    with open(archivo_geojson, 'r', encoding='utf-8') as f:
        geojson = json.load(f)
    
    print(f"📁 GeoJSON original: {len(geojson['features'])} nodos")
    
    # Contadores para estadísticas
    enriquecidos = 0
    no_encontrados = 0
    
    # Para cada feature en el GeoJSON, buscar su ID en el CNML
    for feature in geojson['features']:
        # Intentar obtener el ID del nodo de diferentes formas
        node_id = None
        
        # Buscar en propiedades
        props = feature['properties']
        for campo in ['NODE_ID', 'id', 'ID']:
            if campo in props and props[campo]:
                node_id = str(props[campo])
                break
        
        if not node_id:
            # Intentar extraer del título o nombre
            for campo in ['NODE_NAME', 'name', 'title']:
                if campo in props:
                    # Buscar coincidencia por nombre (menos fiable)
                    for cnml_id, cnml_info in nodos_cnml.items():
                        if cnml_info['title'] and cnml_info['title'].lower() == props[campo].lower():
                            node_id = cnml_id
                            print(f"  🔍 Coincidencia por nombre: {props[campo]} -> ID {node_id}")
                            break
                    if node_id:
                        break
        
        if node_id and node_id in nodos_cnml:
            # Añadir campos del CNML
            cnml_info = nodos_cnml[node_id]
            props['antenna_elevation'] = cnml_info.get('antenna_elevation')
            props['created'] = cnml_info.get('created')
            props['updated'] = cnml_info.get('updated')
            props['cnml_title'] = cnml_info.get('title')
            enriquecidos += 1
        else:
            no_encontrados += 1
    
    print(f"📊 Resultado:")
    print(f"  ✅ Nodos enriquecidos: {enriquecidos}")
    print(f"  ⚠️  Nodos sin info CNML: {no_encontrados}")
    
    return geojson

def procesar_y_guardar():
    """Función principal"""
    
    # 1. Parsear CNML
    nodos_cnml = parsear_cnml(archivo_cnml)
    
    # Mostrar algunos ejemplos
    print("\n📝 Ejemplos de nodos en CNML:")
    for i, (node_id, info) in enumerate(list(nodos_cnml.items())[:5]):
        print(f"  ID {node_id}: {info['title']} - Altura: {info['antenna_elevation']}m - Creado: {info['created']}")
    
    print()
    
    # 2. Enriquecer GeoJSON
    geojson_enriquecido = enriquecer_geojson(archivo_nodos_geojson, nodos_cnml)
    
    # 3. Guardar resultado
    with open(archivo_salida, 'w', encoding='utf-8') as f:
        json.dump(geojson_enriquecido, f, indent=2, ensure_ascii=False)
    
    print(f"\n💾 Archivo guardado: {archivo_salida}")
    
    # 4. Mostrar estadísticas de campos
    print("\n📈 Estadísticas de campos enriquecidos:")
    campos_stats = {
        'antenna_elevation': 0,
        'created': 0,
        'updated': 0
    }
    
    for feature in geojson_enriquecido['features']:
        props = feature['properties']
        for campo in campos_stats:
            if campo in props and props[campo]:
                campos_stats[campo] += 1
    
    for campo, count in campos_stats.items():
        print(f"  {campo}: {count} nodos con valor")

# Ejecutar el proceso
if __name__ == "__main__":
    procesar_y_guardar()