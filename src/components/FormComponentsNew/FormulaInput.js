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

  Form.useWatch((values) => {
    const temp = { formula };

    keys.forEach((item) => {
      if (typeof values[item] === "undefined") return;
      temp[item] =
        typeof values[item] !== "undefined" ? Number(values[item]) : 0;

      temp.formula = temp.formula.replace(
        item,
        typeof values[item] !== "undefined" ? Number(values[item]) : 0
      );
    });

    try {
      const evalu = evaluate(temp.formula, temp).toFixed(ractionDigits);

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

// import React from "react";
// import {
//     Form,
//     InputNumber,
//     theme
// } from "antd";
// import { evaluate } from "mathjs";
// import useTemp from "../../stores/Cabinet/useTemp";
// import WrapperComponent from "./WrapperComponent";
// import InfoDrawer from "../InfoDrawer";

// function truncated(num, decimalPlaces) {
//     let numPowerConverter = Math.pow(10, decimalPlaces);
//     return ~~(num * numPowerConverter) / numPowerConverter;
// }

// export default function FormulaInput({
//     name = "name",
//     label = "",
//     disabled = false,
//     placeholder = "",
//     required = false,
//     dependOf = false,
//     howDepend = false,
//     min = 0,
//     max = 100,
//     step = 1,
//     defaultValue = false,
//     properties = false,
//     formula = '',
//     ractionDigits = undefined,
//     digits = false,
//     valueValidate = false,
//     span = false,
//     fullDescription = false,
//     stylesField_key=false
// }) {
//     // const [propertiesValue, setPropertiesValue] = useState({})
//     // "{"ТипЦены": "f6e1ac07-8fab-49e2-9d34-f859a2a8dcf8","Номенклатура": "2406f62a-2998-4578-9fa2-b2582dcc7a26"}"
//     const { colorTextHeading } = theme.useToken().token
//     const form = Form.useFormInstance();
//     const currency = useTemp((state) => state.currency);
//     let objectProp = {}
//     if (properties) objectProp = properties
//     // console.log("objectProp",objectProp);
//     // console.log("unit",unit);

//     let keys = []
//     for (let key in objectProp.formulaDetails) {
//         if (objectProp.formulaDetails.hasOwnProperty(key)) {
//             keys.push(objectProp.formulaDetails[key]);
//             // Form.useWatch(objectProp[key], form)
//         }
//     }
//     // const watchedValues = Form.useWatch(keys, form);
//     // useEffect(() => {
//     //     console.log("Значения полей:", watchedValues);
//     // }, [watchedValues])
//     // Form.useWatch(keys, form)
//     // console.log('useWatch',Form.useWatch(keys, form))
//     // console.log("objectProp", objectProp)

//     // console.log(keys.map(item => ([item])))
//     Form.useWatch((values) => {
//         // console.log("values:", values)
//         const temp = { formula }
//         // console.log("keys:", keys)
//         keys.forEach(item => {
//             if (typeof values[item] === "undefined") return;
//             temp[item] = typeof values[item] !== "undefined" ? Number(values[item]) : 0
//             // console.log("item:", item)
//             // console.log("values[item]:", values[item])
//             temp.formula = temp.formula.replace(item, typeof values[item] !== "undefined" ? Number(values[item]) : 0)
//         })
//         // console.log("formula:", temp.formula)
//         // console.log("evaluate", evaluate(temp.formula, temp))
//         // console.log("type evaluate", isNaN(evaluate(temp.formula, temp)))
//         try {
//             const evalu = evaluate(temp.formula, temp).toFixed(ractionDigits)
//             // console.log(evalu)
//             if (!isNaN(evalu) && evalu !== values[name]) {
//                 form.setFieldValue(name, evalu)
//             }
//         } catch (error) {
//             if (!isNaN(form.getFieldValue(name))) {
//                 form.setFieldValue(name, NaN)
//             }
//             return
//         }
//         // setPropertiesValue(temp)
//         // console.log("values: ", values)
//         // console.log("temp: ", temp)
//         // console.log("name: ", name)
//     }, form);
//     // const propertiesValue = Form.useWatch(['8a381dcc-33bd-4cbc-8f42-03297ceacf40'], form)

//     // let count = 0
//     // let price = 0
//     // count = Form.useWatch(objectProp["Количество"], form);
//     // price = Form.useWatch(objectProp["Цена"], form);
//     // console.log(propertiesValue)
//     // useEffect(() => {
//     //     form.setFieldValue(name, 1 * 1)
//     // }, [propertiesValue])
//     // let fieldDepends = Form.useWatch(dependOf, form);
//     // console.log('defaultValue',defaultValue)
//     // console.log('propsFormula', objectProp)
//     if (formula === '') return false;

//     const formElement = (
//         <Form.Item
//             name={name}
//             label={fullDescription ? <InfoDrawer fullDescription={fullDescription}>{label}</InfoDrawer> : label}

//             rules={valueValidate ? [
//                 () => ({
//                     validator(_, value) {
//                         if (value >= min && value <= max) {
//                             console.log('Сработал валидатор');
//                             return Promise.resolve();
//                         }
//                         return Promise.reject(new Error(`Значение должно быть между ${min} и ${max}`));
//                     },
//                 }),
//             ] : null}
//         >
//             <InputNumber
//                 disabled={true}
//                 validateTrigger="onBlur"
//                 decimalSeparator=","
//                 // precision={}
//                 style={{ color: colorTextHeading, width: "inherit" }}
//                 // style={{ color: colorTextHeading }}
//                 suffix={objectProp?.currency?.position === "suffix" ? currency[objectProp.currency.idLine] : false}
//                 addonAfter={objectProp?.currency?.position === "addonAfter" ? currency[objectProp.currency.idLine] : false}

//             />
//         </Form.Item>

//     );
//     // if (!dependOf) return formElement
//     // if (dependOf && howDepend && howDepend.options?.length > 0) {
//     //     let show = false
//     //     if (typeof fieldDepends === "undefined") fieldDepends = false
//     //     howDepend.options.forEach(item => {
//     //         if (item.value === "true") item.value = true
//     //         if (item.value === "false") item.value = false;
//     //         if (item.value == fieldDepends) show = true
//     //     })
//     //     if (show) return formElement
//     // }
//     // if (dependOf && howDepend && howDepend.max) {
//     //     if (fieldDepends >= howDepend.min && fieldDepends <= howDepend.max) return formElement
//     // }
//     return <WrapperComponent span={span} stylesField_key={stylesField_key} dependOf={dependOf} howDepend={howDepend} name={name}>{formElement}</WrapperComponent>
// }
