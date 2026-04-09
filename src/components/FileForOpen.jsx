import pdf from "../img/docs/pdf.svg";
import doc from "../img/docs/doc.svg";
import docx from "../img/docs/docx.svg";
import rar from "../img/docs/rar.svg";
import xls from "../img/docs/xls.svg";
import rtf from "../img/docs/rtf.svg";
import styles from "./FileForOpen.module.css";
import openDocs from "./Cabinet/openDocument";
import { useState } from "react";
import { Flex, message, Spin, Typography } from "antd";
import FileIcon from "./FileIcon";
const type = {
    pdf,
    doc,
    docx,
    rar,
    xls,
    rtf,
};

export default function FileForOpen({ id, name, size, ext, fontSize }) {
    const [messageApi, contextHolder] = message.useMessage();
    const [downloading, setDownloading] = useState(false)
    const openFile = async () => {
        if (!downloading) {
            setDownloading(true)
            try {
                if (!await openDocs(id, name, false)) {
                    messageApi.open({
                        type: 'error',
                        content: 'Ошибка скачивания файла',
                    });
                }
            } catch (error) {
                console.log(error);
            }
            setDownloading(false)
        }
    }
    return (
        <>
            {contextHolder}
            <FileIcon 
            name={name}
            ext={`.${ext}`}
            onClick={openFile}
            sizeKb={size/1024}

            />
            {/* <a
                onClick={openFile}
            >
                <Flex align="center">

                    <div className={styles.docLine__wrapIcon}>
                        {downloading &&
                            <Spin size="large" />
                        }
                        {!downloading &&
                            <img
                                src={type[ext]}
                                alt={`icon ${ext}`}
                            />
                        }
                    </div>
                    <div className="docLine__wrapText">
                        <Typography.Text style={fontSize === "small" ? { fontSize: 16, lineHeight: 24 } : undefined}>{name}</Typography.Text>
                        <Typography.Text type="secondary">
                            {Number(size) > 1000
                                ? `${(size / 1000).toFixed(2)} МБ`
                                : `${Math.round(size)} КБ`}
                        </Typography.Text>
                    </div>
                </Flex>
            </a> */}
        </>
    )
}