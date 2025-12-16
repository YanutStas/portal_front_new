import React from 'react'
import { Input, Form } from "antd";
import WrapperComponent from "./WrapperComponent";
import InfoDrawer from "../InfoDrawer";

export default function NumberDocInput({
    name = "numberDoc",
    label = "",
    required = undefined,
    dependOf = false,
    howDepend = false,
    placeholder = "",
    span = false,
    fullDescription = false,
    stylesField_key = false,
}) {
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
                    min: 6,
                    message: "Минимальная длина 6 цифр"
                },
                {
                    required: required,
                    message: "Это поле обязательное",
                },
                () => ({
                    validator(_, value) {
                        if (value == "000000") {
                            return Promise.reject(new Error('Неверные данные'));
                        }
                        return Promise.resolve();
                    },
                }),
            ]}
        >
            <Input
                placeholder={placeholder}
                maxLength={6}
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
