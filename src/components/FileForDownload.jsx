import React, { useState } from "react";
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
import { DownloadOutlined, SafetyOutlined } from '@ant-design/icons'
import PdfDownloader from "./PdfDownloader";
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
export default function FileForDownload({ type, id, name, size, date = false, signs = false, sig = false, idDocForCheckSig = false }) {
  const token = theme.useToken().token
  const [chekingValue, setChekingValue] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [isChecking, setIsChecking] = useState(false)
  // console.log(token);
  console.log(chekingValue);
  const [messageApi, contextHolder] = message.useMessage();
  let jsonReport = false
  if(chekingValue && (chekingValue.resultCode === 0 || chekingValue.resultCode === 3) ){
    jsonReport = JSON.parse(chekingValue.jsonReport)
    console.log(jsonReport);
}
  return (
    <>
      <Flex vertical gap={10} style={{ marginBottom: 20, marginTop: 20 }}>
        {contextHolder}
        <Flex gap={5} align="center" >
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
              <Flex align="center" gap={5} >

                <Flex justify="center" align="center" >
                  <img src={typeFile[type] ? typeFile[type] : typeFile.noext} alt={`icon ${type}`} style={{ maxWidth: 50 }} />
                </Flex>
                <Flex vertical>
                  <span className={styles.docLine__name} style={{ color: token.colorText }}>{name}</span>
                  <span className={styles.docLine__fileInfo} style={{ color: token.colorTextDescription }}>
                    {Number(size / 1000) > 1000
                      ? `${(Number(size / 1000) / 1000).toFixed(2)}МБ`
                      : `${Math.round(Number(size / 1000))}КБ`}
                  </span>
                  {date &&
                    <span className={styles.docLine__fileInfo} style={{ marginLeft: 10 }}>{moment(date).format('DD.MM.YYYY HH.mm')}</span>
                  }
                </Flex>
                {downloading && <Spin />}
              </Flex>
            </a>
            {!downloading && <Tooltip styles={{ body: { fontSize: 12 } }} placement="top" title={"Скачать"} color="#0061aa"> <Button
              icon={<DownloadOutlined style={{ fontSize: 24 }} />}
              size="large"

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
            /></Tooltip>}
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
          {sig && <Tooltip styles={{ body: { fontSize: 12 } }} placement="top" title={"Проверить"} color="#0061aa"><Button disabled={isChecking} style={{ fontSize: 14 }} icon={<SafetyOutlined style={{ fontSize: 24 }} />}
            size="large"
            onClick={async () => {
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
              // console.log("id", id);
              // console.log("idDocForCheckSig", idDocForCheckSig);
            }}
          /></Tooltip>}

        </Flex>
        {signs && <div style={{ marginLeft: 40, }}>
          {signs.map((item, index) => <FileForDownload sig={true} key={index} type={item.ext} name={item.name} id={item.id} size={item.size} idDocForCheckSig={id} />)}
          {/* <div style={{ position: "absolute", height: "100%", width: 3, borderRadius: 3, backgroundColor:  "lightgray", top: 0, left: -6 }}></div> */}
        </div>}
      </Flex>
      {sig &&
        <Modal
          open={chekingValue}
          onCancel={() => {
            setChekingValue(false)
          }}
          width={800}
          footer
        >
          {chekingValue && (chekingValue.resultCode === 0 || chekingValue.resultCode === 3)  &&
            <>
              {/* <Typography.Title style={{ color: "green" }} level={5}>{chekingValue.description}</Typography.Title> */}
              <Descriptions  column={1} style={{ marginTop: 20 }} items={[
                {
                  key: '1',
                  label: 'Действительность',
                  children: <span style={{ color: jsonReport.isValid ? "green" : "red" }}>{jsonReport.resultText}</span>,
                },
                {
                  key: '2',
                  label: 'Дата отчета',
                  children: <span>{jsonReport.reportDate}</span>,
                },
                {
                  key: '3',
                  label: 'Издатель сертификата',
                  children: <span >{jsonReport.signatures[0].cert.issuer}</span>,
                },
                {
                  key: '4',
                  label: 'Владелец сертификата',
                  children: <span>{jsonReport.signatures[0].cert.subject}</span>,
                },
                {
                  key: '5',
                  label: 'Серийный номер',
                  children: <span>{jsonReport.signatures[0].cert.serial}</span>,
                },
                {
                  key: '56',
                  label: 'Действует',
                  children: <span>с {moment(jsonReport.signatures[0].cert.notBefore).format('DD.MM.YYYY')} по {moment(jsonReport.signatures[0].cert.notAfter).format('DD.MM.YYYY')}</span>,
                },
                {
                  key: '7',
                  label: 'Срок действия ключа подписи',
                  children: <span>с {moment(jsonReport.signatures[0].cert.pkeyNotBefore).format('DD.MM.YYYY')} по {moment(jsonReport.signatures[0].cert.pkeyNotAfter).format('DD.MM.YYYY')}</span>,
                },
              ]} />
              <PdfDownloader base64String={chekingValue.pdfReport}/>
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
