import React, { useState } from "react";
import { Form, AutoComplete, DatePicker, Input } from "antd";
import locale from "antd/locale/ru_RU";
import useSubjects from "../../../stores/Cabinet/useSubjects";
import axios from "axios";

const backServer = import.meta.env.VITE_APP_BACK_BACK_SERVER;

const PassportFields = ({ name }) => {
  const [kemVidanOptions, setKemVidanOptions] = useState([{ value: '123' }]);
  const showModalAdd = useSubjects((state) => state.showModalAdd);
  const showModalView = useSubjects((state) => state.showModalView);
  const form = Form.useFormInstance();
  const typeDoc = Form.useWatch([name, "Вид документа"], form);

  const handleSerialPassportChange = (e) => {
    const onlyNums = e.target.value.replace(/[^\d]/g, "")
    form.setFieldValue([name, "Серия паспорта"], onlyNums);
  };
  const handleNumberPassportChange = (e) => {
    const onlyNums = e.target.value.replace(/[^\d]/g, "")
    form.setFieldValue([name, "Номер паспорта"], onlyNums);
  };

  const handleKodPodrazdeleniaChange = (e) => {
    const onlyNums = e.target.value.replace(/[^\d]/g, "");
    let formattedKod = "";
    if (onlyNums.length <= 3) {
      formattedKod = onlyNums;
    } else if (onlyNums.length > 3 && onlyNums.length <= 6) {
      formattedKod = `${onlyNums.slice(0, 3)}-${onlyNums.slice(3)}`;
    }
    form.setFieldValue([name, "Код подразделения"], formattedKod);
    if (formattedKod.length >= 7) {

      axios
        .get(`${backServer}/api/cabinet/get-fms?searchString=${formattedKod}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("jwt")}`,
            },
            withCredentials: true,
          })
        .then((response) => {
          if (response.data && response.data.data) {
            setKemVidanOptions(
              response.data.data.map((item) => ({
                value: item.value,
                data: item.data,
              }))
            );
          } else {
            setKemVidanOptions([]);
          }
        })
        .catch((error) => {
          console.error("Ошибка запроса к бэкенду:", error);
          setKemVidanOptions([]);
        });
    }
  };
  if (typeDoc === "Паспорт гражданина РФ") return (
    <div style={{ marginLeft: 20 }}>
      <Form.Item
        label="Серия паспорта"
        name={"Серия паспорта"}
        rules={[{ required: true, message: 'Это поле обязательное' }]}
      >
        <Input
          placeholder={"XXXX"}
          onChange={handleSerialPassportChange}
          maxLength={4}
        />
      </Form.Item>
      <Form.Item
        label="Номер паспорта"
        name={"Номер паспорта"}
        rules={[{ required: true, message: 'Это поле обязательное' }]}
      >
        <Input
          placeholder={"XXXXXX"}
          onChange={handleNumberPassportChange}
          maxLength={6}
        />
      </Form.Item>
      <Form.Item
        label="Код подразделения"
        name={"Код подразделения"}
        rules={[{ required: true, message: 'Это поле обязательное' }]}
      >
        <Input
          placeholder={"XXX-XXX"}
          onChange={handleKodPodrazdeleniaChange}
          maxLength={7}
        />
      </Form.Item>
      <Form.Item
        label="Кем выдан"
        name={"Кем выдан"}
        rules={[{ required: true, message: 'Это поле обязательное' }]}
      >
        <AutoComplete
          options={kemVidanOptions}
          style={{ width: "100%" }}

        >
          <Input.TextArea
            placeholder="Наименование подразделения"
            style={{ height: 60 }}
          />
        </AutoComplete>

      </Form.Item>
      <Form.Item
        label="Когда выдан"
        name={"Когда выдан"}
        rules={[{ required: true, message: 'Это поле обязательное' }]}
      >
        <DatePicker
          format="DD.MM.YYYY"
          locale={locale.DatePicker}
          style={{ width: "100%" }}
        />

      </Form.Item>
    </div>
  );
};

export default PassportFields;
