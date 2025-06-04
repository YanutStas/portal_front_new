import React from 'react'
import selectComponent from '../../../../components/selectComponent'
import { Badge, Card, Descriptions, Divider, Flex, Form, Typography } from 'antd'
import moment from 'moment';

export default function FieldsClaim({ template, values }) {
    const [form] = Form.useForm();
    // form.setFieldsValue(values)
    console.log(template);
    console.log(values);

    const singleTextField = (index, label, value) => {
        return <div key={index} style={{ width: "100%" }}><Flex gap={10}><Typography.Text style={{ color: "grey" }}>{label}: </Typography.Text><Typography.Text>{value}</Typography.Text></Flex></div>
    }
    const getField = (index, label, idLine, linkInput = false, valItem = false) => {
        // console.log("valItem", valItem);
        let value = valItem ? valItem[idLine] : values[idLine]
        if (linkInput) {
            value = template.portalFields.links[linkInput]?.options?.find(item => item.value === value)?.label
        }
        return singleTextField(index, label, value)
    }
    const getSwitch = (index, label, idLine, valItem = false) => {
        let value = valItem ? valItem[idLine] : values[idLine]
        return singleTextField(index, label, value ? "да" : "нет")
    }
    const getDate = (index, label, idLine, valItem = false) => {
        let value = valItem ? valItem[idLine] : values[idLine]
        let date = "не указана"
        if (value) {
            date = moment(value).format("DD.MM.YYYY hh:mm")
        }
        return singleTextField(index, label, date)
    }
    const getAddress = (index, label, idLine, valItem = false) => {
        let value = valItem ? valItem[idLine]?.fullAddress : values[idLine]?.fullAddress
        return singleTextField(index, label, value)
    }
    const getDivider = (index, label) => {
        return <Divider key={index} orientation='left'>{label}</Divider>
    }
    const getGroupFields = (index, field) => {
        return <Card key={index} title={field.label} style={{ flexGrow: 1 }}>
            {getFields(field.component.fields, true)}
        </Card>
    }
    const getTable = (index, field) => {
        // console.log("table", field)
        const valuesTable = values[field.idLine]
        // console.log("valuesTable", valuesTable)
        return <Card key={index} title={field.label} style={{ flexGrow: 1 }}>
            <Flex wrap="wrap" gap={10}>
                {valuesTable.map((valItem, index) =>
                    <Card title={index + 1} key={index} style={{ flexGrow: 1 }}>
                        {getFields(field.component.fields, true, valItem)}
                    </Card>
                )}
            </Flex>
        </Card>
    }
    const getFields = (fields, inGroup = false, valItem) => {
        return <Flex gap={10} wrap={"wrap"} vertical={inGroup}>{fields.map((field, index) => {
            if (field.component.Ref_Type === "componentsHiddenInput") {
                return false
            }
            if (field.component.Ref_Type === "componentsDivider") {
                return getDivider(index, field.label)
            }
            if (field.component.Ref_Type === "componentsDateInput") {
                return getDate(index, field.label, field.idLine)
            }
            if (field.component.Ref_Type === "componentsAddressInput") {
                return getAddress(index, field.label, field.idLine)
            }
            if (field.component.Ref_Type === "componentsSwitchInput") {
                return getSwitch(index, field.label, field.idLine)
            }
            if (field.component.Ref_Type === "componentsGroupFieldsInput") {
                return getGroupFields(index, field)
            }
            if (field.component.Ref_Type === "componentsTableInput") {
                return getTable(index, field)
            }
            if (field.component.Ref_Type === "componentsLinkInput") {
                return getField(index, field.label, field.idLine, field.component.Ref_Key)
            }
            if (field.component.Ref_Type !== "componentsGroupFieldsInput" &&
                field.component.Ref_Type !== "componentsTableInput" &&
                field.component.Ref_Type !== "componentsDivider" &&
                field.component.Ref_Type !== "componentsAddressInput"
            ) {
                console.log("valItem", valItem);

                return getField(index, field.label, field.idLine, false, valItem)
            }
        })}
        </Flex>
    }
    return (
        <div>
            {/* <Form
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
            </Form> */}
            {/* <Descriptions  bordered items={items} column={1} /> */}

            {!template.portalFields.fields && <Typography.Paragraph>Полей не существует</Typography.Paragraph>}
            {template.portalFields.fields && getFields(template.portalFields.fields)}
            {/* {template.portalFields.} */}

        </div>
    )
}
