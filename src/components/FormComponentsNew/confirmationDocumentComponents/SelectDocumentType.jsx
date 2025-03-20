import React from "react";
import { Form, Select } from "antd";

const documentOptions = [
  { value: "Паспорт гражданина РФ", label: "Паспорт гражданина РФ" },
  { value: "Иной документ", label: "Иной документ" },
];

const SelectDocumentType = () => {
  return (
    <Form.Item
      name={"Вид документа"}
      label={'Вид документа'}
      style={{ flex: 1 }}
      required={true}
    >
      <Select
        options={documentOptions}
      />
    </Form.Item>
    
  );
};

export default SelectDocumentType;
