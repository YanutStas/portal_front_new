import React from 'react'
import { Input, Form } from "antd";
import WrapperComponent from "./WrapperComponent";
import InfoDrawer from "../InfoDrawer";

export default function SchetInput({
    name = "schet",
    label = "",
    required = false,
    dependOf = false,
    howDepend = false,
    placeholder = false,
    span = false,
    fullDescription = false,
    stylesField_key = false,
    maxLength = false
}) {
    // const form = Form.useFormInstance();
    // console.log("CadastrInput");
    // console.log("name", name);

    const formElement = (
        <Form.Item
            label={
                fullDescription ? (
                    <InfoDrawer fullDescription={fullDescription}>{label}</InfoDrawer>
                ) : (
                    label
                )
            }
            name={name}
            normalize={(value) => {
                let newvalue = value.replace(/[^\d]/g, "");
                return newvalue
            }}
            rules={[
                {
                    min: maxLength,
                    message: `Минимальная длина ${maxLength} цифр`,
                },
                {
                    required: required,
                    message: "Это поле обязательное",
                },
            ]}
        >
            <Input
                placeholder={placeholder}
                maxLength={maxLength}
            />
        </Form.Item>
    );

    return (
        <WrapperComponent
            span={span}
            stylesField_key={stylesField_key}
            dependOf={dependOf}
            howDepend={howDepend}
            name={name}
        >
            {formElement}
        </WrapperComponent>
    );
}
