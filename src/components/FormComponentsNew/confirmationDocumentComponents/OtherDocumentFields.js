import React from "react";
import { Form, DatePicker, Input } from "antd";
import TextArea from "antd/es/input/TextArea";
import locale from "antd/locale/ru_RU";

const OtherDocumentFields = ({ name }) => {
  const form = Form.useFormInstance();
  const typeDoc = Form.useWatch([name, "Вид документа"], form);
  if (typeDoc === "Иной документ") return (
    <div style={{ marginLeft: 20 }}>
      <Form.Item
        label="Тип иного документа"
        name={"Тип иного документа"}
        rules={[{ required: true, message: 'Это поле обязательное' }]}
      >
        <Input
        placeholder="Заграничный паспорт"
        />
      </Form.Item>
      <Form.Item
        label="Реквизиты документа"
        name={"Реквизиты документа"}
        rules={[{ required: true, message: 'Это поле обязательное' }]}
      >
        <TextArea
          placeholder="..."
          rows={2}
        />
      </Form.Item>
      <Form.Item
        label="Кем выдан"
        name={"Кем выдан"}
        rules={[{ required: true, message: 'Это поле обязательное' }]}
      >

        <TextArea
          placeholder="..."
          style={{
            height: 60,
          }}
        />

      </Form.Item>
      <Form.Item
        label="Когда выдан"
        name={"Когда выдан"}
        rules={[{ required: true, message: 'Это поле обязательное' }]}
      >
        <DatePicker
          locale={locale.DatePicker}
          format="DD.MM.YYYY"
          style={{ width: "100%" }}
        />
      </Form.Item>
    </div>
  );
};

export default OtherDocumentFields;
