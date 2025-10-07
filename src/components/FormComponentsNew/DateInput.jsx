import React, { useEffect } from "react";
import { ConfigProvider, DatePicker, Form, TimePicker } from "antd";
import moment from "moment";
import "moment/locale/ru";
import locale from "antd/es/locale/ru_RU";
import WrapperComponent from "./WrapperComponent";
import InfoDrawer from "../InfoDrawer";
import useGlobal from "../../stores/useGlobal";

moment.locale("ru");

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
  read = false
}) {
  const testData = useGlobal((state) => state.testData)
  const form = Form.useFormInstance();
  useEffect(() => {
    if (testData) {
      form.setFieldValue(name, moment())
    }
  }, [testData])
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
        ]}
        initialValue={defaultValue}
      >
        {part === "Дата" && (
          <DatePicker
            format={"DD.MM.YYYY"}
            placeholder={placeholder}
          // required={required}
          />
        )}
        {part === "МесяцГод" && (
          <DatePicker
            format={"MM.YYYY"}
            placeholder={placeholder}
            picker="month"
          // required={required}
          />
        )}
        {part === "ДатаВремя" && (
          <DatePicker
            format={"DD.MM.YYYY HH:mm"}
            showTime
            placeholder={placeholder}
          // required={required}
          />
        )}
        {part === "Время" && (
          <TimePicker
            format={"HH:mm"}
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
    >
      {formElement}
    </WrapperComponent>
  );
}
