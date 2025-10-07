import React, { useEffect } from 'react'
import { Input, Form } from "antd";
import WrapperComponent from "./WrapperComponent";
import InfoDrawer from "../InfoDrawer";
import useGlobal from '../../stores/useGlobal';

export default function KppInput({
    name = "kpp",
    label = "",
    required = undefined,
    dependOf = false,
    howDepend = false,
    placeholder = false,
    span = false,
    fullDescription = false,
    stylesField_key = false,
}) {
    const testData = useGlobal((state) => state.testData)
    const form = Form.useFormInstance();
    // const form = Form.useFormInstance();
    // console.log("CadastrInput");
    // console.log("name", name);
    useEffect(() => {
        if (testData) {
            form.setFieldValue(name, "502401001")
        }
    }, [testData])
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
                    min: 9,
                    message: "Минимальная длина 9 цифр"
                },
                {
                    required: required,
                    message: "Это поле обязательное",
                },
                // { validator: validateSnils },
            ]}
        >
            <Input
                placeholder={placeholder}
                maxLength={9}
            // minLength={9}
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
