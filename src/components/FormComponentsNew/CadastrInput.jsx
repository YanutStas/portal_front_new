import React from 'react'
import { Input, Form } from "antd";
import WrapperComponent from "./WrapperComponent";
import InfoDrawer from "../InfoDrawer";

export default function CadastrInput({
    name = "cadastr",
    label = "",
    required = false,
    dependOf = false,
    howDepend = false,
    span = false,
    fullDescription = false,
    stylesField_key = false,
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
                let newvalue = value.replace(/[^\d,:]/g, "");
                if (newvalue.length === 2) {
                    newvalue = `${newvalue}:`;
                }
                if (newvalue.length === 5) {
                    newvalue = `${newvalue}:`;
                }
                return newvalue
            }}
            rules={[
                {
                    required: required,
                    message: "Это поле обязательное",
                },
                // { validator: validateSnils },
            ]}
        >
            <Input
                placeholder={"XX:XX:XXXXXXX:XXXXXXXXX"}
                maxLength={23}
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
