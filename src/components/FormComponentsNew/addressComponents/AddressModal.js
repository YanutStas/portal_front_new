import React, { useEffect, useImperativeHandle, forwardRef } from "react";
import { Modal, Form, Input } from "antd";
import fieldConfig from "./AddressInput.json";

const AddressModal = forwardRef(
  ({ visible, onCancel, initialValues, name }, ref) => {
    const form = Form.useFormInstance();

    // Используем useImperativeHandle для управления формой из родительского компонента
    useImperativeHandle(ref, () => ({
      setFieldsValue: form.setFieldsValue,
    }));

    useEffect(() => {
      form.setFieldsValue(initialValues);
    }, [initialValues]);

    const handleOk = () => {
      let fullString = "";
      fieldConfig.forEach((field) => {
        let currString = form.getFieldValue([name, field.name]);
        if (currString) fullString = fullString + currString + ", ";
      });
      form.setFieldValue([name, "fullAddress"], fullString);
      onCancel();
    };

    return (
      <Modal
        closable={false}
        open={visible}
        title="Введите адрес вручную"
        onOk={handleOk}
        onCancel={onCancel}
        okText="Сохранить"
      >
        {fieldConfig.map((field) => (
          <Form.Item
            name={field.name}
            label={field.label}
            key={field.name}
            labelCol={{ span: 8 }}
          >
            {field.type === "textArea" ? (
              <Input.TextArea
                placeholder={`Введите ${field.label.toLowerCase()}`}
              />
            ) : (
              <Input placeholder={`Введите ${field.label.toLowerCase()}`} />
            )}
          </Form.Item>
        ))}
      </Modal>
    );
  }
);

export default AddressModal;
