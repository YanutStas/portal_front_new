import { Form, Input, AutoComplete, InputNumber } from "antd";
import { useState, useEffect, useCallback } from "react";
import { debounce } from "lodash";
import axios from "axios";

import WrapperComponent from "./WrapperComponent";
import InfoDrawer from "../InfoDrawer";
import useServices from "../../stores/useServices";
import useProfile from "../../stores/Cabinet/useProfile";

const backServer = import.meta.env.VITE_BACK_BACK_SERVER;

const listTypeForDadata = [
  "Фамилия",
  "Имя",
  "Отчество",
  "АдресПолный",
  "Страна",
  "Регион",
  "Город",
  "Улица",
  "Район",
];

export default function TextInput({
  name = "name",
  label = "",
  disabled = false,
  placeholder = "",
  defaultValue = "",
  required = false,
  dependOf = false,
  howDepend = false,
  inputMask = false,
  length = false,
  specialField: type = false,
  span = false,
  fullDescription = false,
  stylesField_key = false,
  read = false
}) {
  // const serviceItem = useServices((state) => state.serviceItem);
  // if (label === "Номер записи в ЕГРЮЛ") {
  //   console.log("Номер записи в ЕГРЮЛ",length)
  // }
  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const form = Form.useFormInstance();

  const { profile } = useProfile();
  const emailFromProfile = profile.email || "";


  const fetchSuggestions = async (searchText) => {
    if (searchText) {
      try {
        const params = { type, query: searchText };
        if (type === "Улица" || type === "Город") {
          const country = form.getFieldValue("Страна") || "Россия";
          const region = form.getFieldValue("Регион") || "Московская";
          const cityFias = form.getFieldValue("cityFiasHidden");
          params.locations = [{ country, region }];
          if (type === "Улица" && cityFias) {
            params.locations[0].fias_id = cityFias;
          }
        }

        // Делаем запрос к серверу для получения подсказок
        const response = await axios.get(
          `${backServer}/api/cabinet/getDaData`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("jwt")}`,
            },
            withCredentials: true,
            params,
          }
        );

        // Преобразуем ответ в формат, подходящий для AutoComplete
        setSuggestions(
          response.data.data.map((suggestion) => ({
            label: suggestion.value,
            value: suggestion.value,
            fiasId: suggestion.data?.fias_id, // Сохраняем fias_id для городов
          }))
        );
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      }
    } else {
      setSuggestions([]); // Если поисковой запрос пустой, очищаем подсказки
    }
  };

  // Используем debounce для оптимизации запросов к DaData
  const debouncedFetchSuggestions = useCallback(
    debounce(fetchSuggestions, 500),
    []
  );

  // Вызываем debouncedFetchSuggestions при изменении значения или типа поля
  useEffect(() => {
    if (listTypeForDadata.includes(type)) {
      debouncedFetchSuggestions(value);
    } else {
      setSuggestions([]);
    }
  }, [value, type]);

  // Обработчик выбора значения в AutoComplete
  const onSelect = (val, opt) => {
    setValue(val); // Устанавливаем выбранное значение
    if (type === "Город" && opt?.fiasId) {
      // Если выбрали город, сохраняем его fias_id в скрытое поле
      form.setFieldValue("cityFiasHidden", opt.fiasId);
    }
  };

  // Обработчик изменения значения в поле ввода
  const handlerOnChange = (value) => {
    setValue(value); // Обновляем состояние значения
  };

  // Общий шаблон для правил валидации полей
  const formItemRules = [
    {
      required: required,
      message: "Это поле обязательное",
    },
  ];

  // Рендерим AutoComplete для полей, связанных с DaData
  const autoComplete = (
    <Form.Item
      name={name}
      label={
        fullDescription ? (
          <InfoDrawer fullDescription={fullDescription}>{label}</InfoDrawer>
        ) : (
          label
        )
      }
      rules={formItemRules}
      initialValue={defaultValue}
    >
      <AutoComplete
        options={suggestions} // Подсказки от DaData
        onChange={handlerOnChange} // Обработчик изменения значения
        onSelect={onSelect} // Обработчик выбора значения
        value={value} // Текущее значение
        placeholder={placeholder}
        disabled={disabled}
        maxLength={length || undefined}
      />
    </Form.Item>
  );

  // Рендерим обычное поле ввода для email
  const email = (
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
        ...formItemRules,
        {
          type: "email",
          message: "Это поле в формате Email",
        },
      ]}
      initialValue={emailFromProfile}
    >
      <Input placeholder={placeholder} maxLength={length || undefined} />
    </Form.Item>
  );

  // Рендерим поле ввода серии документа
  const passportInput = (
    <Form.Item
      name={name}
      label={
        fullDescription ? (
          <InfoDrawer fullDescription={fullDescription}>{label}</InfoDrawer>
        ) : (
          label
        )
      }
      rules={formItemRules}
      initialValue={defaultValue}
    >
      <InputNumber
        placeholder={placeholder}
        maxLength={length || undefined}
        disabled={disabled}
        autoSize={{ minRows: 1, maxRows: 4 }}
        controls={false}
      />
    </Form.Item>
  );

  // Рендерим текстовое поле для остальных случаев
  const simpleInput = (
    <Form.Item
      name={name}
      label={
        fullDescription ? (
          <InfoDrawer fullDescription={fullDescription}>{label}</InfoDrawer>
        ) : (
          label
        )
      }
      rules={formItemRules}
      initialValue={defaultValue}
    >
      <Input.TextArea
        placeholder={placeholder}
        maxLength={length || undefined}
        disabled={disabled}
        autoSize={{ minRows: 1, maxRows: 4 }}
      />
    </Form.Item>
  );

  // Выбираем, какой компонент рендерить в зависимости от типа поля
  let formElement = simpleInput;
  if (listTypeForDadata.includes(type)) formElement = autoComplete;
  if (type === "ЭлектронныйАдрес") formElement = email;
  if (type === "СерияДокумента" || type === "НомерДокумента") formElement = passportInput;

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
