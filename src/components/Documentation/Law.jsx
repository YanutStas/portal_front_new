import React, { useEffect, useState } from "react";
// import pdf from "../../img/docs/pdf.svg";
// import doc from "../../img/docs/doc.svg";
// import docx from "../../img/docs/docx.svg";
// import rar from "../../img/docs/rar.svg";
// import xls from "../../img/docs/xls.svg";
// import rtf from "../../img/docs/rtf.svg";
import axios from "axios";
import styles from "./Law.module.css";
import { Flex } from "antd";
import FileIcon from "../FileIcon";
// import { Flex, Typography } from "antd";
// const type = {
//   pdf,
//   doc,
//   docx,
//   rar,
//   xls,
//   rtf,
// };
const siteMosoblServer = import.meta.env.VITE_BACK_SITE_MOSOBLENERGO_SERVER;

export default function Law() {
  const [docs, setDocs] = useState([]);
  useEffect(() => {
    axios
      .get(`${siteMosoblServer}/api/tp-normativno-pravovye-akty?populate=*`)
      .then((response) => {
        if (response.data) {
          // console.log(response.data);
          setDocs(response.data.data.docs);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  return (
    <Flex vertical gap={20}>

        {docs.length > 0 &&
          docs
          .sort((a, b) => Number(a.caption) - Number(b.caption))
          .map((item, index) => (
            <>  
               <FileIcon key={index} name={item.name} sizeKb={item.size} ext={item.ext} url={`${siteMosoblServer}${item.url}`} />
              </>
            ))}
      
    </Flex>
  );
}
