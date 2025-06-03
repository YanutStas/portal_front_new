import React from "react";
import { Button, Form, theme, Flex, Typography } from "antd";
import TextInput from "../../components/FormComponentsNew/TextInput";
import NumberInput from "../../components/FormComponentsNew/NumberInput";
import SliderInput from "../../components/FormComponentsNew/SliderInput";
import SelectInput from "../../components/FormComponentsNew/SelectInput";
import DateInput from "../../components/FormComponentsNew/DateInput";
import DividerForm from "../../components/FormComponentsNew/DividerForm";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import SwitchInput from "./SwitchInput";
import FormulaInput from "./FormulaInput";
import PriceInput from "./PriceInput";
import PhoneInput from "./phoneComponent/PhoneInput";
import styles from "./GroupInput.module.css";
import WrapperComponent from "./WrapperComponent";
import TableResults from "./TableResults";

export default function TableInput({
  name = "nameTableInput",
  label = "Поле",
  required = false,
  dependOf = false,
  howDepend = false,
  fields: Fields = [],
  span = false,
  stylesField_key = false,
  read = false
}) {
  const { colorBorder, colorBgContainer } = theme.useToken().token;
  const nameTable = name;

  const formElement = (
    <>
      <div
        style={{
          backgroundColor: colorBgContainer,
          width: "100%",
          color: colorBorder,
        }}
        className={`formElement ${styles.formElement}`}
      >
        <Typography.Title level={5} style={{ margin: "0 0 10px 0" }}>
          {label}
        </Typography.Title>
        <Form.List name={name}>
          {(fields, { add, remove }) => {
            if (required && fields.length === 0)
              fields.push({
                name: 0,
                key: 0,
                isListField: true,
                fieldKey: 0,
                read:read
              });
            return (
              <>
                {fields.map(({ key, name }, index) => (
                  <Flex
                    key={key}
                    gap={10}
                    wrap={true}
                    style={{
                      border: `1px solid ${colorBorder}`,
                      borderRadius: "10px",
                      padding: "10px 10px 10px 20px",
                      margin: "5px",
                      position: "relative",
                    }}
                    align="baseline"
                  >
                    <Typography.Text
                      style={{
                        position: "absolute",
                        top: 3,
                        left: 6,
                        fontSize: 18,
                        fontWeight: 700,
                        color: colorBorder,
                      }}
                    >
                      {index + 1}
                    </Typography.Text>


                    {Fields.map((item, index) => {
                      if (item.component.Ref_Type.includes("Divider"))
                        return (
                          <DividerForm
                            key={index}
                            {...item.component}
                            label={item.label}
                            read={read}
                          />
                        );
                      if (
                        item.component.Ref_Type.includes("TextInput") &&
                        item.component?.specialField === "Телефон"
                      )
                        return (
                          <PhoneInput
                            key={index}
                            {...item.component}
                            {...item}
                            name={[name, item.idLine]}
                            dependOf={
                              item.dependIdLine
                                ? [name, item.dependIdLine]
                                : false

                            }
                            howDepend={item.dependСondition}
                            read={read}
                          />
                        );
                      if (item.component.Ref_Type.includes("TextInput"))
                        return (
                          <TextInput
                            key={index}
                            {...item.component}
                            {...item}
                            name={[name, item.idLine]}
                            dependOf={
                              item.dependIdLine
                                ? [name, item.dependIdLine]
                                : false
                            }
                            howDepend={item.dependСondition}
                            read={read}
                          />
                        );
                      if (item.component.Ref_Type.includes("NumberInput"))
                        return (
                          <NumberInput
                            key={index}
                            {...item.component}
                            {...item}
                            name={[name, item.idLine]}
                            dependOf={
                              item.dependIdLine
                                ? [name, item.dependIdLine]
                                : false
                            }
                            howDepend={item.dependСondition}
                            read={read}
                          />
                        );
                      if (item.component.Ref_Type.includes("SliderInput"))
                        return (
                          <SliderInput
                            key={index}
                            {...item.component}
                            {...item}
                            name={[name, item.idLine]}
                            dependOf={
                              item.dependIdLine
                                ? [name, item.dependIdLine]
                                : false
                            }
                            howDepend={item.dependСondition}
                            read={read}
                          />
                        );
                      if (
                        item.component.Ref_Type.includes("LinkInput") ||
                        item.component.Ref_Type.includes("EnumInput") ||
                        item.component.Ref_Type.includes("SelectInput")
                      )
                        return (
                          <SelectInput
                            key={index}
                            {...item.component}
                            {...item}
                            name={[name, item.idLine]}
                            dependOf={
                              item.dependIdLine
                                ? [nameTable, name, item.dependIdLine]
                                : false
                            }
                            howDepend={item.dependСondition}
                            read={read}
                          />
                        );
                      if (item.component.Ref_Type.includes("DateInput"))
                        return (
                          <DateInput
                            key={index}
                            {...item.component}
                            {...item}
                            name={[name, item.idLine]}
                            dependOf={
                              item.dependIdLine
                                ? [name, item.dependIdLine]
                                : false
                            }
                            howDepend={item.dependСondition}
                            read={read}
                          />
                        );
                      if (item.component.Ref_Type.includes("SwitchInput"))
                        return (
                          <SwitchInput
                            key={index}
                            {...item.component}
                            {...item}
                            name={[name, item.idLine]}
                            dependOf={
                              item.dependIdLine
                                ? [name, item.dependIdLine]
                                : false
                            }
                            howDepend={item.dependСondition}
                            read={read}
                          />
                        );
                      if (item.component.Ref_Type.includes("PriceInput"))
                        return (
                          <PriceInput
                            key={index}
                            {...item.component}
                            {...item}
                            name={[name, item.idLine]}
                            dependOf={
                              item.dependIdLine
                                ? [name, item.dependIdLine]
                                : false
                            }
                            howDepend={item.dependСondition}
                            read={read}
                          />
                        );
                      if (item.component.Ref_Type.includes("componentsFormula"))
                        return (
                          <FormulaInput
                            key={index}
                            {...item.component}
                            {...item}
                            name={[name, item.idLine]}
                            dependOf={
                              item.dependIdLine
                                ? [name, item.dependIdLine]
                                : false
                            }
                            howDepend={item.dependСondition}
                            read={read}
                          />
                        );
                    })}
                    {!required || (required && fields.length !== 1) ? (
                      <MinusCircleOutlined
                        onClick={() => remove(name)}
                        style={{
                          position: "absolute",
                          top: 7,
                          right: 7,
                          fontSize: 18,
                          fontWeight: 700,
                          color: colorBorder,
                        }}
                      />
                    ) : (
                      false
                    )}
                  </Flex>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Добавить
                  </Button>
                </Form.Item>
                {Fields &&
                  Fields.filter((item) => item.typeTotal).length > 0 && (
                    <>
                      {/* <Divider style={{ margin: 10, }} /> */}
                      <Flex vertical style={{ marginTop: 10 }}>
                        {Fields.filter((item) => item.typeTotal).map(
                          (item, index) => (
                            <TableResults
                              key={index}
                              typeTotal={item.typeTotal}
                              table={name}
                              field={item.idLine}
                              label={item.label}
                            />
                          )
                        )}
                      </Flex>
                    </>
                  )}
              </>
            );
          }}
        </Form.List>
      </div>
    </>
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
