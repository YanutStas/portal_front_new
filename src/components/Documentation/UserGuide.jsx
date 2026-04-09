import React from "react";

import userGuidePdf from "../../assets/Руководство пользователя Портал потребителя АО «Мособлэнерго».pdf";
import { Flex,  } from "antd";
import FileIcon from "../FileIcon";

export default function UserGuide() {
  return (
    <Flex >
      <FileIcon name="Руководство пользователя Порталом потребителя услуг АО «Мособлэнерго»" sizeKb={2600} url={userGuidePdf} ext={".pdf"} />
    </Flex>
  );
}