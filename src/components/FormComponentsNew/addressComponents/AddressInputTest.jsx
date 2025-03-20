import React from "react";
import { Form, Button } from "antd";
import AddressInput from "./AddressInput";

const AddressInputTest = () => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log("Форма отправлена:", values);
  };

  return (
    <Form form={form} onFinish={onFinish}>
      <AddressInput
        name="fullAddress"
        label="Полный адрес"
        placeholder="Введите полный адрес"
        required
      />
      <AddressInput
        name="country"
        label="Страна"
        placeholder="Введите страну"
        required
        bound="country"
      />
      <AddressInput
        name="region"
        label="Регион"
        placeholder="Введите регион"
        required
        bound="region"
      />
      <AddressInput
        name="city"
        label="Город"
        placeholder="Введите город"
        required
        bound="city"
      />
      <AddressInput
        name="area"
        label="Район"
        placeholder="Введите район"
        required
        bound="area"
      />
      <AddressInput
        name="street"
        label="Улица"
        placeholder="Введите улицу"
        required
        bound="street"
      />
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Отправить
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AddressInputTest;
