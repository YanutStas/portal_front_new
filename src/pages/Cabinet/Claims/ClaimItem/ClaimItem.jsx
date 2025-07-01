import React, { useEffect, useState, useCallback } from "react";
import { Typography, Button, Steps, Tabs, Modal, Result, Flex, Badge, theme, } from "antd";
import { useParams, useSearchParams } from "react-router-dom";
// import pdfMake from "pdfmake/build/pdfmake";
import useClaims from "../../../../stores/Cabinet/useClaims";
// import ChatComponent from "../ChatComponent/ChatComponent";
import styles from "./ClaimItem.module.css";
import { FileTextOutlined, } from "@ant-design/icons";
// import zayavka from "../../../../assets/zayavka.pdf";
import Story from "./Story";
import Docs from "./Docs";
import Billing from "./Billing";
import Appeals from "./Appeals";
import moment from "moment";
import FieldsClaim from "./FieldsClaim";
import openDocs from "../../../../components/Cabinet/openDocument";
import ServiceItem from "../../../ServiceItem/ServiceItem";
import StepsClaim from "./StepsClaim";
import Preloader from "../../../../components/Main/Preloader";

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
  const loadingClaim = useClaims((state) => state.loadingClaim);
  const fetchClaimItem = useClaims((state) => state.fetchClaimItem);
  const { id } = useParams();

  const token = theme.useToken().token
  // console.log("searchParams", searchParams);
  // console.log("claim", claim);

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

  const tabs = [
    {
      key: 1,
      label: `Этапы`,
      children: <StepsClaim steps={claim?.steps} />,
    },
    {
      key: 4,
      label: <Typography.Text><Badge count={1} offset={[5, 0]} size="small"><span>Задачи</span></Badge></Typography.Text>,
      children: <Billing zakaz={claim?.id} />,
    },
    // {
    //   key: 2,
    //   label: `Статусы`,
    //   children: <Story statuses={claim?.statuses} />,
    // },
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

  // console.log("claim", claim);

  return (
    <>
      {loadingClaim &&
        <Preloader />
      }
      {!loadingClaim && !claim && (<Flex justify="center"><Typography.Title level={5}>Заявка не найдена</Typography.Title></Flex>)}

      {!loadingClaim && claim && (
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
                Предоставленная информация
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
          // tabBarGutter={5}
          // centered
          />
          <Modal
            open={openModalFields}
            footer={false}
            onCancel={() => { setOpenModalFields(false) }}
            // width={1600}
            width={{ xxl: 1600, xl: 1200, lg: 992, md: 768, sm: 576, xs: 350 }}
            title={`Предоставленная информация по заявке №${claim.number}`}
            styles={{
              content: {
                backgroundColor: token.colorBgLayout,
              },
              header: {
                backgroundColor: token.colorBgLayout,
              },
              body: {
                marginTop: 20,
                backgroundColor: token.colorBgLayout,
                padding: 10,
              }
            }}
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
