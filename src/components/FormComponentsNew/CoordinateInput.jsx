import React from "react";
import { Form, InputNumber } from "antd";

export default function CoordinateInput({
  name = "name",
  disabled = false,
  required = false,
  depend = false,
  min = -365,
  max = 365,
  step = 0.000001,
}) {
  const form = Form.useFormInstance();
  const fieldDepends = Form.useWatch(depend && depend.field, form);
  return (
    <>
      <Form.Item
        name={[name, "Широта"]}
        label={"Широта"}
        rules={
          !(depend && !(depend.value == fieldDepends)) && [
            {
              required: required,
              message: "Это поле обязательное",
            },
          ]
        }
        hidden={depend && !(depend.value == fieldDepends)}
      >
        <InputNumber min={min} max={max} step={step} disabled={disabled} />
      </Form.Item>
      <Form.Item
        name={[name, "Долгота"]}
        label={"Долгота"}
        rules={
          !(depend && !(depend.value == fieldDepends)) && [
            {
              required: required,
              message: "Это поле обязательное",
            },
          ]
        }
        hidden={depend && !(depend.value == fieldDepends)}
      >
        <InputNumber min={min} max={max} step={step} disabled={disabled} />
      </Form.Item>
    </>
  );
}
