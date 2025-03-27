import React from 'react'
import { Input, Form } from "antd";
import WrapperComponent from "./WrapperComponent";

export default function CodePodrazdelInput({
    name = "codePodrazdel",
    label = "",
    required = false,
    dependOf = false,
    howDepend = false,
    span = false,
    fullDescription = false,
    stylesField_key = false,
}) {
    const form = Form.useFormInstance();
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
            rules={[
                {
                    required: required,
                    message: "Это поле обязательное",
                },
                // { validator: validateSnils },
            ]}
        >
            <Input
                placeholder={"XXX-XXX"}
                maxLength={7}
                onChange={(e) => {
                    let value = e.target.value.replace(/[^0-9]/g, "");
                    if (value.length > 3)  {
                        value = `${value.slice(0, 3)}-${value.slice(3)}`;
                    }
                    e.target.value = value;

                    form.setFieldValue(name, value);
                }}
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
