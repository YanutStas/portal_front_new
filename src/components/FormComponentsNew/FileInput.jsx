import React, { useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { Button, Card, Flex, Form, message, Tag, Typography, Upload } from 'antd';
import InfoDrawer from "../InfoDrawer";
import WrapperComponent from "./WrapperComponent";
import axios from 'axios';
import useNewClaim from '../../stores/Cabinet/useClaims';
import openDocs from '../Cabinet/openDocument';

const backServer = import.meta.env.VITE_BACK_BACK_SERVER;

const FileInput = ({
    name = "name",
    label = "Поле",
    defaultValue = false,
    placeholder = "",
    category_key = null,
    required = false,
    dependOf = false,
    howDepend = false,
    span = false,
    fullDescription = false,
    stylesField_key = false,
    read = false
}) => {
    const { removeBlockButtonNewClaim, addBlockButtonNewClaim } = useNewClaim(state => state)
    const form = Form.useFormInstance();
    const token = localStorage.getItem("jwt");
    const [fileList, setFileList] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [reload, setReload] = useState(false);

    const handleUpload = async () => {
        const formData = new FormData();
        formData.append("documentName", label);
        formData.append("categoryKey", category_key);

        fileList.forEach(file => {
            formData.append('files', file);
        });
        setUploading(true);
        addBlockButtonNewClaim()
        // You can use any AJAX library you like
        axios.post(`${backServer}/api/cabinet/upload-file`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
        }).then((res) => {
            // console.log(res.data);
            setFileList([]);
            // message.success('upload successfully.');
            if (res.data?.fileId) {
                form.setFieldValue(name, {
                    fileId: res.data.fileId,
                    category_key,
                    label
                })
            }
        }).catch(() => {
            console.error('upload failed.');
        }).finally(() => {
            setUploading(false);
            removeBlockButtonNewClaim()
        });
    };
    const props = {
        multiple: true,
        onRemove: file => {
            const index = fileList.indexOf(file);
            const newFileList = fileList.slice();
            newFileList.splice(index, 1);
            setFileList(newFileList);
        },
        beforeUpload: file => {
            console.log(file)
            setFileList(prev => [...prev, file]);
            return false;
        },
        fileList,
    };

    const attachedDocument = form.getFieldValue(name);
    // console.log(attachedDocument);

    const isAttached = !!attachedDocument;

    const delDocs = () => {
        form.setFieldValue(name, null)
        setReload(!reload)
    }
    const viewDocs = () => {
        openDocs(attachedDocument)
    }

    const formElement = (

        <Card
            title={label}
            style={{
                borderColor: isAttached ? "green" : "red",
                height: "min(300px, 100%)",
            }}
            styles={{
                title: {
                    whiteSpace: "break-spaces"
                },
                body: {
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                },
            }}
            extra={isAttached ? <Tag color='green'>Добавлен</Tag> : <Tag color='red'>НЕ добавлен</Tag>}
        >
            <Form.Item
                name={name}
                rules={[
                    {
                        required: required,
                        message: "Это поле обязательное",
                    },
                ]}
            >
            </Form.Item>
            {!isAttached &&
                <Flex gap={10} vertical justify='center' style={{ height: "100%" }}>
                    <Upload {...props} style={{ display: "", width: "100%" }}>
                        <Button icon={<UploadOutlined />} type='primary'>Выбрать файлы</Button>
                    </Upload>
                    <Button
                        type="primary"
                        onClick={handleUpload}
                        disabled={fileList.length === 0}
                        loading={uploading}
                        style={{ marginTop: 16 }}
                    >
                        {uploading ? 'Загрузка...' : 'Добавить документ'}
                    </Button>
                </Flex>
            }
            {isAttached &&
                <Flex gap={10} vertical>
                    <Button onClick={viewDocs} >Посмотреть документ</Button>
                    <Button onClick={delDocs} danger>Удалить документ</Button>
                </Flex>
            }
        </Card >
    );
    return (
        <WrapperComponent
            span={span}
            stylesField_key={stylesField_key}
            dependOf={dependOf}
            howDepend={howDepend}
            name={name}
            read={read}
        >
            {formElement}
        </WrapperComponent>
    )
};
export default FileInput;