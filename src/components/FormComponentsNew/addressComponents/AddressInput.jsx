import React, { useState, useRef } from "react";
import { AutoComplete, Form, Flex, Input, ConfigProvider, theme } from "antd";
import debounce from "lodash/debounce";
import axios from "axios";
import AddressModal from "./AddressModal";
import fieldConfig from "./AddressInput.json";
import { EditOutlined } from "@ant-design/icons";
import WrapperComponent from "../WrapperComponent";
import InfoDrawer from "../../InfoDrawer";

const backServer = import.meta.env.VITE_BACK_BACK_SERVER;

const AddressInput = ({
  name = "name",
  label = "Label",
  disabled = false,
  placeholder = "",
  required = undefined,
  dependOf = false,
  howDepend = false,
  inputMask = false,
  lenght = false,
  specialField: type = false,
  span = false,
  fullDescription = false,
  stylesField_key = false,
  country = false,
  region = false,
  area = false,
  city = false,
  settlement = false,
  street = false,
  fullAddress = undefined,
  read = false
}) => {
  const { token } = theme.useToken();
  // console.log(country)
  const form = Form.useFormInstance();
  // let fieldDepends = Form.useWatch(dependOf, form)
  const [options, setOptions] = useState([]);
  const [address, setAddress] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const modalFormRef = useRef(null);

  // Функция для получения предложений
  const fetchSuggestions = debounce((text, type) => {
    const params = { type, query: text };

    // if (type !== "Страна" && address.country)
    //   params.locations = [{ country_iso_code: address.country }];
    // if (type !== "Регион" && address.region)
    //   params.locations = [{ region_fias_id: address.region }];
    // if (type !== "Город" && address.city)
    //   params.locations = [{ city_fias_id: address.city }];

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
          // console.log("response.data", response.data);
          setOptions(
            response.data.data.map((item) => ({
              label: (
                <div
                  style={{
                    maxWidth: "100%",
                    whiteSpace: "break-spaces",
                    paddingBottom: 5,
                    borderBottom: `1px solid rgba(133,133,133,.2)`,
                  }}
                >
                  {item.value}
                </div>
              ),
              value: item.unrestricted_value,
              data: item.data,
              // unrestricted_value: item.unrestricted_value,
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

  // Обработка выбора из списка предложений
  const onSelect = (value, option) => {
    const updatedAddress = { ...option.data };
    let updateObject = {};
    // console.log(option);
    // Сохраняем полный адрес под капотом
    setAddress(updatedAddress);
    updateObject.fullAddress = value;
    fieldConfig.forEach((field) => {
      updateObject[field.name] = updatedAddress[field.name];
    });
    // Вставляем только текст подсказки в инпут
    form.setFieldValue(name, updateObject);

    // Обновляем значения формы модалки
    if (modalFormRef.current) {
      modalFormRef.current.setFieldsValue(updatedAddress);
    }

    setOptions([]);
  };

  // Открытие модального окна
  const openModal = () => {
    if (modalFormRef.current) {
      modalFormRef.current.setFieldsValue(address); // Обновляем значения в форме модалки
    }
    setModalVisible(true);
  };

  // Сохранение данных из модального окна
  const handleModalSave = (values) => {
    updateAddress(values);
    setModalVisible(false);
  };

  // Обновление адреса и формирование строки полного адреса
  const updateAddress = (newData) => {
    const updatedAddress = { ...address, ...newData };

    // Фильтруем и переводим на русский нужные поля
    const filteredAddress = {
      Индекс: updatedAddress.postal_code,
      Страна: updatedAddress.country,
      Регион: updatedAddress.region_with_type,
      Район: updatedAddress.area_with_type,
      Город: updatedAddress.city_with_type,
      Улица: updatedAddress.street_with_type,
      "Номер дома": updatedAddress.house,
    };

    setAddress(filteredAddress);

    const formattedAddress = Object.entries(filteredAddress)
      .filter(([key, value]) => value)
      .map(([key, value]) => `${key}: ${value}`)
      .join(", ");

    form.setFieldValue(name, formattedAddress);
  };
  const formElement = (
    <ConfigProvider
      theme={{
        components: {
          Form: {
            itemMarginBottom: 20,
          },
        },
      }}
    >
      <Form.List name={name}>
        {(fields, { add, remove }) => (
          <>
            <Flex align="flex-start">
              <Form.Item
                name={"fullAddress"}
                label={
                  fullDescription ? (
                    <InfoDrawer fullDescription={fullDescription}>
                      {label}
                    </InfoDrawer>
                  ) : (
                    label
                  )
                }
                rules={[
                  {
                    required: required,
                    message: "Это поле обязательное"
                  },
                ]}
                style={{ flex: 1, minWidth: 300 }}
                labelAlign="left"
                initialValue={fullAddress}
                extra={ <EditOutlined />}
              >
                <AutoComplete
                  options={options}
                  onSelect={(value, option) => onSelect(value, option)}
                  onSearch={(text) => fetchSuggestions(text, "fullAddress")}
                  placeholder={placeholder}
                >
                  <Input.TextArea
                    autoSize={{ minRows: 1, maxRows: 4 }}                    
                  />
                </AutoComplete>
              </Form.Item>
              <div
                style={{
                  cursor: "pointer",
                  color: token.colorTextLabel,
                  padding: 5,
                  paddingTop: 30,
                }}
                onClick={openModal}
              >
                <EditOutlined />
                {/* Заполнить */}
              </div>
            </Flex>
            <AddressModal
              visible={modalVisible}
              onSave={handleModalSave}
              onCancel={() => setModalVisible(false)}
              name={name}
              defaultValue={{ country, region, area, city, settlement, street }}
            />
          </>
        )}
      </Form.List>
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
};

export default AddressInput;
