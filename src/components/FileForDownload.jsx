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
import { Button, Descriptions, Flex, message, Modal, Typography } from "antd";
import checkSig from "./Cabinet/checkSig";
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
  const [chekingValue, setChekingValue] = useState(false)
  const [isChecking, setIsChecking] = useState(false)
  // console.log(url);
  const [messageApi, contextHolder] = message.useMessage();

  return (
    <>
      <Flex vertical>
        {contextHolder}
        <Flex style={{ marginBottom: 10 }} gap={5} vertical>

          <a
            // className={styles.docLine}
            // href={`${backServer}/uploads/${url}`}
            // download=""
            // rel="noopener noreferrer"
            // target="_blank"
            onClick={async () => {
              if (!await openDocs(id, sig)) {
                messageApi.open({
                  type: 'error',
                  content: 'Ошибка скачивания файла',
                });
              }
            }}
          >
            <Flex align="center" gap={5}>

              <Flex justify="center" align="center">
                <img src={typeFile[type] ? typeFile[type] : typeFile.noext} alt={`icon ${type}`} style={{ maxWidth: 50 }} />
              </Flex>
              <Flex vertical>
                <span className={styles.docLine__name}>{name}</span>
                <span className={styles.docLine__fileInfo}>
                  {Number(size / 1000) > 1000
                    ? `${(Number(size / 1000) / 1000).toFixed(2)}МБ`
                    : `${Math.round(Number(size / 1000))}КБ`}
                </span>
                {date &&
                  <span className={styles.docLine__fileInfo} style={{ marginLeft: 10 }}>{moment(date).format('DD.MM.YYYY HH.mm')}</span>
                }
              </Flex>
            </Flex>
          </a>
          {sig && <Button disabled={isChecking} style={{ fontSize: 14 }} size="small" onClick={async () => {
            setIsChecking(true)
            const checked = await checkSig(idDocForCheckSig, id)
            
            setIsChecking(false)
            if (checked && checked.status==="OK") {
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
          }}>Проверить подпись</Button>}

        </Flex>
        {signs && <div style={{ marginLeft: 40, position: "relative" }}>
          {signs.map((item, index) => <FileForDownload sig={true} key={index} type={item.ext} name={item.name} id={item.id} size={item.size} idDocForCheckSig={id} />)}
          {/* <div style={{ position: "absolute", height: "100%", width: 3, borderRadius: 3, backgroundColor:  "lightgray", top: 0, left: -6 }}></div> */}
        </div>}
      </Flex>
      <Modal
        open={chekingValue}
        onCancel={()=>{
          setChekingValue(false)
        }}
      >
        {chekingValue && chekingValue.signatures?.length>0 &&
          <Descriptions column={1} style={{ marginTop: 20 }} items={[
            {
              key: '1',
              label: 'Действительность',
              children: <span style={{ color: chekingValue.isValid ? "green" : "red" }}>{chekingValue.resultText}</span>,
            },
            {
              key: '2',
              label: 'Дата отчета',
              children: <span>{chekingValue.reportDate}</span>,
            },
            {
              key: '3',
              label: 'Издатель сертификата',
              children: <span >{chekingValue.signatures[0].cert.issuer}</span>,
            },
            {
              key: '4',
              label: 'Владелец сертификата',
              children: <span>{chekingValue.signatures[0].cert.subject}</span>,
            },
            {
              key: '5',
              label: 'Серийный номер',
              children: <span>{chekingValue.signatures[0].cert.serial}</span>,
            },
            {
              key: '56',
              label: 'Действует',
              children: <span>с {moment(chekingValue.signatures[0].cert.notBefore).format('DD.MM.YYYY')} по {moment(chekingValue.signatures[0].cert.notAfter).format('DD.MM.YYYY')}</span>,
            },
            {
              key: '7',
              label: 'Срок действия ключа подписи',
              children: <span>с {moment(chekingValue.signatures[0].cert.pkeyNotBefore).format('DD.MM.YYYY')} по {moment(chekingValue.signatures[0].cert.pkeyNotAfter).format('DD.MM.YYYY')}</span>,
            },
          ]} />
        }
        {chekingValue.resultCode === 1 &&
          <Typography.Title style={{ color: "red" }} level={5}>Входные данные не являются подписанным сообщением!</Typography.Title>
        }
      </Modal>
    </>
  );
}
