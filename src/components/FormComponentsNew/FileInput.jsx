import React, { useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import { EyeOutlined, DeleteOutlined, FilePdfOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Flex,
  Form,
  notification,
  Tag,
  Upload,
  theme,
  Modal,
} from "antd";
import { Space } from "antd";
import InfoDrawer from "../InfoDrawer";
import WrapperComponent from "./WrapperComponent";
import axios from "axios";
import useNewClaim from "../../stores/Cabinet/useClaims";
import openDocs from "../Cabinet/openDocument";
import { CloseOutlined } from '@ant-design/icons';
import pdfIcon from '../../img/docs/pdf.svg';

const backServer = import.meta.env.VITE_BACK_BACK_SERVER;

const MiniThumb = ({ file, onPreview, onRemove }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      border: "1px solid #d9d9d9",
      borderRadius: 6,
      padding: 8,
      marginBottom: 8,
    }}
  >
    {file.type === 'application/pdf' ? (
      <img
        src={pdfIcon}
        alt="PDF icon"
        style={{ width: 60, height: 'auto', marginRight: 12 }}
      />
    ) : (
      <img
        src={URL.createObjectURL(file)}
        alt={file.name}
        style={{
          height: 60,
          maxWidth: 90,
          objectFit: "cover",
          borderRadius: 4,
          marginRight: 12,
        }}
      />
    )}
    <div
      style={{
        flex: 1,
        marginLeft: 12,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      }}
    >
      {file.name}
    </div>
    <Space size="small">
      <EyeOutlined
        style={{ cursor: "pointer", color: "#555" }}
        onClick={() => onPreview(file)}
        title="Просмотреть полноразмерно"
      />
      <DeleteOutlined
        style={{ cursor: "pointer", color: "#ff4d4f" }}
        onClick={() => onRemove(file)}
        title="Удалить"
      />
    </Space>
  </div>
);

const FileInput = ({
  name = "name",
  label = "Поле",
  defaultValue = undefined,
  placeholder = "",
  category_key = null,
  required = false,
  dependOf = false,
  howDepend = false,
  span = false,
  fullDescription = false,
  stylesField_key = false,
  read = false,
}) => {
  const [api, contextHolder] = notification.useNotification();
  const { removeBlockButtonNewClaim, addBlockButtonNewClaim } = useNewClaim(
    (state) => state
  );
  const form = Form.useFormInstance();
  const tokenJWT = localStorage.getItem("jwt");
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [reload, setReload] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewFileUrl, setPreviewFileUrl] = useState(null);
  const [previewFileType, setPreviewFileType] = useState(null);
  const { token } = theme.useToken();

  const openNotification = (message) => {
    api.info({
      message: `${message}`,
      placement: "top",
    });
  };
  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("documentName", label);
    formData.append("categoryKey", category_key);

    fileList.forEach((file) => {
      formData.append("files", file);
    });
    setUploading(true);
    addBlockButtonNewClaim();
    axios
      .post(`${backServer}/api/cabinet/upload-file`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${tokenJWT}`,
        },
        withCredentials: true,
      })
      .then((res) => {
        // console.log(res.data);
        setFileList([]);
        // message.success('upload successfully.');
        if (res.data?.fileId) {
          form.setFieldValue(name, {
            fileId: res.data.fileId,
            category_key,
            label,
          });
        }
      })
      .catch((err) => {
        console.error("upload failed.", err);
        openNotification(err.response?.data?.message);
      })
      .finally(() => {
        setUploading(false);
        removeBlockButtonNewClaim();
      });
  };
  const props = {
    multiple: true,
    showUploadList: false,
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      console.log(file);
      setFileList((prev) => [...prev, file]);
      return false;
    },
    fileList,
  };

  const attachedDocument = form.getFieldValue(name);
  // console.log(attachedDocument);

  const isAttached = !!attachedDocument;

  const delDocs = () => {
    form.setFieldValue(name, null);
    setReload(!reload);
  };
  const viewDocs = () => {
    console.log("Preview", attachedDocument);

    openDocs(attachedDocument.fileId);
  };
  // console.log("required", required);

  const previewFile = (file) => {
    const url = URL.createObjectURL(file);
    setPreviewFileUrl(url);
    setPreviewFileType(file.type);
    setPreviewVisible(true);
  };
  const removeItem = (file) =>
    setFileList((prev) => prev.filter((f) => f !== file));

  const formElement = (
    <Card
      title={label}
      style={{
        borderColor: isAttached ? "green" : token.colorPrimary,
        minHeight: 300,
        height: "100%",
      }}
      styles={{
        title: {
          whiteSpace: "break-spaces",
        },
        body: {
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        },
      }}
      extra={
        isAttached ? (
          <Tag color="green">Добавлен</Tag>
        ) : (
          <Tag color={"blue"}>НЕ добавлен</Tag>
        )
      }
    >
      {contextHolder}
      <Form.Item
        required
        name={name}
        rules={[
          {
            required: required,
            message: "Это поле обязательное",
          },
        ]}
      ></Form.Item>
      {!isAttached && (
        <Flex gap={10} vertical justify="center" style={{ height: "100%" }}>
          <Upload {...props} style={{ display: "", width: "100%" }}>
            <Button icon={<UploadOutlined />} type="primary">
              Выбрать файлы
            </Button>
          </Upload>


          <div
            style={{
              maxHeight: 240,
              overflowY: "auto",
              marginTop: 8,
              paddingRight: 4,
            }}
          >
            {fileList.map((file) => (
              <MiniThumb
                key={file.name}
                file={file}
                onPreview={previewFile}
                onRemove={removeItem}
              />
            ))}
          </div>

          <Button
            type="primary"
            onClick={handleUpload}
            disabled={fileList.length === 0}
            loading={uploading}
            style={{ marginTop: 16 }}
          >
            {uploading ? "Загрузка..." : "Добавить документ"}
          </Button>

        </Flex>
      )}
      {isAttached && (
        <Flex gap={10} vertical>
          <Button onClick={viewDocs}>Посмотреть документ</Button>
          <Button onClick={delDocs} danger>
            Удалить документ
          </Button>
        </Flex>
      )}
    </Card>
  );

  return (
    <>
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
      <Modal
        open={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        closeIcon={<CloseOutlined style={{ color: '#ff4d4f', fontSize: 28 }} />}
        footer={null}
        styles={{
          body: {
            padding: 0
          }
        }}
        width={previewFileType === 'application/pdf' ? '80%' : 'auto'}
        style={{ textAlign: 'center' }}
      >
        {previewFileType === 'application/pdf' ? (
          <object
            data={previewFileUrl}
            type="application/pdf"
            width="100%"
            height="600px"
          >
            <p>Ваш браузер не поддерживает просмотр PDF. <a href={previewFileUrl} target="_blank">Скачать PDF</a></p>
          </object>
        ) : (
          <img
            alt="Preview"
            src={previewFileUrl}
            style={{ width: '100%', display: 'block' }}
          />
        )}
      </Modal>
    </>
  );
};
export default FileInput;
