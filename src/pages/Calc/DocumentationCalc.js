import React from "react";
import { Typography } from "antd";
import TweenOne from "rc-tween-one";
import Children from "rc-tween-one/lib/plugin/ChildrenPlugin";

import lawStyles from "../../components/Documentation/Law.module.css";
import pdf from "../../../src/img/pdf.svg";

TweenOne.plugins.push(Children);

const { Title } = Typography;

export default function DocumentationCalc() {
  return (

    <div className={lawStyles.documentsSection}>
      <Title level={4}>Нормативные документы:</Title>
      <div className={lawStyles.rowDocsAge}>
        <a
          className={lawStyles.docLine}
          href={require("./LegalActs/1.pdf")}
          download
        >
          <div className={lawStyles.docLine__wrapIcon}>
            <img src={pdf} alt="PDF" />
          </div>
          <div className={lawStyles.docLine__wrapText}>
            <span className={lawStyles.docLine__name}>
              Инструкция по проектированию городских электрических сетей. РД
              34.20.185-94 (утв. Минтопэнерго России 07.07.1994, РАО "ЕЭС
              России" 31.05.1994) (с изм. от 29.06.1999)
            </span>
          </div>
        </a>
        <a
          className={lawStyles.docLine}
          href={require("./LegalActs/2.pdf")}
          download
        >
          <div className={lawStyles.docLine__wrapIcon}>
            <img src={pdf} alt="PDF" />
          </div>
          <div className={lawStyles.docLine__wrapText}>
            <span className={lawStyles.docLine__name}>
              СП 256.1325800.2016. Свод правил. Электроустановки жилых и
              общественных зданий. Правила проектирования и монтажа (утв.
              Приказом Минстроя России от 29.08.2016 N 602/пр) (ред. от
              28.12.2023)
            </span>
          </div>
        </a>
        <a
          className={lawStyles.docLine}
          href={require("./LegalActs/3.pdf")}
          download
        >
          <div className={lawStyles.docLine__wrapIcon}>
            <img src={pdf} alt="PDF" />
          </div>
          <div className={lawStyles.docLine__wrapText}>
            <span className={lawStyles.docLine__name}>
              СП 31-110-2003. Свод правил по проектированию и строительству.
              Проектирование и монтаж электроустановок жилых и общественных
              зданий (одобрен и рекомендован к применению Постановлением
              Госстроя РФ от 26.10.2003 N 194)
            </span>
          </div>
        </a>
      </div>
    </div>

  );
}
