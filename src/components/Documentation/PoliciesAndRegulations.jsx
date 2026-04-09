import React from "react";
import pdf from "../../img/docs/pdf.svg";
import styles from "./Law.module.css";
import politica_file from "../../files/politica.pdf";
import FileIcon from "../FileIcon";
import { Flex } from "antd";


export default function PoliciesAndRegulations() {
  return (
    <Flex >
      <FileIcon name="Политика обработки персональных данных АО «Мособлэнерго»" sizeKb={2600} url={politica_file} ext={".pdf"} />
    </Flex>
  );
}
