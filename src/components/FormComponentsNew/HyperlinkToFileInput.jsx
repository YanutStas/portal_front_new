import React, { useEffect } from 'react'
import { Input, Form, Flex } from "antd";
import WrapperComponent from "./WrapperComponent";
import InfoDrawer from "../InfoDrawer";
import useGlobal from '../../stores/useGlobal';
import { Link } from 'react-router-dom';
import FileForDownload from '../FileForDownload';

export default function HyperlinkToFileInput({
    name = "Hyperlink",
    label = "",
    required = undefined,
    dependOf = false,
    howDepend = false,
    placeholder = false,
    span = false,
    fullDescription = false,
    stylesField_key = false,
    typeHyperlink = false,
    file = false,
    externalAddress = false
}) {
    const form = Form.useFormInstance();
    const testData = useGlobal((state) => state.testData)
    useEffect(() => {
        if (testData) {
            form.setFieldValue(name, "1234567890123")
        }
    }, [testData])
    const formElement = (
       <Flex align='center' style={{height:"100%"}}>
            {typeHyperlink === "ПубличныйФайл" &&
                <FileForDownload id={file.Ref_Key} name={label || file.name} size={file.size} />
            }
            {typeHyperlink === "ВнешнийАдрес" &&
                <Link to={externalAddress} target='_blank'>{label}</Link>
            }
            </Flex>
        // </Form.Item>
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
