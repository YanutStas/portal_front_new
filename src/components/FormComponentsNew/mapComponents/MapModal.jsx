import React from "react";
import { Button, Modal, Typography } from "antd";
import MapDisplay from "./MapDisplay";
import MapControls from "./MapControls";
import { useMap } from "../../../stores/useMap";

import styles from './Map.module.css'

const { Paragraph } = Typography

export default function MapModal({ visible, initialValue, onSave, onCancel }) {
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
                mapState={mapState}
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

