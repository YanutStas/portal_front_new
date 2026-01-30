import React, { useEffect, useState } from "react";
import { AutoComplete, Form, Input, InputNumber } from "antd";
import debounce from "lodash/debounce";
import axios from "axios";
import WrapperComponent from "./WrapperComponent";
import InfoDrawer from "../InfoDrawer";
import useGlobal from "../../stores/useGlobal";

const backServer = import.meta.env.VITE_BACK_BACK_SERVER;

export default function InnInput({
  name = "inn",
  label = "",
  placeholder = "",
  required = undefined,
  dependOf = false,
  howDepend = false,
  // specialField: type = false,
  properties = false,
  span = false,
  fullDescription = false,
  stylesField_key = false,
  read = false,
  length = undefined,
}) {
  const [value, setValue] = useState('');
  const testData = useGlobal((state) => state.testData)
  const form = Form.useFormInstance();
  const [options, setOptions] = useState([]);
  const objProperties = properties.externalService;
  useEffect(() => {
    if (testData) {
      form.setFieldValue(name, "5032137342")
    }
  }, [testData])

  const fetchSuggestions = debounce((inn) => {
    if (/\D{1,}/.test(inn)) return false
    const params = { type: "ИНН", query: inn };
    // console.log(params);
    axios
      .get(`${backServer}/api/cabinet/getDaData`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
        withCredentials: true,
        params,
      })
      .then((response) => {
        if (response.data && response.data.data) {
          console.log(response.data);
          setOptions(
            response.data.data.map((item) => ({
              value: item.value,
              data: item.data,
            }))
          );
        } else {
          setOptions([]);
        }
      })
      .catch((error) => {
        console.error("Ошибка запроса к бэкенду:", error);
        setOptions([]);
      });
  }, 500);

  const onSelect = (value) => {
    const currentData = options.find((item) => item.value === value);

    for (var key in objProperties) {
      if (
        objProperties.hasOwnProperty(key) &&
        typeof objProperties[key] !== "function"
      ) {
        const arrKey = key.split(".");
        let value = arrKey.reduce(
          (nestedObj, key) => (nestedObj || {})[key],
          currentData
        );
        // console.log("value", value);
        form.setFieldValue(objProperties[key], value);
        // console.log("objProperties[key][1]", objProperties[key]);
      }
    }

    form.setFieldValue(name, currentData.data.inn);
  };
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
        { required: required, message: "Это поле обязательное" },
        { min: length, message: `Минимальная длина ${length} цифр` },
      ]}

      style={{
        flex: 1,
        minWidth: 300,
        // marginRight: "20px"
      }}

    >
      <AutoComplete
        options={options}
        onSelect={(value, option) => onSelect(value, option)}
        onSearch={(text) => fetchSuggestions(text)}
        placeholder={placeholder}
        style={{ fontSize: 18 }}
        maxLength={length}
        value={value}
      >
        <Input
          controls={false}
          onChange={(e) => {
            let value = e.target.value.replace(/[^0-9]/g, "");
            e.target.value = value;
            form.setFieldValue(name, value);
          }}
        />
      </AutoComplete>
      {/* <InputNumber
        style={{ fontSize: 18, width: '100%' }}
        maxLength={12}
        onChange={(event) => {
          console.log(event.currentTarget.value);
        }}
        // value={value}
      /> */}
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
