import React from "react";
import { Button, Radio, Space, Row, Col, Flex } from "antd";

const MapControls = ({
  mode,
  onModeChange,
  onClearPoint,
  onClearPolygon,
  onChangeMapType,
  showSavePdfButton,
  onSavePdf,
  mapState
}) => {

  return (
    <Flex gap={10} justify="space-between" wrap="wrap">
      <Flex vertical gap={10} >

        <Flex>
          <Radio.Group
            onChange={(e) => onModeChange(e.target.value)}
            value={mode}
          >
            <Radio.Button value="point">Точка</Radio.Button>
            <Radio.Button value="polygon">Область на карте</Radio.Button>
            <Radio.Button value="areaAndPoint">Область + точка</Radio.Button>
          </Radio.Group>
        </Flex>

        <Flex align="end">
          {mode === "point" && (
            <Button onClick={onClearPoint} danger>
              Убрать точку
            </Button>
          )}
          {(mode === "polygon") && (
            <Button onClick={onClearPolygon} danger>
              Убрать область
            </Button>
          )}
          {(mode === "areaAndPoint") && (
            <Flex gap={5}>
              <Button onClick={onClearPoint} danger>
                Убрать точку
              </Button>
              <Button onClick={onClearPolygon} danger>
                Убрать область
              </Button>
            </Flex>
          )}
        </Flex>

      </Flex>
      <Flex gap={5} align="end" wrap="wrap">
        {showSavePdfButton && (
          <Button type="primary" onClick={onSavePdf}>
            Сохранить в PDF
          </Button>
        )}

        <Radio.Group
          onChange={(e) => onChangeMapType(e.target.value)}
          value={mapState?.type}
        >
          <Radio.Button value="yandex#map">Стандартный вид</Radio.Button>
          <Radio.Button value="yandex#hybrid">Спутниковый вид</Radio.Button>
        </Radio.Group>



        {/* <Button type={mapState?.type === "yandex#map" && "primary"} onClick={() => onChangeMapType("yandex#map")}>
          Стандартный вид
        </Button>
        <Button onClick={() => onChangeMapType("yandex#hybrid")}>
          Спутниковый вид
        </Button> */}
      </Flex>
    </Flex>
  );
};

export default MapControls;
