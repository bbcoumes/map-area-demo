import mapboxgl from "!mapbox-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import React, { useRef, useEffect, useState, useReducer } from "react";
import { area } from "@turf/turf";
import {
  updateArea,
  updateCurrentLat,
  updateCurrentLong,
  updateNominalPower,
} from "./Actions";
import {
  MAPBOX_PUBLIC_KEY_TOKEN,
  DEFAULT_LONG,
  DEFAULT_LAT,
} from "./constants";
import { initialState, reducer } from "./Reducer";
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
  const [state, dispatch] = useReducer(reducer, initialState);
  const [lat, setLat] = useState(DEFAULT_LAT);
  const [long, setLong] = useState(DEFAULT_LONG);
  const [zoom, setZoom] = useState(16);

  useEffect(() => {
    // initialize map only once
    if (!map.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [long, lat],
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
        console.log({
          currentLat: map.current.getCenter().lat.toFixed(4),
          currentLong: map.current.getCenter().lng.toFixed(4),
        });
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

  const updatePower = async () => {
    updateCurrentLat(dispatch, lat);
    updateCurrentLong(dispatch, long);
    if (drawControls && drawControls.getAll) {
      calculateArea(drawControls.getAll());
    }
  };

  const resetPower = () => {
    updateArea(dispatch, 0);
    updateNominalPower(dispatch, 0);
  };

  //taken from https://docs.mapbox.com/mapbox-gl-js/example/mapbox-gl-draw/
  const calculateArea = data => {
    if (data && data.features.length > 0) {
      const areaInSquareKiloMeters = area(data);
      updateArea(dispatch, areaInSquareKiloMeters);
    }
  };

  return (
    <div className="container mx-auto">
      <div ref={mapContainer} className="h-[500px]" />
      {state.currentArea > 0 && (
        <div>Calculated Area: {state.currentArea} square meters</div>
      )}
    </div>
  );
}
