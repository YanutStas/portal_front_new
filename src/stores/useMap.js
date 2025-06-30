import { useState } from "react";
import pdfMake from "pdfmake/build/pdfmake";

export const useMap = (initialValue = {}) => {
  const [mode, setMode] = useState("point");
  const [selectedPoint, setSelectedPoint] = useState(
    initialValue?.point || null
  );
  const [polygonPoints, setPolygonPoints] = useState(
    initialValue?.polygon || []
  );
  const [mapState, setMapState] = useState({
    center: [55.75, 37.62],
    zoom: 7,
    type: "yandex#map",
  });

  const handleModeChange = (newMode) => {
    setMode(newMode);
    if (newMode === "polygon" || newMode === "areaAndPoint") {
      setSelectedPoint(null);
    } else if (newMode === "point") {
      setPolygonPoints([]);
    }
  };

  const handleMapClick = (coords) => {
    if (mode === "point") {
      setSelectedPoint(coords);
    } else if (mode === "polygon") {
      setPolygonPoints((prev) => [...prev, coords]);
    } else if (mode === "areaAndPoint") {
      if (!selectedPoint) {
        setSelectedPoint(coords);
      } else {
        setPolygonPoints((prev) => [...prev, coords]);
      }
    }
  };

  const clearPolygon = () => {
    setPolygonPoints([]);
  };

  const clearPoint = () => {
    setSelectedPoint(null);
  };

  const changeMapType = (newType) => {
    setMapState((prev) => ({ ...prev, type: newType }));
  };

  const onPolygonPointDrag = (newCoords, index) => {
    if (index === "point") {
      setSelectedPoint(newCoords);
    } else {
      setPolygonPoints((prev) => {
        const newPoints = [...prev];
        newPoints[index] = newCoords;
        return newPoints;
      });
    }
  };

  const generatePDF = async (
    mode,
    selectedPoint,
    polygonPoints,
    mapRef,
    mapState
  ) => {
    if (
      (mode === "polygon" || mode === "areaAndPoint") &&
      polygonPoints.length < 3
    ) {
      console.error("Для сохранения области нужно выбрать минимум 3 точки.");
      return;
    }

    const mapTypeMapping = {
      "yandex#map": "map",
      "yandex#hybrid": "sat,skl",
    };

    const baseUrl = "https://static-maps.yandex.ru/1.x/";
    let center, zoom;

    if (mapRef.current) {
      center = mapRef.current.getCenter();
      zoom = mapRef.current.getZoom();
    } else {
      center = mapState.center;
      zoom = mapState.zoom;
    }

    const ll = `${center[1]},${center[0]}`;
    const size = "650,450";
    const l = mapTypeMapping[mapState.type] || "map";
    let overlays = "";

    let coordinatesText = "";
    if (mode === "point" && selectedPoint) {
      const pt = `${selectedPoint[1]},${selectedPoint[0]},pm2rdm`;
      overlays = `&pt=${pt}`;
      coordinatesText = `Координаты точки: ${selectedPoint[0].toFixed(
        5
      )}, ${selectedPoint[1].toFixed(5)}`;
    } else if (mode === "polygon" && polygonPoints.length >= 3) {
      const formatCoord = (coord) => Number(coord).toFixed(5);
      let pts = polygonPoints.map(
        ([lat, lon]) => `${formatCoord(lon)},${formatCoord(lat)}`
      );
      if (pts[0] !== pts[pts.length - 1]) pts.push(pts[0]);
      const polyline = pts.join(",");
      overlays = `&pl=${polyline}`;

      const pointMarkers = polygonPoints
        .map(
          ([lat, lon], index) =>
            `${lon.toFixed(5)},${lat.toFixed(5)},pm2rdm${index + 1}`
        )
        .join("~");
      overlays += `&pt=${pointMarkers}`;

      coordinatesText =
        "Координаты вершин области:\n" +
        polygonPoints
          .map(
            ([lat, lon], index) =>
              `Точка ${index + 1}: ${lat.toFixed(5)}, ${lon.toFixed(5)}`
          )
          .join("\n");
    } else if (mode === "areaAndPoint") {
      if (selectedPoint) {
        const pt = `${selectedPoint[1]},${selectedPoint[0]},pm2rdm`;
        overlays = `&pt=${pt}`;
        coordinatesText = `Координаты точки: ${selectedPoint[0].toFixed(
          5
        )}, ${selectedPoint[1].toFixed(5)}\n`;
      }
      if (polygonPoints.length >= 3) {
        const formatCoord = (coord) => Number(coord).toFixed(5);
        let pts = polygonPoints.map(
          ([lat, lon]) => `${formatCoord(lon)},${formatCoord(lat)}`
        );
        if (pts[0] !== pts[pts.length - 1]) pts.push(pts[0]);
        const polyline = pts.join(",");
        overlays += `&pl=${polyline}`;

        const pointMarkers = polygonPoints
          .map(
            ([lat, lon], index) =>
              `${lon.toFixed(5)},${lat.toFixed(5)},pm2rdm${index + 1}`
          )
          .join("~");
        overlays += `&pt=${pointMarkers}`;

        coordinatesText +=
          "Координаты вершин области:\n" +
          polygonPoints
            .map(
              ([lat, lon], index) =>
                `Точка ${index + 1}: ${lat.toFixed(5)}, ${lon.toFixed(5)}`
            )
            .join("\n");
      }
    }

    const url = `${baseUrl}?ll=${ll}&z=${zoom}&size=${size}&l=${l}${overlays}`;
    console.log("Сформированный URL для статической карты:", url);

    try {
      const response = await fetch(url);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Ошибка при получении изображения карты: ${errorText}`);
      }

      const blob = await response.blob();
      const base64data = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = () => reject(reader.error);
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });

      const docDefinition = {
        content: [
          { text: "Карта", style: "header" },
          {
            image: base64data,
            width: 500,
          },
          { text: coordinatesText, style: "coordinates" },
        ],
        styles: {
          header: {
            fontSize: 18,
            bold: true,
            marginBottom: 15,
          },
          coordinates: {
            fontSize: 12,
            marginTop: 10,
            marginBottom: 10,
          },
        },
      };

      pdfMake.fonts = {
        Roboto: {
          normal:
            "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf",
          bold: "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf",
          italics:
            "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Italic.ttf",
          bolditalics:
            "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-MediumItalic.ttf",
        },
      };

      pdfMake.createPdf(docDefinition).download("map.pdf");
    } catch (error) {
      console.error("Ошибка при загрузке изображения карты:", error);
    }
  };

  return {
    mode,
    selectedPoint,
    polygonPoints,
    mapState,
    handleModeChange,
    handleMapClick,
    clearPolygon,
    clearPoint,
    changeMapType,
    generatePDF,
    onPolygonPointDrag,
  };
};