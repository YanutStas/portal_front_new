import React, { useState } from "react";
import { Form, Slider } from "antd";

export default function SliderInput({
  name = "name",
  label = "Label",
  required = false,
  min = 0,
  max = 100,
  step = 1,
}) {
  const form = Form.useFormInstance();
  const [inputValue, setInputValue] = useState(min);
  const onChange = (value) => {
    form.setFieldValue(name, value);
    if (isNaN(value)) {
      return;
    }
    setInputValue(value);
  };
  const marks = {
    0: "0",
    7: "7",
    15: "15",
  };
  return (
    <Form.Item
      name={name}
      label={label}
      rules={[
        {
          required: required,
          message: "Это поле обязательное",
        },
      ]}
      initialValue={min}
    >
      <Slider
        marks={marks}
        min={min}
        max={max}
        onChange={onChange}
        value={typeof inputValue === "number" ? inputValue : 0}
        step={step}
        tooltip={{ open: true }}
      />
    </Form.Item>
  );
}
