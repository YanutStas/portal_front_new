import React from "react";
import { Input, Form } from "antd";
import WrapperComponent from "./WrapperComponent";
import InfoDrawer from "../InfoDrawer";

export default function SnilsInput({
  name = "snils",
  label = "",
  required = false,
  dependOf = false,
  howDepend = false,
  span = false,
  fullDescription = false,
  stylesField_key = false,
}) {
  const form = Form.useFormInstance();

  const validateSnils = (e) => {
    let fieldPath = e.field.split(".");
    let snils = form.getFieldValue(fieldPath);
    const error = { code: 0, message: "" };
    if (typeof snils !== "string") snils = "";

    if (!snils.length) {
      return Promise.resolve();
    } else if (snils.length !== 14) {
      error.code = 2;
      error.message = "СНИЛС должен состоять из 11 цифр";
    } else if (snils == "000-000-000 00") {
      error.code = 2;
      error.message = "СНИЛС не должен состоять из нулей";
    } else {
      const nums = snils.replace(/[^0-9]/g, "");
      if (nums.length !== 11) {
        console.log("Неправильный формат СНИЛС");
        error.code = 3;
        error.message = "Неправильный формат СНИЛС";
      } else {
        let sum = 0;
        for (let i = 0; i < 9; i++) {
          sum += parseInt(nums[i]) * (9 - i);
        }
        let checkDigit = sum < 100 ? sum : sum % 101;
        if (checkDigit === 100) checkDigit = 0;
        if (checkDigit === parseInt(nums.slice(-2))) {
          return Promise.resolve();
        } else {
          error.code = 4;
          error.message = "Неверный СНИЛС";
        }
      }
    }
    return Promise.reject(new Error(error.message));
  };

  const formElement = (
    <Form.Item
      label={
        fullDescription ? (
          <InfoDrawer fullDescription={fullDescription}>{label}</InfoDrawer>
        ) : (
          label
        )
      }
      name={name}
      rules={[
        {
          required: required,
          message: "Это поле обязательное",
        },
        { validator: validateSnils },
      ]}
    >
      <Input
        placeholder={"XXX-XXX-XXX XX"}
        maxLength={14}
        onChange={(e) => {
          let value = e.target.value.replace(/[^0-9]/g, "");
          if (value.length > 9) {
            value = `${value.slice(0, 3)}-${value.slice(3, 6)}-${value.slice(
              6,
              9
            )} ${value.slice(9, 11)}`;
          } else if (value.length > 6) {
            value = `${value.slice(0, 3)}-${value.slice(3, 6)}-${value.slice(
              6
            )}`;
          } else if (value.length > 3) {
            value = `${value.slice(0, 3)}-${value.slice(3)}`;
          }
          e.target.value = value;

          form.setFieldValue(name, value);
        }}
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
