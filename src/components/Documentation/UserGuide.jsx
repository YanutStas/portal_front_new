import React from "react";

import userGuidePdf from "../../assets/Руководство пользователя Портал потребителя АО «Мособлэнерго».pdf";
import { Flex,  } from "antd";
import FileIcon from "../FileIcon";

export default function UserGuide() {
  return (
    <Flex >
      {/* <FileIcon name="Руководство пользователя портала цифровых услуг АО «Мособлэнерго»" sizeKb={3100} url={"https://www.mosoblenergo.ru/back/uploads/Rukovodstvo_polzovatelya_Portala_Czifrovyh_uslug_2026_138df18462.pdf"} ext={".pdf"} /> */}
      <FileIcon name="Руководство пользователя портала цифровых услуг АО «Мособлэнерго»" sizeKb={3100} url={"https://www.mosoblenergo.ru/back/uploads/Rukovodstvo_polzovatelya_portala_czifrovyh_uslug_AO_Mosoblenergo_26e756e933.pdf"} ext={".pdf"} />
    </Flex>
  );
}