import pandas as pd
import json
import os

cols = ["radio","mcc","net","area","cell","unit","lon","lat","range","samples","changeable","created","updated","averageSignal"]

df = pd.read_csv("214.csv", names=cols)
df = df[df["radio"].isin(["LTE", "NR"])]

mnc_operadoras = {
    1: "Vodafone", 6: "Vodafone", 24: "Vodafone", 40: "mnc_40",
    3: "Orange", 9: "Orange",
    22: "Digi",
    4: "Yoigo", 23: "Yoigo", 29: "Yoigo",
    5: "Telefónica", 7: "Telefónica", 38: "Telefónica",
    19: "Simyo",
    99: "mnc_99",
    700: "Iberdrola",
    701: "Endesa"
    
}

# Avisar de MNCs sin correspondencia
mncs_desconocidos = df[~df["net"].isin(mnc_operadoras.keys())]["net"].unique()
for mnc in mncs_desconocidos:
    count = len(df[df["net"] == mnc])
    print(f"AVISO: MNC {mnc} sin operadora asignada ({count} antenas)")

df["operadora"] = df["net"].map(mnc_operadoras)
df = df[df["operadora"].notna()]  # descarta desconocidos tras avisar

os.makedirs("geojsons", exist_ok=True)

for operadora in df["operadora"].unique():
    for radio in df["radio"].unique():
        subset = df[(df["operadora"] == operadora) & (df["radio"] == radio)]
        if len(subset) == 0:
            continue  # no crear geojson vacío
        
        features = []
        for _, row in subset.iterrows():
            features.append({
                "type": "Feature",
                "geometry": {"type": "Point", "coordinates": [row.lon, row.lat]},
                "properties": {
                    "radio": row.radio,
                    "operadora": row.operadora,
                    "mnc": row.net,
                    "range": row.range,
                    "samples": row.samples,
                    "changeable": row.changeable,
                }
            })
        
        geojson = {"type": "FeatureCollection", "features": features}
        nombre = f"geojsons/{operadora.replace('é','e').replace('ó','o')}_{radio}.geojson"
        with open(nombre, "w") as f:
            json.dump(geojson, f)
        print(f"Creado: {nombre} ({len(features)} antenas)")