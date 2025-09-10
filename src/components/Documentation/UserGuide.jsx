import React from "react";
import pdfIcon from "../../img/docs/pdf.svg";
import styles from "./Law.module.css";
import userGuidePdf from "../../assets/Руководство пользователя Портал потребителя АО «Мособлэнерго».pdf";

export default function UserGuide() {
  return (
    <div className="row-docs-age">
      <a
        className={styles.docLine}
        href={userGuidePdf}
        download="Руководство_пользователя_Мособлэнерго.pdf"
        rel="noopener noreferrer"
        target="_blank"
      >
        <div className={styles.docLine__wrapIcon}>
          <img src={pdfIcon} alt="PDF" />
        </div>
        <div className="docLine__wrapText">
          <span className={styles.docLine__name}>
            Руководство пользователя Порталом потребителя услуг АО
            «Мособлэнерго»
          </span>
          <span className={styles.docLine__fileInfo}>3.2 МБ</span>
        </div>
      </a>
    </div>
  );
}

// import React, { useEffect, useState } from "react";
// import pdf from "../../img/docs/pdf.svg";
// import axios from "axios";
// import styles from "./Law.module.css";

// const siteMosoblServer = import.meta.env.VITE_BACK_SITE_MOSOBLENERGO_SERVER;

// export default function UserGuide() {
//   const [docs, setDocs] = useState([]);
//   useEffect(() => {
//     axios
//       .get(`${siteMosoblServer}/api/tp-normativno-pravovye-akty?populate=*`)
//       .then((response) => {
//         if (response.data) {
//           setDocs(response.data.data.attributes.docs.data);
//         }
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   }, []);

//   return (
//     <div className="row-docs-age">
//       <a
//         className={styles.docLine}
//         href={"/#"}
//         download=""
//         rel="noopener noreferrer"
//         target="_blank"
//       >
//         <div className={styles.docLine__wrapIcon}>
//           <img src={pdf} alt={"PDF"} />
//         </div>
//         <div className="docLine__wrapText">
//           <span className={styles.docLine__name}>Руководство пользователя</span>
//           <span className={styles.docLine__fileInfo}>567 КБ</span>
//         </div>
//       </a>
//     </div>
//   );
// }
