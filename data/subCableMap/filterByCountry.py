import geopandas as gpd

# Rutas a tus archivos
cables_path = 'subCable.geojson'
country_filter_path = r"..\ign\au_AdministrativeUnit_1stOrder0.gml"
output_path = "subCable_spain.geojson" #cambiar nombre de archivo

print("Leyendo archivos...")
cables = gpd.read_file(cables_path)
country = gpd.read_file(country_filter_path)

print(f"CRS cables: {cables.crs}")
print(f"CRS country: {country.crs}")

# Alinear CRS
cables = cables.to_crs(country.crs)

# Unir todos los polígonos del pais en uno solo
country_geom = country.union_all()

# Filtrar cables que intersectan con el pais
print("Filtrando...")
mask = cables.geometry.intersects(country_geom)
cables_country = cables[mask].to_crs("EPSG:4326")

print(f"Total cables: {len(cables)}")
print(f"Cables que tocan España: {len(cables_country)}")

cables_country.to_file(output_path, driver="GeoJSON")
print(f"Guardado en: {output_path}")