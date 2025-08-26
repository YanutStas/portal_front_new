import React, { useState } from "react";
import { Button, Card, Tag, Form, Flex } from "antd";
import MapModal from "./MapModal";

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import WrapperComponent from "../WrapperComponent";
import CoordinatesDisplay from "./CoordinatesDisplay";
import InfoDrawer from "../../InfoDrawer";

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

  const handleSave = (data) => {
    console.log("MapModal onSave ->", data);
    setCoordinates(data);
    setModalVisible(false);
    form.setFieldValue(name, {
      point: data.point && { lat: data.point[0], lon: data.point[1] },
      polygon: data.polygon?.map((item) => ({ lat: item[0], lon: item[1] })),
    });
  };
  const handlerDel = () => {
    setCoordinates(null);
    form.setFieldValue(name, null);
  };

  const isAttached = !!coordinates;
  const formElement = (
    <Card
      title={label}
      style={{
        borderColor: isAttached ? "green" : required ? "red" : "#1677ff",
        // minHeight: 300,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
      styles={{
        title: {
          whiteSpace: "break-spaces",
          paddingTop: 5,
          paddingBottom: 5
        },
        body: {
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 10
        },
      }}
      extra={
        // isAttached ? (
        //   <Tag color="green">Добавлены</Tag>
        // ) : required ? (
        //   <Tag color="red">НЕ добавлены</Tag>
        // ) : (
        //   <Tag color="blue">НЕ добавлены</Tag>
        // )
        <>
          {fullDescription ? (
            <InfoDrawer fullDescription={fullDescription}></InfoDrawer>
          ) : (
            false
          )}
        </>
      }
      actions={[
        <>
          {required && <Tag color="red">Обязателен</Tag>}
          {isAttached ? <Tag color="green">Добавлен</Tag> : <Tag color={"blue"}>НЕ добавлен</Tag>}
        </>
      ]}
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
