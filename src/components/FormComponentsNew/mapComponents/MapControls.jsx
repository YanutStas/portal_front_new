import React from "react";
import { Button, Radio, Space, Row, Col } from "antd";

const MapControls = ({
  mode,
  onModeChange,
  onClearPoint,
  onClearPolygon,
  onChangeMapType,
  showSavePdfButton,
  onSavePdf,
}) => {
  return (
    <Space direction="vertical" size="middle" style={{ width: "100%" }}>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12}>
          <Radio.Group
            onChange={(e) => onModeChange(e.target.value)}
            value={mode}
          >
            <Radio.Button value="point">Точка</Radio.Button>
            <Radio.Button value="polygon">Область на карте</Radio.Button>
            <Radio.Button value="areaAndPoint">Область + точка</Radio.Button>
          </Radio.Group>
        </Col>
        <Col xs={24} sm={12} style={{ display: "flex", alignItems: "center" }}>
          {mode === "point" && (
            <Button onClick={onClearPoint} danger>
              Сбросить точку
            </Button>
          )}
          {(mode === "polygon" || mode === "areaAndPoint") && (
            <Button onClick={onClearPolygon} danger>
              Очистить область
            </Button>
          )}
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col>
          <Button onClick={() => onChangeMapType("yandex#map")}>
            Стандартный вид
          </Button>
        </Col>
        <Col>
          <Button onClick={() => onChangeMapType("yandex#hybrid")}>
            Спутниковый вид
          </Button>
        </Col>
        {showSavePdfButton && (
          <Col>
            <Button type="primary" onClick={onSavePdf}>
              Сохранить в PDF
            </Button>
          </Col>
        )}
      </Row>
    </Space>
  );
};

export default MapControls;
