import React, { useCallback } from 'react'
import selectComponent from '../../../../components/selectComponent'
import { Badge, Card, Col, Descriptions, Divider, Flex, Form, Row, Typography, theme } from 'antd'
import moment from 'moment';
import axios from 'axios';
import CoordinatesDisplay from '../../../../components/FormComponentsNew/mapComponents/CoordinatesDisplay';

const b64toBlob = (b64Data, contentType = '', sliceSize = 512) => {
    const byteCharacters = atob(b64Data);
    // console.log("byteCharacters",byteCharacters);

    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }
    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
}

export default function FieldsClaim({ template, values }) {
    const token = theme.useToken().token
    // const [form] = Form.useForm();
    // form.setFieldsValue(values)
    console.log(template);
    console.log(values);

    const openDocument = useCallback((fileId) => {
        const backServer = import.meta.env.VITE_BACK_BACK_SERVER;
        const fileUrl = `${backServer}/api/cabinet/get-file/by-id/${fileId}`;
        axios
            .get(fileUrl, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("jwt")}`,
                },
                // responseType: "blob",
                withCredentials: true,
            })
            .then((response) => {
                console.log(response.data.data);

                const file = b64toBlob(response.data.data.base64, "application/pdf")
                const fileURL = URL.createObjectURL(file);
                const newWindow = window.open("", "_blank");
                newWindow.location.href = fileURL;
            })
            .catch((error) => {
                console.error("Ошибка при открытии документа:", error);
            });
    }, []);


    const singleTextField = (index, label, value) => {
        if (!value) {
            return false
        }
        return <div key={index} style={{ width: "100%", paddingLeft: 10 }}>
            <Flex gap={10} wrap={"wrap"}>
                {label && <Typography.Text style={{ color: "gray" }}>{label}: </Typography.Text>}
                <Typography.Text>{value}</Typography.Text>
            </Flex>
        </div>
    }
    const getField = (index, field, linkInput = false, valItem = false) => {
        if (field.dependСondition && values[field.dependIdLine]) {
            let result = field.dependСondition.options.reduce((sum, current) => current.value === values[field.dependIdLine], false);
            if (!result) return false
        }
        let value = valItem ? valItem[field.idLine] : values[field.idLine]
        if (linkInput) {
            value = template.portalFields.links[linkInput]?.options?.find(item => item.value === value)?.label
        }
        return singleTextField(index, field.label, value)
    }
    const getSwitch = (index, label, idLine, valItem = false) => {
        let value = valItem ? valItem[idLine] : values[idLine]
        return singleTextField(index, label, value ? "да" : "нет")
    }
    const getFile = (index, label, idLine, valItem = false) => {
        let value = valItem ? valItem[idLine] : values[idLine]
        return singleTextField(index, label, value ? <a
            // href={`/api/cabinet/get-file/by-id/${value.Ref_Key}`}
            // target='_blank'
            onClick={() => {
                openDocument(value.Ref_Key)
            }}
        >{value.Description}</a> : "нет")
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
        return <Divider key={index} orientation='left' style={{ margin: 10, whiteSpace: "normal" }}>{label}</Divider>
    }
    const getMap = (index, label, idLine, valItem = false) => {
        // console.log("index", index);
        let value = valItem ? valItem[idLine] : values[idLine]
        console.log("value", value);

        return <div key={index} style={{ width: "100%", paddingLeft: 10 }}>
            <Flex gap={10} wrap={"wrap"}>
                {label && <Typography.Text style={{ color: "gray" }}>{label}: </Typography.Text>}
                <div style={{marginTop:-16}}>

                <CoordinatesDisplay coordinates={{
                    point: value?.point ? [value.point?.lat, value.point?.lon] : null,
                    polygon: value?.polygon ? value.polygon.map(item => ([item.lat, item.lon])) : null,
                }} />
                </div>
            </Flex>
        </div>
        // let date = "не указана"
        // if (value) {
        //     date = moment(value).format("DD.MM.YYYY hh:mm")
        // }
        // return singleTextField(index, label, date)
        // return <Divider key={index} orientation='left' style={{ margin: 10, whiteSpace: "normal" }}>{label}</Divider>
    }
    const getGroupFields = (index, field) => {
        // console.log("field", field)
        const styles = template?.portalFields?.styles[field.stylesField_key]
        if (field.dependСondition && values[field.dependIdLine]) {
            let result = field.dependСondition.options.reduce((sum, current) => current.value === values[field.dependIdLine], false);
            if (!result) return false
        }

        return <Col {...styles} xxl={styles?.span ? styles.span : 24} xs={24}>
            <Card className="formElement groupInput" key={index} title={field.label} style={{ borderColor: token.colorBorder, color: token.colorBorder, }} styles={{ title: { whiteSpace: "normal" } }}>
                {getFields(field.component.fields, true)}
            </Card>
        </Col>
    }
    const getTable = (index, field) => {
        const styles = template?.portalFields?.styles[field.stylesField_key]
        const valuesTable = values[field.idLine]
        return <Col {...styles} xxl={styles?.span ? styles.span : 24} xs={24}>

            <Card className="formElement groupInput" style={{ borderColor: token.colorBorder, color: token.colorBorder, }} key={index} title={field.label} styles={{ title: { whiteSpace: "normal", } }} >
                <Flex wrap="wrap" gap={10}>
                    {valuesTable && valuesTable.map((valItem, index) =>
                        <Card className="formElement groupInput" title={<Typography.Text style={{ color: "gray" }}>{index + 1}</Typography.Text>} key={index} style={{ flexGrow: 1, border: "1px solid", borderColor: token.colorBorder, color: token.colorBorder, }}>
                            {getFields(field.component.fields, true, valItem)}
                        </Card>
                    )}
                </Flex>
            </Card>
        </Col>
    }
    const getFields = (fields, inGroup = false, valItem) => {
        return <Row gutter={[10, 10]} align={"stretch"}>{fields.map((field, index) => {
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
            if (field.component.Ref_Type === "componentsFileInput") {
                return getFile(index, field.label, field.idLine)
            }
            if (field.component.Ref_Type === "componentsGroupFieldsInput") {
                return getGroupFields(index, field)
            }
            if (field.component.Ref_Type === "componentsTableInput") {
                return getTable(index, field)
            }
            if (field.component.Ref_Type === "componentsLinkInput") {
                return getField(index, field, field.component.Ref_Key)
            }
            if (field.component.Ref_Type === "componentsMapInput") {
                return getMap(index, field.label, field.idLine)
            }
            if (field.component.Ref_Type !== "componentsGroupFieldsInput" &&
                field.component.Ref_Type !== "componentsTableInput" &&
                field.component.Ref_Type !== "componentsDivider" &&
                field.component.Ref_Type !== "componentsAddressInput" &&
                field.component.Ref_Type !== "componentsMapInput"
            ) {
                return getField(index, field, false, valItem)
            }
        })}
        </Row>
    }
    return (
        <div style={{ paddingBottom: 30 }}>
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

            {!template?.portalFields?.fields && <Typography.Paragraph>Полей не существует</Typography.Paragraph>}
            {template?.portalFields?.fields && getFields(template.portalFields.fields)}
            {/* {template.portalFields.} */}

        </div>
    )
}
