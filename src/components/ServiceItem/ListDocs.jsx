import { InfoCircleOutlined, LoadingOutlined } from "@ant-design/icons";
import { List, Avatar, Space, Popover, theme, Typography, Spin } from "antd";
import React, { useState } from "react";
import pdf from "../../img/docs/pdf.svg";
import doc from "../../img/docs/doc.svg";
import docx from "../../img/docs/docx.svg";
import rar from "../../img/docs/rar.svg";
import xls from "../../img/docs/xls.svg";
import rtf from "../../img/docs/rtf.svg";
import getPublicFile from "../../lib/getPublicFile";
import viewSizeFile from "../../lib/viewSizeFile";
const type = {
  pdf,
  doc,
  docx,
  rar,
  xls,
  rtf,
};

// import StrapiRichText from "../StrapiRichText";

export default function ListDocs({ docs }) {
  const [loading, setLoading] = useState(false)


  const handlerOpenDoc = async (fileId) => {
    setLoading(true)
    try {
      const fileURL = await getPublicFile(fileId)
      setLoading(false)
      if (fileURL) {
        const newWindow = window.open("", "_blank");
        newWindow.location.href = fileURL;
      }

    } catch (error) {
      console.log("error OpenDoc", error);

      setLoading(false)
    }
  }
  // console.log("docs", docs);
  return (
    <Spin spinning={loading} indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />}>
      <List
        dataSource={docs}
        renderItem={item => (

          <List.Item>
            <List.Item.Meta
              avatar={<img
                src={type[item.ext]}
                alt={`icon ${item.ext}`}
              />}
              title={<Typography.Text onClick={() => { handlerOpenDoc(item.id) }} style={{cursor:"pointer"}}>{item.name}</Typography.Text>}
              description={`${viewSizeFile(item.size)}`}
            />
          </List.Item>
        )}
      />
    </Spin>
  )
}
// export default function ListDocs({ list }) {
//   const { customfontSizeIcon, colorBorder } = theme.useToken().token;
//   return (
//     <List
//       itemLayout="horizontal"
//       dataSource={list}
//       renderItem={(item, index) => (
//         <List.Item key={index}>
//           <List.Item.Meta
//             avatar={
//               <Avatar
//                 src={`https://cdn-icons-png.flaticon.com/512/281/281760.png`}
//                 shape="square"
//               />
//             }
//             title={
//               <>
//                 {item.displayName}{" "}
//                 {item.common.description ? (
//                   <Popover
//                     content={
//                       <StrapiRichText content={item.common.description} />
//                     }
//                   >
//                     <InfoCircleOutlined
//                       style={{
//                         color: colorBorder,
//                         fontSize: customfontSizeIcon,
//                         cursor: "pointer",
//                       }}
//                     />
//                   </Popover>
//                 ) : (
//                   false
//                 )}
//               </>
//             }
//             description={<Space>{item.common.shortDescription}</Space>}
//           />
//         </List.Item>
//       )}
//     />
//   );
// }
