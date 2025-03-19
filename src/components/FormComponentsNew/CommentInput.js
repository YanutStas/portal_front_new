import React from "react";
import { Form, Input } from "antd";
import WrapperComponent from "./WrapperComponent";

export default function CommentInput({
  name = "name",
  label = "Label",
  disabled = false,
  placeholder = "",
  required = false,
  dependOf = false,
  howDepend = false,
  span = false,
  stylesField_key = false,
}) {
  const formElement = (
    <Form.Item
      style={{ flex: 1 }}
      name={name}
      label={label}
      rules={[
        {
          required: required,
        },
      ]}
    >
      <Input.TextArea
        placeholder={placeholder}
        disabled={disabled}
        autoSize={{ minRows: 2, maxRows: 6 }}
      />
    </Form.Item>
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
