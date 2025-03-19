import React, { useEffect, useState } from "react";
import pdf from "../../img/docs/pdf.svg";
import axios from "axios";
import styles from "./Law.module.css";

const siteMosoblServer = import.meta.env.VITE_BACK_SITE_MOSOBLENERGO_SERVER;

export default function UserGuide() {
  const [docs, setDocs] = useState([]);
  useEffect(() => {
    axios
      .get(`${siteMosoblServer}/api/tp-normativno-pravovye-akty?populate=*`)
      .then((response) => {
        if (response.data) {
          setDocs(response.data.data.attributes.docs.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div className="row-docs-age">
      <a
        className={styles.docLine}
        href={"/#"}
        download=""
        rel="noopener noreferrer"
        target="_blank"
      >
        <div className={styles.docLine__wrapIcon}>
          <img src={pdf} alt={"PDF"} />
        </div>
        <div className="docLine__wrapText">
          <span className={styles.docLine__name}>Руководство пользователя</span>
          <span className={styles.docLine__fileInfo}>567 КБ</span>
        </div>
      </a>
    </div>
  );
}
