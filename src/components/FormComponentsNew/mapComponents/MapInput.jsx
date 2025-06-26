import React, { useState, } from "react";
import { Button, Card, Tag, Form, Flex } from "antd";
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
    setModalVisible(false);
    form.setFieldValue(name, {
      point: data.point && { lat: data.point[0], lon: data.point[1] },
      polygon: data.polygon?.map(item => ({ lat: item[0], lon: item[1] }))
    })
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
