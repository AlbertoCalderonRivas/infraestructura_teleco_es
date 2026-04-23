#!/bin/bash

mkdir -p pmtiles

for geojson in geojsons/*.geojson; do
    nombre=$(basename "$geojson" .geojson)
    echo "Procesando: $nombre"
    tippecanoe -z16 -Z0 -pf -pk -B 0 \
        -o "pmtiles/${nombre}.pmtiles" \
        -l antenas \
        "$geojson"
    echo "Creado: pmtiles/${nombre}.pmtiles"
done

echo "Proceso completado"