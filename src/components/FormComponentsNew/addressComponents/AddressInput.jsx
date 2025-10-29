import React, { useState, useRef, useEffect } from "react";
import { AutoComplete, Form, Flex, Input, ConfigProvider, theme, Button } from "antd";
import debounce from "lodash/debounce";
import axios from "axios";
import AddressModal from "./AddressModal";
import fieldConfig from "./AddressInput.json";
import { EditOutlined } from "@ant-design/icons";
import WrapperComponent from "../WrapperComponent";
import InfoDrawer from "../../InfoDrawer";
import useGlobal from "../../../stores/useGlobal";
import Typography from "antd/es/typography/Typography";

const backServer = import.meta.env.VITE_BACK_BACK_SERVER;

const AddressInput = ({
  name = "name",
  label = " ",
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
  regionType = false,
  area = false,
  city = false,
  settlement = false,
  street = false,
  fullAddress = undefined,
  read = false
}) => {
 
  const { token } = theme.useToken();
  const testData = useGlobal((state) => state.testData)
  const form = Form.useFormInstance();
  // console.log(country)
  // let fieldDepends = Form.useWatch(dependOf, form)
  const [options, setOptions] = useState([]);
  const [reload, setReload] = useState(false);

  const [address, setAddress] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const modalFormRef = useRef(null);
  useEffect(() => {
    if (testData) {
      form.setFieldValue(name, {
    "fullAddress": "143430, Россия, Московская обл, г Красногорск, пгт Нахабино, ул Карла Маркса, двлд 9",
    "postal_code": "143430",
    "country": "Россия",
    "region": "Московская",
    "region_type": "обл",
    "city": "Красногорск",
    "city_type": "г",
    "settlement": "Нахабино",
    "settlement_type": "пгт",
    "street": "Карла Маркса",
    "street_type": "ул",
    "house": "9",
    "house_type": "двлд"
})
      setReload(!reload)
    }
  }, [testData])

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

      <Flex vertical>
        <Form.Item
          name={name}
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
        // initialValue={fullAddress}

        >
          <Typography.Text style={{ color: "gray" }}>{form.getFieldValue(name)?.fullAddress}</Typography.Text>
          {/* <Input.TextArea disabled /> */}
        </Form.Item>
        <Flex gap={10} justify="center">
          <Button type="primary" onClick={openModal}>{form.getFieldValue(name)?.fullAddress ? "Изменить" : "Указать адрес"}</Button>
          {form.getFieldValue(name)?.fullAddress &&
            <Button onClick={() => {
              form.setFieldValue(name, undefined)
              setReload(!reload)
            }}>Очистить</Button>
          }
        </Flex>
      </Flex>
      <AddressModal
        visible={modalVisible}
        onSave={handleModalSave}
        onCancel={() => setModalVisible(false)}
        name={name}
        form={form}
        defaultValue={{ country, region, regionType, area, city, settlement, street }}
        label={label}
      />


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
