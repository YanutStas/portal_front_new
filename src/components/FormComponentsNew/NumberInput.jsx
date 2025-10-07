import React, { useEffect, useState } from "react";
import { Form, InputNumber } from "antd";
import useServices from "../../stores/useServices";
import useTemp from "../../stores/Cabinet/useTemp";
import WrapperComponent from "./WrapperComponent";
import InfoDrawer from "../InfoDrawer";

export default function NumberInput({
  name = "name",
  label = "",
  disabled = false,
  required = undefined,
  dependOf = false,
  howDepend = false,
  min = 0,
  max = false,
  step = 1,
  defaultValue = false,
  length = false,
  properties = false,
  ractionDigits = 0,
  span = false,
  fullDescription = false,
  stylesField_key = false,
  read = false
}) {
  const [stepMain, setStepMain] = useState(step);
  const serviceItem = useServices((state) => state.serviceItem);
  const unit = useTemp((state) => state.unit);
  const setUnit = useTemp((state) => state.setUnit);
  const form = Form.useFormInstance();

  let objectProp = null;
  if (properties) objectProp = properties;

  let idLine = Form.useWatch(objectProp?.unit?.idLine || "", form);
  useEffect(() => {
    if (objectProp?.unit && objectProp?.unit?.idLine) {
      if (serviceItem.fields) {
        const field = serviceItem.fields.find(
          (item) => item.idLine === objectProp?.unit?.idLine
        );
        if (serviceItem.links[field?.component?.Ref_Key]) {
          setUnit(
            name,
            serviceItem.links[field?.component?.Ref_Key].options.find(
              (item) =>
                item.value === form.getFieldValue(objectProp?.unit?.idLine)
            )?.ЕдиницаИзмеренияНаименование
          );
        }
      }
    }
    if (objectProp?.unit?.value) {
      setUnit(name, objectProp?.unit?.value);
    }
  }, [idLine]);
  if (unit[name] === "шт") {
    ractionDigits = 0;
  } else if (unit[name] === "км") {
    ractionDigits = 3;
  } else if (unit[name] === "м") {
    ractionDigits = 2;
  }
  const formElement = (
    <Form.Item
      name={name}
      label={
        fullDescription ? (
          <InfoDrawer fullDescription={fullDescription}>{label}</InfoDrawer>
        ) : (
          label
        )
      }
      rules={[
        {
          required: required,
          message: "Это поле обязательное",
        },
      ]}
      initialValue={defaultValue ? defaultValue : min}
    >
      <InputNumber
        // defaultValue={0}
        autoComplete="off"
        // changeOnBlur={false}
        min={min}
        max={max}
        style={{ width: "100%" }}
        step={stepMain}
        decimalSeparator=","
        precision={ractionDigits}
        maxLength={length || undefined}
        disabled={disabled}
        suffix={
          objectProp?.unit?.position === "suffix" ? unit[name] : undefined
        }
        addonAfter={
          objectProp?.unit?.position === "addonAfter" ? unit[name] : undefined
        }
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
      read={read}
    >
      {formElement}
    </WrapperComponent>
  );
}
