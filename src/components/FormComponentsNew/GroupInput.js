import React from "react";
import { Typography, theme, Row } from "antd";

import selectComponent from "../selectComponent";
import WrapperComponent from "./WrapperComponent";

export default function GroupInput({
  name = "name",
  label = "",
  dependOf = false,
  howDepend = false,
  fields: Fields = [],
  stylesField_key = false,
  span = false,
}) {
  const { colorBgContainer, colorBorder } = theme.useToken().token;

  const formElement = (
    <div
      style={{
        backgroundColor: colorBgContainer,

        borderColor: colorBorder,
        color: colorBorder,
      }}
      className={"formElement groupInput"}
    >
      <Typography.Title level={5} style={{ margin: "0 0 10px 0" }}>
        {label}
      </Typography.Title>

      <Row gutter={[20, 20]} align={"stretch"}>
        {Fields.map(selectComponent)}
      </Row>
    </div>
  );

  return (
    <WrapperComponent
      span={span}
      stylesField_key={stylesField_key}
      dependOf={dependOf}
      howDepend={howDepend}
      name={name}
    >
      {formElement}
    </WrapperComponent>
  );
}
