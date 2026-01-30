import React from 'react'
import { Input, Form } from "antd";
import WrapperComponent from "./WrapperComponent";
import InfoDrawer from "../InfoDrawer";

export default function SeriaDocInput({
    name = "seriaDoc",
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
                    min: 4,
                    message: "Минимальная длина 4 цифр"
                },
                {
                    required: required,
                    message: "Это поле обязательное",
                },
                () => ({
                    validator(_, value) {
                        if (value == "0000") {
                            return Promise.reject(new Error('Неверные данные'));
                        }
                        return Promise.resolve();
                    },
                }),
            ]}
        >
            <Input
                placeholder={placeholder}
                maxLength={4}
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
