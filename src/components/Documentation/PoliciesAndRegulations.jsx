import React from "react";
import pdf from "../../img/docs/pdf.svg";
import styles from "./Law.module.css";
import politica_file from "../../files/politica.pdf";
import FileIcon from "../FileIcon";
import { Flex } from "antd";


export default function PoliciesAndRegulations() {
  return (
    <Flex >
      <FileIcon name="Политика обработки персональных данных АО «Мособлэнерго» от 22.05.2026 №1-173/26" sizeKb={4400} url={"https://mosoblenergo.ru/back/uploads/Politika_obrabotki_personalnyh_dannyh_e5625323fd.pdf"} ext={".pdf"} />
    </Flex>
  );
}
