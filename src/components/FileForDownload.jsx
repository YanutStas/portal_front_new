import React from "react";
import pdf from "../img/docs/pdf.svg";
import doc from "../img/docs/doc.svg";
import docx from "../img/docs/docx.svg";
import rar from "../img/docs/rar.svg";
import xls from "../img/docs/xls.svg";
import rtf from "../img/docs/rtf.svg";
import svg from "../img/docs/svg.svg";
import png from "../img/docs/png.svg";
import noext from "../img/docs/noext.svg";
import styles from "./FileForDownload.module.css";
import openDocs from "./Cabinet/openDocument";
import moment from "moment";
const typeFile = {
  pdf,
  doc,
  docx,
  rar,
  xls,
  rtf,
  svg,
  png,
  noext
};
const backServer = import.meta.env.VITE_BACK_BACK_SERVER;
export default function FileForDownload({ type, id, name, size, date = false }) {
  // console.log(url);

  return (
    <a
      className={styles.docLine}
      // href={`${backServer}/uploads/${url}`}
      // download=""
      // rel="noopener noreferrer"
      // target="_blank"
      onClick={() => {
        openDocs(id)
      }}
    >
      <div className={styles.docLine__wrapIcon}>
        <img src={typeFile[type] ? typeFile[type] : typeFile.noext} alt={`icon ${type}`} />
      </div>
      <div className="docLine__wrapText">
        <span className={styles.docLine__name}>{name}</span>
        <span className={styles.docLine__fileInfo}>
          {Number(size / 1000) > 1000
            ? `${(Number(size / 1000) / 1000).toFixed(2)}МБ`
            : `${Math.round(Number(size / 1000))}КБ`}
        </span>
        {date &&
          <span className={styles.docLine__fileInfo} style={{ marginLeft: 10 }}>{moment(date).format('DD.MM.YYYY HH.mm')}</span>
        }
      </div>
    </a>
  );
}
