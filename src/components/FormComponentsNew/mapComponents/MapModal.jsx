import React from "react";
import { Button, Modal, Form, InputNumber, Flex } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import MapDisplay from "./MapDisplay";
import MapControls from "./MapControls";
import { useMap } from "../../../stores/useMap";

import styles from './Map.module.css'

export default function MapModal({ visible, initialValue, onSave, onCancel, type = null }) {
    const mapRef = React.useRef(null);
    const [latInput, setLatInput] = React.useState();
    const [lonInput, setLonInput] = React.useState();
    const [polyInputs, setPolyInputs] = React.useState(
      initialValue?.polygon?.length
        ? initialValue.polygon.map(([lat, lon]) => ({ lat, lon }))
        : Array.from({ length: 4 }, () => ({ lat: undefined, lon: undefined }))
    );

    const allowedModes =
        type === "point"
            ? ["point"]
            : type === "area"
            ? ["polygon"]
            : ["point", "polygon", "areaAndPoint"];

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
        setPoint,
        setPolygon,
    } = useMap(initialValue);

    React.useEffect(() => {
        if (!allowedModes.includes(mode)) {
            handleModeChange(allowedModes[0]);
        }
    }, [allowedModes, mode, handleModeChange]);

    React.useEffect(() => {
      setLatInput(selectedPoint ? selectedPoint[0] : undefined);
      setLonInput(selectedPoint ? selectedPoint[1] : undefined);
    }, [selectedPoint]);

    React.useEffect(() => {
      if (polygonPoints.length) {
        setPolyInputs(polygonPoints.map(([lat, lon]) => ({ lat, lon })));
      }
    }, [polygonPoints]);

    const updatePoint = (lat, lon) => {
      setLatInput(lat);
      setLonInput(lon);
      if (Number.isFinite(lat) && Number.isFinite(lon)) {
        setPoint([lat, lon]);
      } else {
        clearPoint();
      }
    };

    const updatePolygon = (arr) => {
      setPolyInputs(arr);
      const clean = arr.filter(v => Number.isFinite(v.lat) && Number.isFinite(v.lon));
      if (clean.length >= 3) {
        setPolygon(clean.map(v => [v.lat, v.lon]));
      } else {
        clearPolygon();
      }
    };

    const addPolygonVertex = () => {
      setPolyInputs([...polyInputs, { lat: undefined, lon: undefined }]);
    };

    const handleClearPolygon = () => {
      clearPolygon();
      setPolyInputs(
        Array.from({ length: 4 }, () => ({ lat: undefined, lon: undefined }))
      );
    };

    const handleClearPoint = () => {
      clearPoint();
      setLatInput(undefined);
      setLonInput(undefined);
    };

    const showSavePdfButton =
        (mode === "point" && selectedPoint) ||
        (mode === "polygon" && polygonPoints.length >= 3) ||
        (mode === "areaAndPoint" && selectedPoint && polygonPoints.length >= 3);

    return (
        <Modal
            title="Выберите координаты на карте"
            open={visible}
            onOk={() => onSave({ point: selectedPoint, polygon: polygonPoints })}
            onCancel={onCancel}
            width="90%"
            footer={[
                <Button key="cancel" onClick={onCancel}>
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
            // style={{paddingBottom:80}}
            className={styles.modal}
        >
            <MapControls
                mode={mode}
                onModeChange={handleModeChange}
                onClearPoint={handleClearPoint}
                onClearPolygon={handleClearPolygon}
                onChangeMapType={changeMapType}
                showSavePdfButton={showSavePdfButton}
                onSavePdf={() =>
                    generatePDF(mode, selectedPoint, polygonPoints, mapRef, mapState)
                }
                mapState={mapState}
                allowedModes={allowedModes}
            />
            <Flex gap={16} style={{ marginTop: 16 }} align="flex-start">
              {/* Левая колонка */}
              <div style={{ width: 340, maxHeight: "70vh", overflowY: "auto" }}>
                {mode === "point" && (
                  <Form layout="vertical">
                    <Form.Item label="Широта">
                      <InputNumber
                        value={latInput}
                        onChange={(val) => updatePoint(val, lonInput)}
                        min={-90}
                        max={90}
                        step={0.00001}
                        style={{ width: "100%" }}
                      />
                    </Form.Item>
                    <Form.Item label="Долгота">
                      <InputNumber
                        value={lonInput}
                        onChange={(val) => updatePoint(latInput, val)}
                        min={-180}
                        max={180}
                        step={0.00001}
                        style={{ width: "100%" }}
                      />
                    </Form.Item>
                  </Form>
                )}

                {mode === "areaAndPoint" && (
                  <>
                    <div style={{ fontWeight: 600, marginBottom: 4 }}>Точка:</div>
                    <Form layout="vertical" style={{ marginBottom: 16 }}>
                      <Form.Item label="Широта">
                        <InputNumber
                          value={latInput}
                          onChange={(val) => updatePoint(val, lonInput)}
                          min={-90}
                          max={90}
                          step={0.00001}
                          style={{ width: "100%" }}
                        />
                      </Form.Item>
                      <Form.Item label="Долгота">
                        <InputNumber
                          value={lonInput}
                          onChange={(val) => updatePoint(latInput, val)}
                          min={-180}
                          max={180}
                          step={0.00001}
                          style={{ width: "100%" }}
                        />
                      </Form.Item>
                    </Form>
                    <div style={{ fontWeight: 600, margin: "8px 0 4px" }}>Область:</div>
                  </>
                )}

                {(mode === "polygon" || mode === "areaAndPoint") && (
                  <>
                    {mode === "polygon" && (
                      <div style={{ fontWeight: 600, marginBottom: 4 }}>Область:</div>
                    )}
                    <Flex vertical gap={8}>
                      {polyInputs.map((v, idx) => (
                        <Flex key={idx} gap={8} align="center">
                          <InputNumber
                            value={v.lat}
                            placeholder={`Широта ${idx + 1}`}
                            onChange={(val) => {
                              const next = [...polyInputs];
                              next[idx] = { ...next[idx], lat: val };
                              updatePolygon(next);
                            }}
                            min={-90}
                            max={90}
                            step={0.00001}
                            style={{ width: 110 }}
                          />
                          <InputNumber
                            value={v.lon}
                            placeholder={`Долгота ${idx + 1}`}
                            onChange={(val) => {
                              const next = [...polyInputs];
                              next[idx] = { ...next[idx], lon: val };
                              updatePolygon(next);
                            }}
                            min={-180}
                            max={180}
                            step={0.00001}
                            style={{ width: 110 }}
                          />
                          <Button
                            type="text"
                            shape="circle"
                            size="small"
                            icon={<DeleteOutlined />}
                            danger
                            disabled={polyInputs.length <= 3}
                            onClick={() => {
                              const next = polyInputs.filter((_, i) => i !== idx);
                              updatePolygon(next);
                            }}
                          />
                        </Flex>
                      ))}
                      <Button
                        icon={<PlusOutlined />}
                        onClick={addPolygonVertex}
                      >
                        Добавить вершину
                      </Button>
                    </Flex>
                  </>
                )}
              </div>

              {/* Карта */}
              <div style={{ flex: 1 }}>
                <MapDisplay
                  mapState={mapState}
                  onClick={(e) => handleMapClick(e.get("coords"))}
                  selectedPoint={selectedPoint}
                  polygonPoints={polygonPoints}
                  mapRef={mapRef}
                  onPolygonPointDrag={onPolygonPointDrag}
                />
              </div>
            </Flex>
        </Modal>
    );
};
