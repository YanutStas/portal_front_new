import React, { useEffect } from "react";
import { ConfigProvider, DatePicker, Form, TimePicker } from "antd";
import moment from "moment";
import "moment/locale/ru";
import locale from "antd/es/locale/ru_RU";
import WrapperComponent from "./WrapperComponent";
import InfoDrawer from "../InfoDrawer";
import useGlobal from "../../stores/useGlobal";

moment.locale("ru");

// 1С не понимает даты позже 3000 года — ограничиваем сверху
const MAX_DATE = moment("31.12.3000", "DD.MM.YYYY");
const MAX_DATE_STRING = "31.12.3000";

// блокирует выбор в календаре
const disabledDate = (current) => !!current && current.isAfter(MAX_DATE, "day");

// валидация ввода с клавиатуры (маска позволяет ввести любую дату)
const dateLimitRule = {
  validator: (_, value) => {
    if (value && value.isAfter(MAX_DATE, "day")) {
      return Promise.reject(new Error(`Дата не может быть позже ${MAX_DATE_STRING}`));
    }
    return Promise.resolve();
  },
};

export default function DateInput({
  name = "name",
  part = "Дата",
  label = "Поле",
  defaultValue = undefined,
  placeholder = "",
  required = false,
  dependOf = false,
  howDepend = false,
  span = false,
  fullDescription = false,
  stylesField_key = false,
  read = false,
  style = false

}) {
  const testData = useGlobal((state) => state.testData)
  const form = Form.useFormInstance();
  useEffect(() => {
    if (testData) {
      form.setFieldValue(name, moment())
    }
  }, [testData])
  // console.log("defaultValue", defaultValue);

  const formElement = (
    <ConfigProvider locale={locale}>
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
          dateLimitRule,
        ]}
        initialValue={defaultValue ? moment(defaultValue) : false}
      >
        {part === "Дата" && (
          <DatePicker
            format={{ format: "DD.MM.YYYY", type: "mask" }}
            // format={"DD.MM.YYYY"}
            disabledDate={disabledDate}
            defaultValue={defaultValue}
            placeholder={placeholder}
            onChange={(date, dateString) => {
              // console.log("dateString", dateString);

            }}
          // required={required}
          />
        )}
        {part === "МесяцГод" && (
          <DatePicker
            format={{ format: "MM.YYYY", type: "mask" }}
            // format={"MM.YYYY"}
            disabledDate={disabledDate}
            placeholder={placeholder}
            picker="month"
          // required={required}
          />
        )}
        {part === "ДатаВремя" && (
          <DatePicker
            format={{ format: "DD.MM.YYYY HH:mm", type: "mask" }}
            // format={"DD.MM.YYYY HH:mm"}
            disabledDate={disabledDate}
            showTime
            placeholder={placeholder}
          // required={required}
          />
        )}
        {part === "Время" && (
          <TimePicker
            format={{ format: "HH:mm", type: "mask" }}
            // format={"HH:mm"}
            placeholder={placeholder}
          // required={required}
          />
        )}
      </Form.Item>
    </ConfigProvider>
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

    >
      {formElement}
    </WrapperComponent>
  );
}
