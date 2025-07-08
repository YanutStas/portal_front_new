import React from "react";
import { Form, Input, Switch } from "antd";
import WrapperComponent from "./WrapperComponent";

export default function HiddenInput({
  name = "name",
  defaultValue = false,
  dependOf = false,
  howDepend = false,
  span = false,
  stylesField_key = false,
  read = false
}) {
  if (defaultValue && defaultValue === "true") {
    defaultValue = true;
  }
  if (defaultValue && defaultValue === "false") {
    defaultValue = false;
  }

  const formElement = (
    <Form.Item
      name={name}
      initialValue={defaultValue}
      hidden
    >
      <Input />
    </Form.Item>
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
