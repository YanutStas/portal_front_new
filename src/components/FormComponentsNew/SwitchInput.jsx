import React, { useState } from "react";
import { Form, Switch } from "antd";
import WrapperComponent from "./WrapperComponent";
import InfoDrawer from "../InfoDrawer";

export default function SwitchInput({
  name = "name",
  label = "",
  defaultValue = false,
  required = false,
  dependOf = false,
  howDepend = false,
  span = false,
  fullDescription = false,
  stylesField_key = false,
  requiredTrue = false,
  requiredMessage = "***",
  read = false
}) {
  const [error, setError] = useState(false)
  

  if (defaultValue && defaultValue === "true") {
    defaultValue = true;
  }
  if (defaultValue && defaultValue === "false") {
    defaultValue = false;
  }

  const formElement = (
    <>
      <Form.Item
        hasFeedback
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
            type: "boolean",
            message: "Это поле обязательное",
          },
          {
            validator: (rule, value) => {
              // console.log("rule:", rule);
              console.log("value:", value);


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
        initialValue={defaultValue}
      >
        <Switch />
      </Form.Item>
      {error && <p style={{color:"red"}}>{requiredMessage}</p>}
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
    >
      {formElement}
    </WrapperComponent>
  );
}
