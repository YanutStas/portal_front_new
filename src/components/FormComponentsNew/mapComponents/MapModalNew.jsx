import { Button, Modal } from "antd";
import { useState } from "react";
import MapDisplay from "./MapDisplay";

export default function MapModalNew({ visible, initialValue, onSave, onCancel, type = null }) {
    const [selectedPoint, setSelectedPoint] = useState([])
    const [polygonPoints, setPolygonPoints] = useState([])
    return (
        <>
            <Modal
                // destroyOnHidden
                title="Выберите координаты на карте"
                open={visible}
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
            >
                <MapDisplay coordinates={selectedPoint} polygonPoints={polygonPoints} setPolygonPoints={setPolygonPoints} setSelectedPoint={setSelectedPoint} />
            </Modal>
        </>
    )
}