import pdf from "../img/docs/pdf.svg";
import doc from "../img/docs/doc.svg";
import docx from "../img/docs/docx.svg";
import rar from "../img/docs/rar.svg";
import xls from "../img/docs/xls.svg";
import rtf from "../img/docs/rtf.svg";
import styles from "./FileForOpen.module.css";
import openDocs from "./Cabinet/openDocument";
import { useState } from "react";
import { Flex, message, Spin } from "antd";
const type = {
    pdf,
    doc,
    docx,
    rar,
    xls,
    rtf,
};

export default function FileForOpen({ id, name, size, ext }) {
    const [messageApi, contextHolder] = message.useMessage();
    const [downloading, setDownloading] = useState(false)
    return (
        <>
            {contextHolder}
            <a
                onClick={async () => {
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
                }}
            // key={index}
            // className={styles.docLine}
            // href={`${siteMosoblServer}${url}`}
            // download=""
            // rel="noopener noreferrer"
            // target="_blank"
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
                        <span className={styles.docLine__name}>{name}</span>
                        <span className={styles.docLine__fileInfo}>
                            {Number(size) > 1000
                                ? `${(size / 1000).toFixed(2)} МБ`
                                : `${Math.round(size)} КБ`}
                        </span>
                    </div>
                </Flex>
            </a>
        </>
    )
}