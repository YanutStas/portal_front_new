import React from "react";
import pdf from "../../img/docs/pdf.svg";
import styles from "./Law.module.css";
import politica_file from "../../files/politica.pdf";


export default function PoliciesAndRegulations() {
  return (
    <div className="row-docs-age">
      <a
        className={styles.docLine}
        href={politica_file}
        download=""
        rel="noopener noreferrer"
        target="_blank"
      >
        <div className={styles.docLine__wrapIcon}>
          <img src={pdf} alt={"PDF"} />
        </div>
        <div className="docLine__wrapText">
          <span className={styles.docLine__name}>
            Политика обработки персональных данных «АО Мособлэнерго»
          </span>
          <span className={styles.docLine__fileInfo}>2.6 МБ</span>
        </div>
      </a>
    </div>
  );
}
