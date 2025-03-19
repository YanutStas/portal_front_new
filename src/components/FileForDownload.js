import React from 'react'
import pdf from "../img/docs/pdf.svg";
import doc from "../img/docs/doc.svg";
import docx from "../img/docs/docx.svg";
import rar from "../img/docs/rar.svg";
import xls from "../img/docs/xls.svg";
import rtf from "../img/docs/rtf.svg";
import styles from './FileForDownload.module.css'
const typeFile = {
    pdf,
    doc,
    docx,
    rar,
    xls,
    rtf,
  };
  const backServer = import.meta.env.VITE_APP_BACK_BACK_SERVER;
export default function FileForDownload({ type, url, name, size }) {
    return (
        <a
            className={styles.docLine}
            href={`${backServer}${url}`}
            download=""
            rel="noopener noreferrer"
            target="_blank"
        >
            <div className={styles.docLine__wrapIcon}>
                <img
                    src={typeFile[type]}
                    alt={`icon ${type}`}
                />
            </div>
            <div className="docLine__wrapText">
                <span className={styles.docLine__name}>
                    {name}
                </span>
                <span className={styles.docLine__fileInfo}>
                    {Number(size) > 1000
                        ? `${(Number(size) / 1000).toFixed(2)} МБ`
                        : `${Math.round(Number(size))} КБ`}
                </span>
            </div>
        </a>
    )
}
