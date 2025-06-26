import React, { useState, useEffect } from "react";
import { Button, Typography, Modal, Card, Tag, Form, Flex } from "antd";
import { useMap } from "../../../stores/useMap";
import MapControls from "./MapControls";
import MapDisplay from "./MapDisplay";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import WrapperComponent from "../WrapperComponent";
import CoordinatesDisplay from "./CoordinatesDisplay";

pdfMake.vfs = pdfFonts.vfs;
const { Paragraph, Text } = Typography;





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

export default function MapInput({
  name = "name",
  label = "Поле",
  defaultValue = false,
  placeholder = "",
  category_key = null,
  required = false,
  dependOf = false,
  howDepend = false,
  span = false,
  fullDescription = false,
  stylesField_key = false,
  read = false
}) {
  const form = Form.useFormInstance()
  const [modalVisible, setModalVisible] = useState(false);
  const [coordinates, setCoordinates] = useState(null);

  // useEffect(() => {
  //   onChange?.(coordinates);
  // }, [coordinates, onChange]);

  const handleSave = (data) => {
    setCoordinates(data);
    form.setFieldValue(name, {
      point: { lat: data.point[0], lon: data.point[1] },
      polygon: data.polygon?.map(item => ({ lat: item[0], lon: item[1] }))
    })
    setModalVisible(false);
  };
  const handlerDel = () => {
    setCoordinates(null);
    form.setFieldValue(name, null)
  }
  const isAttached = !!coordinates;
  const formElement = (
    <Card
      title={label}
      style={{
        borderColor: isAttached ? "green" : "red",
        minHeight: 300,
        height: "100%"
      }}
      styles={{
        title: {
          whiteSpace: "break-spaces"
        },
        body: {
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        },
      }}
      extra={isAttached ? <Tag color='green'>Добавлены</Tag> : <Tag color='red'>НЕ добавлены</Tag>}
    >
      <Form.Item
        name={name}
        rules={[
          {
            required: required,
            message: "Это поле обязательное",
          },
        ]}
      >
      </Form.Item>
      <Button type="primary" onClick={() => setModalVisible(true)}>
        Координаты на карте
      </Button>

      <MapModal
        visible={modalVisible}
        initialValue={coordinates}
        onSave={handleSave}
        onCancel={() => setModalVisible(false)}
      />

      <Flex vertical gap={10}>

        <CoordinatesDisplay coordinates={coordinates} />
        {isAttached &&
          <Button onClick={handlerDel} danger>Удалить координаты</Button>
        }
      </Flex>
    </Card>
  );
  return (
    <WrapperComponent
      span={span}
      stylesField_key={stylesField_key}
      dependOf={dependOf}
      howDepend={howDepend}
      name={name}
      read={read}
    >
      {formElement}
    </WrapperComponent>
  )
}
