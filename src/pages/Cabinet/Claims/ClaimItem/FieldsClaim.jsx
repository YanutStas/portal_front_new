import React from 'react'
import selectComponent from '../../../../components/selectComponent'
import { Form } from 'antd'

export default function FieldsClaim({ template, values }) {
    const [form] = Form.useForm();
    form.setFieldsValue(values)
    return (
        <div>
            <Form
                disabled
                form={form}
                labelAlign="right"
                layout="vertical"
                labelWrap
                style={{
                    width: "100%",
                    margin: "0 auto",
                }}
            >
                {template?.portalFields?.fields?.map((item, index) => selectComponent(item, index, true))}
            </Form>
        </div>
    )
}
