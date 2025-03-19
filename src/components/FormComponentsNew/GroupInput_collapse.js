import React, { useState } from "react";
import { Form, Collapse, ConfigProvider, Button } from "antd";
import TextInput from "./TextInput";
import NumberInput from "./NumberInput";
import SliderInput from "./SliderInput";
import SelectInput from "./SelectInput";
import DateInput from "./DateInput";
import DividerForm from "./DividerForm";
import SnilsInput from "./SnilsInput";
import PhoneInput from "./phoneComponent/PhoneInput";
import AddressInput from "./adressComponents/AddressInput";
import ConfirmationDocumentNewInput from "./confirmationDocumentComponents/ConfirmationDocumentNewInput";

export default function GroupInput({
  name = "name",
  label = "Label",
  required = false,
  dependOf = false,
  howDepend = false,
  fields: Fields = [],
  mainForm
}) {
  const [err, setErr] = useState(false)
  const [activeKey, setActiveKey] = useState()
  const [form] = Form.useForm();
  const nameTable = name;
  let fieldDepends = Form.useWatch(dependOf, mainForm);
  const handlerOnOK = (values) => {
    console.log('values', values[name])
    setActiveKey([])
    mainForm.setFieldValue(name, values[name])
  }
  const handleKeyDown = (event) => {
    if (event.keyCode === 13) {
      event.preventDefault();
    }
  };
  const formElement = (
    <div style={{ marginBottom: 20 }}>
      <ConfigProvider
        theme={{
          components: {
            Collapse: {
              headerBg: err ? "rgba(255, 0, 0, 0.3)" : "rgba(0, 0, 0, 0.02)"
            },
          },
        }}
      >
        <Form.Item
          name={name}
          rules={[
            () => ({
              validator(_, value) {
                console.log(value)
                if (required && !value) {
                  setErr(false)
                  return Promise.resolve();
                }
                setErr(true)
                return Promise.reject(new Error('Эта группа полей обязательна для заполнения'));
              },
            }),
          ]}
          layout="horizontal"
        >

          <Collapse
            activeKey={activeKey}
            style={{ marginBottom: "0px" }}
            items={[
              {
                key: "1",
                label: label,
                children: (

                  <Form
                    form={form}
                    scrollToFirstError
                    layout="vertical"
                    onFinish={handlerOnOK}
                    onKeyDown={handleKeyDown}
                    style={{ maxWidth: 800, margin: "0 auto" }}
                    labelWrap
                  >

                    {Fields.map((item, index) => {
                      if (item.component_Type.includes("Divider"))
                        return (
                          <DividerForm
                            key={index}
                            {...item.component_Expanded}
                            label={item.label}
                          />
                        );
                      if (item.component_Type.includes("TextInput") && item.component_Expanded.specialField === 'Телефон')

                        return (
                          <PhoneInput
                            key={index}
                            {...item.component_Expanded}
                            {...item}
                            name={[name, item.idLine]}
                            dependOf={
                              item.dependIdLine ? [name, item.dependIdLine] : false
                            }
                            howDepend={item.dependСondition}
                          />
                        );
                      if (item.component_Type.includes("TextInput") && item.component_Expanded.specialField === 'СНИЛС')

                        return (
                          <SnilsInput
                            key={index}
                            {...item.component_Expanded}
                            {...item}
                            name={[name, item.idLine]}
                            dependOf={
                              item.dependIdLine ? [name, item.dependIdLine] : false
                            }
                            howDepend={item.dependСondition}
                          />
                        );
                      if (item.component_Type.includes("TextInput"))

                        return (
                          <TextInput
                            key={index}
                            {...item.component_Expanded}
                            {...item}
                            name={[name, item.idLine]}
                            dependOf={
                              item.dependIdLine ? [name, item.dependIdLine] : false
                            }
                            howDepend={item.dependСondition}
                          />
                        );

                      if (item.component_Type.includes("NumberInput"))
                        return (
                          <NumberInput
                            key={index}
                            {...item.component_Expanded}
                            {...item}
                            name={[name, item.idLine]}
                            dependOf={
                              item.dependIdLine ? [name, item.dependIdLine] : false
                            }
                            howDepend={item.dependСondition}
                          />
                        );
                      if (item.component_Type.includes("SliderInput"))
                        return (
                          <SliderInput
                            key={index}
                            {...item.component_Expanded}
                            {...item}
                            name={[name, item.idLine]}
                            dependOf={
                              item.dependIdLine ? [name, item.dependIdLine] : false
                            }
                            howDepend={item.dependСondition}
                          />
                        );
                      if (
                        item.component_Type.includes("LinkInput") ||
                        item.component_Type.includes("EnumInput") ||
                        item.component_Type.includes("SelectInput")
                      )
                        return (
                          <SelectInput
                            key={index}
                            {...item.component_Expanded}
                            {...item}
                            name={[name, item.idLine]}
                            dependOf={
                              item.dependIdLine
                                ? [nameTable, name, item.dependIdLine]
                                : false
                            }
                            howDepend={item.dependСondition}
                          />
                        );
                      if (item.component_Type.includes("DateInput"))
                        return (
                          <DateInput
                            key={index}
                            {...item.component_Expanded}
                            {...item}
                            name={[name, item.idLine]}
                            dependOf={
                              item.dependIdLine ? [name, item.dependIdLine] : false
                            }
                            howDepend={item.dependСondition}
                          />
                        );
                      if (item.component_Type.includes("AddressInput"))
                        return (
                          <AddressInput
                            key={index}
                            {...item.component_Expanded}
                            {...item}
                            name={item.idLine}
                            dependOf={item.dependIdLine}
                            howDepend={item.dependСondition}
                          />
                        );

                      if (item.component_Type.includes("ConfirmationDocumentNewInput"))
                        return (
                          <ConfirmationDocumentNewInput
                            key={index}
                            {...item.component_Expanded}
                            {...item}
                            name={item.idLine}
                            dependOf={item.dependIdLine}
                            howDepend={item.dependСondition}
                          />
                        );
                    })}
                    <Form.Item>

                      <Button type="primary" onClick={form.submit()}>Сохранить</Button>
                    </Form.Item>
                  </Form>

                ),
              },
            ]}
            defaultActiveKey={[]} //или 1
          />
        </Form.Item>
      </ConfigProvider>
    </div>
  );
  if (!dependOf) return formElement;
  if (dependOf && howDepend && howDepend.options?.length > 0) {
    let show = false;
    if (typeof fieldDepends === "undefined") fieldDepends = false
    howDepend.options.forEach((item) => {
      if (item.value === "true") item.value = true;
      if (item.value === "false") item.value = false;
      if (item.value == fieldDepends) show = true;
    });
    if (show) return formElement;
  }
  if (dependOf && howDepend && howDepend.max) {
    mainForm.setFieldValue(name, "");
    if (fieldDepends >= howDepend.min && fieldDepends <= howDepend.max)
      return formElement;
  }
}
