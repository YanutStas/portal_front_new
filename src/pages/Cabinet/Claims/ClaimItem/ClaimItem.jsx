import React, { useEffect, useState, useCallback } from "react";
import { Typography, Button, Steps, message, Tabs, Modal, Result, Flex, Popover, Badge } from "antd";
import { useParams, useSearchParams } from "react-router-dom";
import pdfMake from "pdfmake/build/pdfmake";
import useClaims from "../../../../stores/Cabinet/useClaims";
import ChatComponent from "../ChatComponent/ChatComponent";
import styles from "./ClaimItem.module.css";
import { FileTextOutlined } from "@ant-design/icons";
import zayavka from "../../../../assets/zayavka.pdf";
import Story from "./Story";
import Docs from "./Docs";
import Billing from "./Billing";
import Appeals from "./Appeals";
import moment from "moment";
import FieldsClaim from "./FieldsClaim";
import openDocs from "../../../../components/Cabinet/openDocument";
import ServiceItem from "../../../ServiceItem/ServiceItem";
import StepsClaim from "./StepsClaim";

const { Title } = Typography;
const { Step } = Steps;




export default function ClaimItem() {
  const [openModalFields, setOpenModalFields] = useState(false);
  const [openDescService, setOpenDescService] = useState(false);
  const [pdf, setPdf] = useState(false);
  const [openFailPay, setOpenFailPay] = useState(false);
  const [openSuccessPay, setOpenSuccessPay] = useState(false);
  const [searchParams] = useSearchParams()

  const claim = useClaims((state) => state.claim);
  const fetchClaimItem = useClaims((state) => state.fetchClaimItem);
  const { id } = useParams();
  // console.log("searchParams", searchParams);

  useEffect(() => {
    fetchClaimItem(id);
  }, [fetchClaimItem, id]);
  useEffect(() => {
    if (claim) {
      setPdf(claim.files.find(item => item.isPrintForm))
    }
  }, [claim]);

  useEffect(() => {
    if (searchParams.get('pay') === "success") setOpenSuccessPay(true)
    if (searchParams.get('pay') === "fail") setOpenFailPay(true)
  }, [searchParams]);

  // Моковые статусы заявки
  const steps = [
    {
      label: <Typography.Text>20.06.2025 <span style={{ color: "gray" }}>08:12</span></Typography.Text>,
      children: 'Заявка на проверке',
    },
    {
      label: <Typography.Text>20.06.2025 <span style={{ color: "gray" }}>09:12</span></Typography.Text>,
      children: 'Заявка принята',
    },
    {
      label: <Typography.Text>20.06.2025 <span style={{ color: "gray" }}>10:23</span></Typography.Text>,
      children: 'Подпишите и/или оплатите договор ТП',
      color: "red"
    },
    {
      label: <Typography.Text>21.06.2025 <span style={{ color: "gray" }}>10:25</span></Typography.Text>,
      children: 'Ожидание оплаты',
      color: "green"
    },
    {
      // label: <Typography.Text>22.06.2025 <span style={{ color: "gray" }}>15:12</span></Typography.Text>,
      children: 'Договор заключен',
      color: "gray"
    },
    {
      // label: <Typography.Text>23.06.2025 <span style={{ color: "gray" }}>19:12</span></Typography.Text>,
      children: 'Акт о ТП',
      color: "gray"
    },
  ];

  const tabs = [
    {
      key: 1,
      label: `Этапы`,
      children: <StepsClaim steps={steps} />,
    },
    {
      key: 4,
      label: <Typography.Text><Badge count={1} offset={[5,0]} size="small"><span>Задачи</span></Badge></Typography.Text>,
      children: <Billing zakaz={claim?.Ref_Key} />,
    },
    {
      key: 2,
      label: `Статусы`,
      children: <Story statuses={claim?.statuses} />,
    },
    {
      key: 3,
      label: `Файлы`,
      children: <Docs files={claim?.files} />,
    },
    {
      key: 5,
      label: `Обращения`,
      children: <Appeals />,
    },
  ]
  // Текущий статус заявки (для примера выбираем 2-й статус)
  const currentStatusIndex = 3; // Индекс текущего статуса в массиве статусов

  // const handlerViewFields = () => {

  // }
  // Функция для генерации и открытия PDF с заглушкой
  // const handlerViewPDF = useCallback(() => {
  //   setPdfLoading(true);
  //   try {
  //     const documentDefinition = {
  //       content: [
  //         { text: `Заявка №${claim.Number}`, style: "header" },
  //         {
  //           text: "Здесь будет отображаться информация о заявке.",
  //           margin: [0, 20, 0, 0],
  //         },
  //         {
  //           text: "Содержимое заявки:",
  //           style: "subheader",
  //           margin: [0, 20, 0, 10],
  //         },
  //         // Добавьте необходимое содержимое
  //         { text: "Это заглушка для демонстрации PDF-файла." },
  //       ],
  //       styles: {
  //         header: {
  //           fontSize: 18,
  //           bold: true,
  //         },
  //         subheader: {
  //           fontSize: 14,
  //           bold: true,
  //         },
  //       },
  //     };

  //     pdfMake.createPdf(documentDefinition).open();
  //   } catch (error) {
  //     console.error("Ошибка при генерации PDF:", error);
  //     message.error("Не удалось сгенерировать заявку.");
  //   } finally {
  //     setPdfLoading(false);
  //   }
  // }, [claim]);
  console.log("claim", claim);

  return (
    <>
      {!claim ? (
        <div>
          <Title level={1}>Заявка</Title>
        </div>
      ) : (
        <>
          <Flex justify="space-between" align="center" style={{ marginBottom: 20 }} wrap="wrap" gap={20}>
            <Flex vertical >
              <Title level={1} className={styles.title} style={{ marginBottom: 0 }}>
                Заявка №{claim.number}
              </Title>
              <Typography.Text style={{ color: "gray" }}>от {moment(claim.date).format("DD.MM.YYYY")}</Typography.Text>
              <Typography.Text style={{ color: "gray" }}>По услуге: {claim.template.label}</Typography.Text>
              <Typography.Text style={{ color: "gray", marginTop: 5 }}><Button onClick={() => { setOpenDescService(true) }}>Описание услуги</Button></Typography.Text>
            </Flex>
            <Flex gap={20} wrap={"wrap"}>
              <Button
                type="primary"
                onClick={() => { setOpenModalFields(true) }}
              >
                Подаваемые данные по заявке
              </Button>

              {pdf &&
                <Button
                  type="primary"
                  icon={<FileTextOutlined />}
                  onClick={() => { openDocs(pdf?.id) }}
                >
                  Печатная форма заявки
                </Button>
              }

            </Flex>
          </Flex>

          {/* Статусы заявки */}
          {/* <Steps
            current={currentStatusIndex}
            className={styles.steps}
            progressDot
          >
            {statuses.map((status, index) => (
              <Step key={index} title={status} />
            ))}
          </Steps> */}
          <Tabs
            type="card"
            items={tabs}
            tabBarGutter={5}
          // centered
          />
          <Modal
            open={openModalFields}
            footer={false}
            onCancel={() => { setOpenModalFields(false) }}
            // width={1600}
            width={{ xxl: 1600, xl: 1200, lg: 992, md: 768, sm: 576, xs: 350 }}
            title={`Поля заявки №${claim.number}`}
          >
            <FieldsClaim template={claim?.template} values={claim?.values} />
          </Modal>

          <Modal
            open={openSuccessPay}
            footer={false}
          >
            <Result
              status="success"
              title="Успешная оплата"
              subTitle="Спасибо за успешную оплату."
              extra={[
                <Button type="primary" onClick={() => { setOpenSuccessPay(false) }}>
                  ОК
                </Button>,
              ]}
            />
          </Modal>

          <Modal
            open={openFailPay}
            footer={false}
          >
            <Result
              status="error"
              title="Ошибка оплаты"
              subTitle="При оплате чтото пошло не так."
              extra={[
                <Button type="primary" onClick={() => { setOpenFailPay(false) }}>
                  ОК
                </Button>,
              ]}
            />
          </Modal>

          <Modal
            // style={{ width: "max(1600px, 100%)" }}
            open={openDescService}
            footer={false}
            onCancel={() => { setOpenDescService(false) }}
            width={"min(1600px, 100%)"}
          >
            <ServiceItem currentKey={claim.template?.id} />
          </Modal>


          {/* Чат с уведомлениями и возможностью отправить обращение */}
          {/* <ChatComponent
            claimId={id}
            statuses={statuses}
            currentStatusIndex={currentStatusIndex}
          /> */}
        </>
      )}
    </>
  );
}
