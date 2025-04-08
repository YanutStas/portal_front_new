import React from "react";
import { Form, InputNumber, theme } from "antd";
import { evaluate } from "mathjs";
import useTemp from "../../stores/Cabinet/useTemp";
import WrapperComponent from "./WrapperComponent";
import InfoDrawer from "../InfoDrawer";

export default function FormulaInput({
  name = "name",
  label = "",
  dependOf = false,
  howDepend = false,
  min = 0,
  max = 100,
  properties = false,
  formula = "",
  ractionDigits = undefined,
  valueValidate = false,
  span = false,
  fullDescription = false,
  stylesField_key = false,
}) {
  const { colorTextHeading } = theme.useToken().token;
  const form = Form.useFormInstance();
  const currency = useTemp((state) => state.currency);
  let objectProp = {};
  if (properties) objectProp = properties;

  let keys = [];
  for (let key in objectProp.formulaDetails) {
    if (objectProp.formulaDetails.hasOwnProperty(key)) {
      keys.push(objectProp.formulaDetails[key]);
    }
  }

  // console.log("keys:", keys)
  // console.log("properties:", properties)
  // console.log("formula:", formula)
  
  Form.useWatch((values) => {
    const temp = { formula };

    keys.forEach((item) => {
      if (typeof values[item] === "undefined") return;
      // temp[item] = Number(values[item]) || 0;

      temp.formula = temp.formula.replace(
        item,
        Number(values[item]) || 0
      );
    });
    
    // console.log("temp:", temp)
    try {
      const evalu = evaluate(temp.formula).toFixed(ractionDigits);
      
      // console.log("evalu:", evalu)
      if (!isNaN(evalu) && evalu !== values[name]) {
        form.setFieldValue(name, evalu);
      }
    } catch (error) {
      if (!isNaN(form.getFieldValue(name))) {
        form.setFieldValue(name, NaN);
      }
      return;
    }
  }, form);

  if (formula === "") return false;

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
      rules={
        valueValidate
          ? [
              () => ({
                validator(_, value) {
                  if (value >= min && value <= max) {
                    console.log("Сработал валидатор");
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(`Значение должно быть между ${min} и ${max}`)
                  );
                },
              }),
            ]
          : null
      }
    >
      <InputNumber
        disabled={true}
        validateTrigger="onBlur"
        decimalSeparator=","
        style={{ color: colorTextHeading, width: "inherit" }}
        suffix={
          objectProp?.currency?.position === "suffix"
            ? currency[objectProp.currency.idLine]
            : false
        }
        addonAfter={
          objectProp?.currency?.position === "addonAfter"
            ? currency[objectProp.currency.idLine]
            : false
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
    >
      {formElement}
    </WrapperComponent>
  );
}