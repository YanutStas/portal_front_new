import React, { useState } from "react";
import { Button, Card, Tag, Form, Flex, InputNumber, Radio } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import MapModal from "./MapModal";

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import WrapperComponent from "../WrapperComponent";
import CoordinatesDisplay from "./CoordinatesDisplay";

pdfMake.vfs = pdfFonts.vfs;

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
  read = false,
  type = null,
}) {
  const form = Form.useFormInstance();
  const [modalVisible, setModalVisible] = useState(false);
  const [coordinates, setCoordinates] = useState(null);
  const [latInput, setLatInput] = useState();
  const [lonInput, setLonInput] = useState();
  const [polygonInputs, setPolygonInputs] = useState(
    Array.from({ length: 4 }, () => ({ lat: undefined, lon: undefined }))
  );

  const allowedUI = type === "point" ? ["point"] : type === "area" ? ["polygon"] : ["point", "polygon"];
  const [uiMode, setUiMode] = useState(allowedUI[0]);

  React.useEffect(() => {
    if (uiMode === "point") {
      setPolygonInputs(Array.from({ length: 4 }, () => ({ lat: undefined, lon: undefined })));
      updatePolygonFromInputs([]);
    } else {
      setLatInput(undefined);
      setLonInput(undefined);
      updateCoordsFromInput(undefined, undefined);
    }
  }, [uiMode]);

  const handleSave = (data) => {
    console.log("MapModal onSave ->", data);
    setCoordinates(data);
    if (data.polygon?.length >= 3 && allowedUI.includes("polygon")) {
      setUiMode("polygon");
    } else if (data.point && allowedUI.includes("point")) {
      setUiMode("point");
    }
    setModalVisible(false);
    form.setFieldValue(name, {
      point: data.point && { lat: data.point[0], lon: data.point[1] },
      polygon: data.polygon?.map((item) => ({ lat: item[0], lon: item[1] })),
    });
  };
  const handlerDel = () => {
    setCoordinates(null);
    setLatInput(undefined);
    setLonInput(undefined);
    setPolygonInputs(Array.from({ length: 4 }, () => ({ lat: undefined, lon: undefined })));
    form.setFieldValue(name, null);
  };

  React.useEffect(() => {
    if (coordinates?.point) {
      setLatInput(coordinates.point[0]);
      setLonInput(coordinates.point[1]);
    } else {
      setLatInput(undefined);
      setLonInput(undefined);
    }
  }, [coordinates]);

  React.useEffect(() => {
    if (coordinates?.polygon?.length) {
      setPolygonInputs(
        coordinates.polygon.map(([lat, lon]) => ({ lat, lon }))
      );
    }
  }, [coordinates]);

  const updateCoordsFromInput = (latVal, lonVal) => {
    if (Number.isFinite(latVal) && Number.isFinite(lonVal)) {
      const data = { point: [latVal, lonVal], polygon: [] };
      setCoordinates(data);
      form.setFieldValue(name, { point: { lat: latVal, lon: lonVal }, polygon: [] });
    } else {
      setCoordinates(null);
      form.setFieldValue(name, null);
    }
  };

  const updatePolygonFromInputs = (arr) => {
    setPolygonInputs(arr);
    const clean = arr.filter(v => Number.isFinite(v.lat) && Number.isFinite(v.lon));
    if (clean.length >= 3) {
      const poly = clean.map(v => [v.lat, v.lon]);
      setCoordinates({ point: coordinates?.point || null, polygon: poly });
      form.setFieldValue(name, {
        point: coordinates?.point && { lat: coordinates.point[0], lon: coordinates.point[1] },
        polygon: poly.map(([lat, lon]) => ({ lat, lon })),
      });
    } else {
      setCoordinates({ point: coordinates?.point || null, polygon: [] });
    }
  };

  const isAttached = !!coordinates;
  const formElement = (
    <Card
      title={label}
      style={{
        borderColor: isAttached ? "green" : "red",
        minHeight: 300,
        height: "100%",
      }}
      styles={{
        title: {
          whiteSpace: "break-spaces",
        },
        body: {
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        },
      }}
      extra={
        isAttached ? (
          <Tag color="green">Добавлены</Tag>
        ) : (
          <Tag color="red">НЕ добавлены</Tag>
        )
      }
    >
      <Form.Item
        name={name}
        rules={[
          {
            required: required,
            message: "Это поле обязательное",
          },
        ]}
      ></Form.Item>
      <Button type="primary" onClick={() => setModalVisible(true)}>
        Координаты на карте
      </Button>

      {/* Переключатель режима ввода */}
      {allowedUI.length > 1 && (
        <Radio.Group
          value={uiMode}
          onChange={(e) => setUiMode(e.target.value)}
          style={{ marginTop: 16 }}
        >
          <Radio.Button value="point">Точка</Radio.Button>
          <Radio.Button value="polygon">Область</Radio.Button>
        </Radio.Group>
      )}

      {/* Manual coordinate input (point mode) */}
      {uiMode === "point" && (
        <Flex gap={10} style={{ marginTop: 16 }} wrap="wrap">
          <Form.Item
            label="Широта"
            style={{ flex: "1 1 50%" }}
            colon={false}
          >
            <InputNumber
              value={latInput}
              onChange={(val) => {
                setLatInput(val);
                updateCoordsFromInput(val, lonInput);
              }}
              min={-90}
              max={90}
              step={0.00001}
              style={{ width: "100%" }}
            />
          </Form.Item>

          <Form.Item
            label="Долгота"
            style={{ flex: "1 1 50%" }}
            colon={false}
          >
            <InputNumber
              value={lonInput}
              onChange={(val) => {
                setLonInput(val);
                updateCoordsFromInput(latInput, val);
              }}
              min={-180}
              max={180}
              step={0.00001}
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Flex>
      )}

      {uiMode === "polygon" && (
        <Flex vertical gap={10} style={{ marginTop: 16 }}>
          {polygonInputs.map((v, idx) => (
            <Flex key={idx} gap={10} align="center" wrap="wrap">
              <Form.Item
                label={`Широта ${idx + 1}`}
                style={{ flex: "1 1 40%" }}
                colon={false}
              >
                <InputNumber
                  value={v.lat}
                  onChange={(val) => {
                    const next = [...polygonInputs];
                    next[idx] = { ...next[idx], lat: val };
                    updatePolygonFromInputs(next);
                  }}
                  min={-90}
                  max={90}
                  step={0.00001}
                  style={{ width: "100%" }}
                />
              </Form.Item>
              <Form.Item
                label={`Долгота ${idx + 1}`}
                style={{ flex: "1 1 40%" }}
                colon={false}
              >
                <InputNumber
                  value={v.lon}
                  onChange={(val) => {
                    const next = [...polygonInputs];
                    next[idx] = { ...next[idx], lon: val };
                    updatePolygonFromInputs(next);
                  }}
                  min={-180}
                  max={180}
                  step={0.00001}
                  style={{ width: "100%" }}
                />
              </Form.Item>
              <Button
                type="text"
                icon={<DeleteOutlined />}
                shape="circle"
                size="small"
                danger
                disabled={polygonInputs.length <= 3}
                style={{ alignSelf: "flex-end", marginBottom: 4 }}
                onClick={() => {
                  const next = polygonInputs.filter((_, i) => i !== idx);
                  updatePolygonFromInputs(next);
                }}
              />
            </Flex>
          ))}
          <Button
            icon={<PlusOutlined />}
            onClick={() => {
              updatePolygonFromInputs([...polygonInputs, { lat: undefined, lon: undefined }]);
            }}
            style={{ minWidth: 160 }}
          >
            Добавить вершину
          </Button>
        </Flex>
      )}

      <MapModal
        visible={modalVisible}
        type={type}
        initialValue={coordinates}
        onSave={handleSave}
        onCancel={() => setModalVisible(false)}
      />

      <Flex vertical gap={10}>
        <CoordinatesDisplay coordinates={coordinates} />
        {isAttached && (
          <Button onClick={handlerDel} danger>
            Удалить координаты
          </Button>
        )}
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
  );
}
