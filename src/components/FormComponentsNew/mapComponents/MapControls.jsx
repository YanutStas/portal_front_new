import React from "react";
import { Button, Radio, Flex } from "antd";

const MapControls = ({
  mode,
  onModeChange,
  onClearPoint,
  onClearPolygon,
  onChangeMapType,
  showSavePdfButton,
  onSavePdf,
  mapState,
  allowedModes = ["point", "polygon", "areaAndPoint"],
}) => {

  return (
    <Flex gap={10} justify="space-between" wrap="wrap">
      <Flex vertical gap={10} >

        <Flex>
          <Radio.Group
            onChange={(e) => onModeChange(e.target.value)}
            value={mode}
          >
            {allowedModes.includes("point") && (
              <Radio.Button value="point">Точка</Radio.Button>
            )}
            {allowedModes.includes("polygon") && (
              <Radio.Button value="polygon">Область на карте</Radio.Button>
            )}
            {allowedModes.includes("areaAndPoint") && (
              <Radio.Button value="areaAndPoint">Область + точка</Radio.Button>
            )}
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
      </Flex>
    </Flex>
  );
};

export default MapControls;
