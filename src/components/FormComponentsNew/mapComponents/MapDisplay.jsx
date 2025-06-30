import React from "react";
import {
  YMaps,
  Map,
  Placemark,
  Polygon,
  ZoomControl,
} from "@pbe/react-yandex-maps";

const MapDisplay = ({
  mapState,
  onClick,
  selectedPoint,
  polygonPoints,
  mapRef,
  onPolygonPointDrag,
}) => {
  return (
    <YMaps>
      <Map
        state={mapState}
        width="100%"
        height="70vh"
        onClick={onClick}
        instanceRef={mapRef}
      >
        <ZoomControl />
        {selectedPoint && (
          <Placemark
            geometry={selectedPoint}
            options={{
              draggable: true,
              preset: "islands#redCircleDotIcon", 
            }}
            onDragEnd={(e) => {
              const newCoords = e.get("target").geometry.getCoordinates();
              onPolygonPointDrag(newCoords, "point");
            }}
          />
        )}
        {polygonPoints?.length > 0 && (
          <>
            <Polygon
              geometry={[polygonPoints]}
              options={{
                fillColor: "rgba(0, 0, 255, 0.3)",
                strokeColor: "#0000FF",
                strokeWidth: 2,
              }}
            />
            {polygonPoints.map((point, index) => (
              <Placemark
                key={index}
                geometry={point}
                options={{
                  draggable: true,
                  preset: "islands#blueCircleDotIcon",
                }}
                onDragEnd={(e) => {
                  const newCoords = e.get("target").geometry.getCoordinates();
                  onPolygonPointDrag(newCoords, index);
                }}
              />
            ))}
          </>
        )}
      </Map>
    </YMaps>
  );
};

export default MapDisplay;
