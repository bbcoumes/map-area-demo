import mapboxgl from "!mapbox-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import React, { useRef, useEffect, useState } from "react";
import { area } from "@turf/turf";
import {
  MAPBOX_PUBLIC_KEY_TOKEN,
  DEFAULT_LONG,
  DEFAULT_LAT,
} from "./constants";
import retrieveAverageAnnualSolarRadiation from "./api";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";

mapboxgl.accessToken = MAPBOX_PUBLIC_KEY_TOKEN;

export default function MapView() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const drawControls = new MapboxDraw({
    displayControlsDefault: false,
    // Select which mapbox-gl-draw control buttons to add to the map.
    controls: {
      polygon: true,
      trash: true,
    },
  });
  const [lattitude, setLat] = useState(DEFAULT_LAT);
  const [longitude, setLong] = useState(DEFAULT_LONG);
  const [zoom, setZoom] = useState(16);
  const [nominalPower, setNominalPower] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // initialize map only once
    if (!map.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [longitude, lattitude],
        zoom: zoom,
      });
      map.current.addControl(drawControls);
      map.current.addControl(
        new mapboxgl.NavigationControl({ showZoom: true, showCompass: false })
      );
    }
  });

  useEffect(() => {
    // wait for map to initialize
    if (map.current) {
      map.current.on("move", () => {
        setLong(map.current.getCenter().lng.toFixed(4));
        setLat(map.current.getCenter().lat.toFixed(4));
        setZoom(map.current.getZoom().toFixed(2));
      });

      //set up draw functions
      map.current.on("draw.create", () => {
        updatePower();
      });
      map.current.on("draw.update", () => {
        updatePower();
      });
      map.current.on("draw.delete", () => {
        resetPower();
      });
    }
  });

  const updatePower = () => {
    if (drawControls && drawControls.getAll) {
      calculateNominalPower(drawControls.getAll());
    }
  };

  const resetPower = () => {
    setNominalPower(0);
  };

  //taken from https://docs.mapbox.com/mapbox-gl-js/example/mapbox-gl-draw/
  const calculateNominalPower = async data => {
    if (data && data.features.length > 0) {
      const areaInSquareKiloMeters = area(data);
      setLoading(true);
      const annualAverageSolarRaditationOnSolarPanels = await retrieveAverageAnnualSolarRadiation(
        {
          lattitude,
          longitude,
          solarPanelArea: areaInSquareKiloMeters,
        }
      );
      setLoading(false);
      setNominalPower(annualAverageSolarRaditationOnSolarPanels);
    }
  };

  return (
    <div className="container mx-auto">
      <div ref={mapContainer} className="h-[500px]" />
      {loading && <div className="space-y-2">Loading...</div>}
      {!loading && nominalPower > 0 && (
        <div className="mt-5 text-lg font-bold">
          Nominal Power(kWh) of Solar Panel: {nominalPower}
        </div>
      )}
    </div>
  );
}
