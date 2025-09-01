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
  min = false,
  max = false,
  properties = false,
  formula = "",
  ractionDigits = undefined,
  valueValidate = false,
  span = false,
  fullDescription = false,
  stylesField_key = false,
  read = false,
  required = false,
  nameTable = undefined
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
  // if (label === "Максимальная мощность (кВт)") {
  //   min = 670
  //   valueValidate = true
  // }

  // if (name[1] === "9abe1ffa-1418-4f9f-96cc-31849028a407") {
  //   console.log("formula", formula)
  //   console.log("keys", keys)
  //   console.log("name", name)
  // }


  // Form.useWatch((values) => {
  //   console.log("nameTable", nameTable);
  //   console.log("values", values);

  //   const temp = { formula };

  //   keys.forEach((item) => {
  //     if (nameTable) {
  //       // console.log(values[nameTable][name][item]);
  //     }

  //     if (typeof values[item] === "undefined") return;
  //     // temp[item] = Number(values[item]) || 0;

  //     temp.formula = temp.formula.replace(
  //       item,
  //       Number(values[item]) || 0
  //     );
  //   });

  //   // console.log("temp:", temp)
  //   try {
  //     const evalu = evaluate(temp.formula).toFixed(ractionDigits);

  //     // console.log("evalu:", evalu)
  //     if (!isNaN(evalu) && evalu !== values[name]) {
  //       form.setFieldValue(name, evalu);
  //     }
  //   } catch (error) {
  //     if (!isNaN(form.getFieldValue(name))) {
  //       form.setFieldValue(name, NaN);
  //     }
  //     return;
  //   }
  // }, form);
  const mathResult = (values) => {
    const temp = { formula };
    if (nameTable && values[nameTable] && values[nameTable][name[0]]) {
      //Таблица
      keys.forEach(item => {
        temp.formula = temp.formula.replace(
          item,
          Number(values[nameTable][name[0]][item]) || 0
        );
      })
      try {
        const evalu = evaluate(temp.formula).toFixed(ractionDigits);
        if (!isNaN(evalu) && evalu !== values[nameTable][name[0]][name[1]]) {
          form.setFieldValue([nameTable, name[0], name[1]], evalu);
        }
      } catch (error) {
        console.log(error);
        if (!isNaN(form.getFieldValue([nameTable, name[0], name[1]]))) {
          form.setFieldValue([nameTable, name[0], name[1]], 0);
        }
        return;
      }
    } else {
      //Не таблица
      keys.forEach(item => {
        temp.formula = temp.formula.replace(
          item,
          Number(values[item]) || 0
        );
      })
      try {
        const evalu = evaluate(temp.formula).toFixed(ractionDigits);
        if (!isNaN(evalu) && evalu !== values[name]) {
          form.setFieldValue(name, evalu);
        }
      } catch (error) {
        console.log(error);
        if (!isNaN(form.getFieldValue(name))) {
          form.setFieldValue(name, 0);
        }
        return;
      }
    }
  }

  if (formula === "") return false;
  // let newFormula = ''
  const formElement = (
    <Form.Item
      required={required}
      name={name}
      shouldUpdate={(prevValues, values) => {
        // console.log("values", values)
        // console.log("keys", keys)
        // console.log("beginFormula", formula)
        mathResult(values)

      }
      }
      initialValue={mathResult(form.getFieldsValue()) || 0}
      // initialValue={()=>{
      //   if(keys){
      //     return form.getFieldValue([nameTable, name[0], keys[item]])
      //   }
      // }}

      label={
        fullDescription ? (
          <InfoDrawer fullDescription={fullDescription} > {label}</InfoDrawer>
        ) : (
          label
        )
      }
      rules={
        valueValidate
          ? [
            () => ({
              validator(_, value) {
                if (required && value && value == 0) {
                  return Promise.reject(
                    new Error(`Значение не должно быть равно 0`)
                  );
                }
                if (min && max && value >= min && value <= max) {
                  return Promise.resolve();
                }
                if (min && !max && value >= min) {
                  return Promise.resolve();
                }
                if (max && !min && value <= max) {
                  return Promise.resolve();
                }
                if (!required && !min && !max) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error(`Значение должно быть между ${min} и ${max}`)
                );
              },
            }),
            // ({ setFieldValue }) => {
            //   if (nameTable) {
            //     setFieldValue([nameTable, ...name], 122)
            //   }
            // }
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
    </Form.Item >
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