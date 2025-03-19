import React, { useState, useEffect } from "react";
import { Button, Typography, Modal } from "antd";
import { useMap } from "../../../stores/useMap";
import MapControls from "./MapControls";
import MapDisplay from "./MapDisplay";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.vfs;

const { Paragraph, Text } = Typography;

const formatCoordinate = (coord) => Number(coord).toFixed(5);

const CoordinatesDisplay = ({ coordinates }) => {
  if (!coordinates) return null;

  return (
    <div style={{ marginTop: 16 }}>
      {coordinates.point && (
        <div style={{ marginBottom: 16 }}>
          <Text strong style={{ display: "block", marginBottom: 4 }}>
            Координаты точки:
          </Text>
          <Text code>
            {formatCoordinate(coordinates.point[0])},{" "}
            {formatCoordinate(coordinates.point[1])}
          </Text>
        </div>
      )}

      {coordinates.polygon?.length > 0 && (
        <div>
          <Text strong style={{ display: "block", marginBottom: 4 }}>
            Координаты вершин области:
          </Text>
          {coordinates.polygon.map(([lat, lon], index) => (
            <div key={index} style={{ marginBottom: 4 }}>
              <Text type="secondary" style={{ marginRight: 8 }}>
                Точка {index + 1}:
              </Text>
              <Text code>
                {formatCoordinate(lat)}, {formatCoordinate(lon)}
              </Text>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const MapModal = ({ visible, initialValue, onSave, onCancel }) => {
  const mapRef = React.useRef(null);
  const {
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
  } = useMap(initialValue);

  const showSavePdfButton =
    (mode === "point" && selectedPoint) ||
    (mode === "polygon" && polygonPoints.length >= 3) ||
    (mode === "areaAndPoint" && selectedPoint && polygonPoints.length >= 3);

  return (
    <Modal
      title="Выберите координаты на карте"
      visible={visible}
      onOk={() => onSave({ point: selectedPoint, polygon: polygonPoints })}
      onCancel={onCancel}
      width="90%"
      footer={[
        <Button key="back" onClick={onCancel}>
          Отмена
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={() =>
            onSave({ point: selectedPoint, polygon: polygonPoints })
          }
        >
          ОК
        </Button>,
      ]}
    >
      <Paragraph>
        Выберите режим работы: <strong>Точка</strong> — выберите одну точку на
        карте, или <strong>Область на карте</strong> — очертите нужную область,
        кликая по карте.
      </Paragraph>
      <MapControls
        mode={mode}
        onModeChange={handleModeChange}
        onClearPoint={clearPoint}
        onClearPolygon={clearPolygon}
        onChangeMapType={changeMapType}
        showSavePdfButton={showSavePdfButton}
        onSavePdf={() =>
          generatePDF(mode, selectedPoint, polygonPoints, mapRef, mapState)
        }
      />
      <div style={{ marginTop: "16px" }}>
        <MapDisplay
          mapState={mapState}
          onClick={(e) => handleMapClick(e.get("coords"))}
          selectedPoint={selectedPoint}
          polygonPoints={polygonPoints}
          mapRef={mapRef}
          onPolygonPointDrag={onPolygonPointDrag}
        />
      </div>
    </Modal>
  );
};

export default function MapInput({ value = {}, onChange }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [coordinates, setCoordinates] = useState(value);

  useEffect(() => {
    onChange?.(coordinates);
  }, [coordinates, onChange]);

  const handleSave = (data) => {
    setCoordinates(data);
    setModalVisible(false);
  };

  return (
    <div style={{ padding: "16px" }}>
      <Button type="primary" onClick={() => setModalVisible(true)}>
        Координаты на карте
      </Button>

      <MapModal
        visible={modalVisible}
        initialValue={coordinates}
        onSave={handleSave}
        onCancel={() => setModalVisible(false)}
      />

      <CoordinatesDisplay coordinates={coordinates} />
    </div>
  );
}
