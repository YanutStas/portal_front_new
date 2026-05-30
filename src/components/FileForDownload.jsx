import React, { useEffect, useState } from "react";
import pdf from "../img/docs/pdf.svg";
import doc from "../img/docs/doc.svg";
import docx from "../img/docs/docx.svg";
import rar from "../img/docs/rar.svg";
import xls from "../img/docs/xls.svg";
import rtf from "../img/docs/rtf.svg";
import svg from "../img/docs/svg.svg";
import png from "../img/docs/png.svg";
import sig from "../img/docs/signature.png";
// import sig from "../img/docs/sig.svg";
import noext from "../img/docs/noext.svg";
import styles from "./FileForDownload.module.css";
import openDocs from "./Cabinet/openDocument";
import moment from "moment";
import { Button, Descriptions, Flex, message, Modal, Spin, Typography, theme, Tooltip } from "antd";
import checkSig from "./Cabinet/checkSig";
import { CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined, DownloadOutlined, SafetyOutlined } from '@ant-design/icons'
import PdfDownloader from "./PdfDownloader";
import Preloader from "./Main/Preloader";
const typeFile = {
  pdf,
  doc,
  docx,
  rar,
  xls,
  rtf,
  svg,
  png,
  sig,
  noext
};
// const backServer = import.meta.env.VITE_BACK_BACK_SERVER;
export default function FileForDownload({ type, id, name, size, date = false, signs = false, sig = false, idDocForCheckSig = false, dateAdd = false, img = false }) {
  const token = theme.useToken().token
  const [openModal, setOpenModal] = useState(false)
  const [chekingValue, setChekingValue] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [isChecking, setIsChecking] = useState(false)
  // console.log(token);
  // console.log(chekingValue);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    // console.log("chekingValue", chekingValue)
  }, [chekingValue])

  let jsonReport = false
  if (chekingValue && (chekingValue.resultCode === 0 || chekingValue.resultCode === 3 || chekingValue.resultCode === 13)) {
    try {
      jsonReport = JSON.parse(chekingValue.jsonReport)
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <>
      <Flex vertical gap={10} wrap={"wrap"}>
        {contextHolder}
        <Flex gap={5} align="center" wrap={"wrap"}>
          <Flex gap={10} align="center">
            <a
              onClick={async () => {
                if (!downloading) {
                  setDownloading(true)
                  try {
                    if (!await openDocs(id, name, false, sig)) {
                      messageApi.open({
                        type: 'error',
                        content: 'Ошибка скачивания файла',
                      });
                    }
                  } catch (error) {
                    console.log(error);
                  }
                  setDownloading(false)
                }
              }}
            >
              <Flex align="center" gap={5}>
                <Flex justify="center" align="center" >
                  {img ? img :
                    <img src={typeFile[type] ? typeFile[type] : typeFile.noext} alt={`icon ${type}`} style={{ maxWidth: 30 }} />
                  }
                </Flex>
                <Flex vertical>
                  <Typography.Text>{name}</Typography.Text>
                  <Flex gap={5}>

                    {date &&
                      <Typography.Text type="secondary">{moment(date).format('DD.MM.YYYY HH:mm')}</Typography.Text>
                    }
                    <Typography.Text type="secondary">
                      {Number(size / 1000) > 1000
                        ? `${(Number(size / 1000) / 1000).toFixed(2)}МБ`
                        : `${Math.round(Number(size / 1000))}КБ`}
                    </Typography.Text>
                    {/* <Typography.Text type="secondary">{dateAdd && moment(dateAdd).format('DD.MM.YYYY HH:mm')}</Typography.Text> */}
                  </Flex>
                </Flex>
                {downloading && <Spin />}
              </Flex>
            </a>
            {!downloading && <Tooltip styles={{ body: { fontSize: 12 } }} placement="top" title={"Скачать"} color="#0061aa"> <Button
              icon={<DownloadOutlined style={{ fontSize: 24 }} />}
              size="medium"

              onClick={async () => {
                if (!downloading) {
                  setDownloading(true)
                  try {
                    if (!await openDocs(id, name, true, sig)) {
                      messageApi.open({
                        type: 'error',
                        content: 'Ошибка скачивания файла',
                      });
                    }
                  } catch (error) {
                    console.log(error);

                  }
                  setDownloading(false)
                }
              }}
              className={styles.iconButton}
            // style={{ color: token.colorTextDescription }}
            />
            </Tooltip>}
          </Flex>
          {/* {sig && <SafetyOutlined className={styles.iconButton} style={{ fontSize: 24 }} size="small"
              onClick={async () => {
                if (!isChecking) {
                  setIsChecking(true)
                  const checked = await checkSig(idDocForCheckSig, id)

                  setIsChecking(false)
                  if (checked && checked.status === "OK") {
                    // console.log("checked",JSON.parse(checked.data));
                    setChekingValue(JSON.parse(checked.data))
                  } else {
                    messageApi.open({
                      type: 'error',
                      content: 'Ошибка проверки подписи',
                    });
                  }
                }
                // console.log("id", id);
                // console.log("idDocForCheckSig", idDocForCheckSig);
              }}
            />} */}
          {sig &&
            // <Tooltip styles={{ body: { fontSize: 12 } }} placement="top" title={"Проверить"} color="#0061aa">
              <Button
                disabled={isChecking}
                style={{ fontSize: 14 }}
                // icon={<SafetyOutlined style={{ fontSize: 24 }} />}
                size="middle"
                onClick={async () => {
                  setIsChecking(true)
                  setOpenModal(true)
                  const checked = await checkSig(idDocForCheckSig, id)
                  setIsChecking(false)
                  if (checked && checked.status === "OK") {
                    // console.log("checked",JSON.parse(checked.data));
                    setChekingValue(checked.data)
                  } else {
                    messageApi.open({
                      type: 'error',
                      content: 'Ошибка проверки подписи',
                    });
                  }
                  // console.log("id", id);
                  // console.log("idDocForCheckSig", idDocForCheckSig);
                }}
              >О подписи</Button>
            // </Tooltip> 
          }
        </Flex>
        {signs && <div style={{ marginLeft: 40, }}>
          {signs.map((item, index) => <FileForDownload sig={true} key={index} type={item.ext} name={item.name} id={item.id} size={item.size} idDocForCheckSig={id} />)}
          {/* <div style={{ position: "absolute", height: "100%", width: 3, borderRadius: 3, backgroundColor:  "lightgray", top: 0, left: -6 }}></div> */}
        </div>}
      </Flex>
      {sig &&
        <Modal
          open={openModal}
          onCancel={() => {
            setOpenModal(false)
          }}
          width={800}
          footer
          title={name}
        >
          {!chekingValue &&
            <>
              <Preloader />
              <Typography.Title level={3} style={{ marginBottom: 20, textAlign: "center" }}>Проверка подписи...</Typography.Title>
            </>
          }
          {chekingValue &&
            <>
              {/* <Typography.Title style={{ color: "green" }} level={5}>{chekingValue.description}</Typography.Title> */}
              {chekingValue.values?.map((item, index) =>
                <div key={index} >
                  <Typography.Title level={2}>{item.title}</Typography.Title>
                  <Descriptions size="small" column={1} style={{ marginTop: 20 }} items={item.items.map(elem => {
                    if (elem.type === "boolean") {
                      // console.log(elem.value);

                      elem.children = elem.value ? <CheckCircleOutlined style={{ color: "green", fontSize: 32 }} /> : <CloseCircleOutlined style={{ color: "red  ", fontSize: 32 }} />
                    } else if (elem.type === "date") {
                      elem.children = <Typography.Text>{moment(elem.value).format('DD.MM.YYYY HH:mm')}</Typography.Text>
                    } else {
                      elem.children = elem.value
                    }
                    if (elem.icon) {
                      elem.children = <Typography.Text style={{ color: elem.icon.color || undefined }}>{elem.value}</Typography.Text>
                    }
                    return elem
                  })}
                  />
                </div>
              )}
              <PdfDownloader base64String={chekingValue.base64} />
            </>
          }
          {chekingValue.resultCode === 1 &&
            <Typography.Title style={{ color: "red" }} level={5}>Входные данные не являются подписанным сообщением!</Typography.Title>
          }
        </Modal>
      }
    </>
  );
}
