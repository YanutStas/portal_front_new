import React, { useEffect, useState } from "react";
import { Form, Switch, Typography } from "antd";
import WrapperComponent from "./WrapperComponent";
import InfoDrawer from "../InfoDrawer";

export default function SwitchInput({
  name = "name",
  label = "",
  defaultValue = false,
  required = undefined,
  dependOf = false,
  howDepend = false,
  span = false,
  fullDescription = false,
  stylesField_key = false,
  style = false,
  requiredTrue = false,
  requiredMessage = "***",
  read = false
}) {
  // const form = Form.useFormInstance();
  const [error, setError] = useState(false)

  const normalizedDefaultValue =
    defaultValue === "true" ? true :
      defaultValue === "false" ? false :
        defaultValue;

  
  //  useEffect(() => {
  //   if (name && form) {
  //     form.setFieldsValue({ [name]: normalizedDefaultValue });
  //   }
  // }, [form, name, normalizedDefaultValue]);

  // useEffect(() => {
  //   form.setFieldsValue({ [name]: defaultValue });
  // }, [defaultValue, form, name]);

  const formElement = (
    <>
      <Form.Item
        hasFeedback
        name={name}
        label={
          fullDescription ? (
            <InfoDrawer fullDescription={fullDescription}>{label}</InfoDrawer>
          ) : (
            <Typography.Text style={{ whiteSpace: "break-spaces" }}>{label}</Typography.Text>
          )
        }
        initialValue={normalizedDefaultValue}
        valuePropName="checked"
        rules={[
          {
            required: required,
            type: "boolean",
            message: "Это поле обязательное",
          },
          {
            validator: (rule, value) => {
              // console.log("rule:", rule);
              // console.log("value:", value);
              if (requiredTrue && !value) {
                setError(true)
                return Promise.reject()
              } else {
                setError(false)
                return Promise.resolve()
              }

            }
          }
        ]}
      >
        <Switch />
      </Form.Item>
      {error && <p style={{ color: "red" }}>{requiredMessage}</p>}
    </>
  );

  return (
    <WrapperComponent
      span={span}
      stylesField_key={stylesField_key}
      dependOf={dependOf}
      howDepend={howDepend}
      name={name}
      read={read}
      style={style}
      typeElem={"switch"}
    >
      {formElement}
    </WrapperComponent>
  );
}
