import React, { useState, useEffect } from "react";
import AppHelmet from "../../components/Global/AppHelmet";
import { Typography, Button, Form, Flex } from "antd";
import TweenOne from "rc-tween-one";
import Children from "rc-tween-one/lib/plugin/ChildrenPlugin";
import calcData from "./calcData.json";
import { prepareDataSource } from "./helpers";
import useCalc from "../../stores/useCalc";
import styles from "./Calc.module.css";
import { formItemLayoutForCalc } from "../../components/configSizeForm";
import CalcTable from "./CalcTable";
import Container from "../../components/Container";
import DocumentationCalc from "./DocumentationCalc";
import MobileCalcView from "./MobileCalcView";

TweenOne.plugins.push(Children);

const { Title, Paragraph } = Typography;

const formItemLayout = formItemLayoutForCalc;

export default function Calc() {
  const [form] = Form.useForm();
  const [isCalculateButtonDisabled, setIsCalculateButtonDisabled] =
    useState(false);
  const [isPdfButtonDisabled, setIsPdfButtonDisabled] = useState(true);
  const {
    totalPower,
    animation,
    calculatedData,
    handleFinish,
    showAdditionalInfo,
    generatePDF,
  } = useCalc();

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 769);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    form.setFieldsValue(calculatedData);
  }, [calculatedData, form]);

  const onValuesChange = () => {
    setIsCalculateButtonDisabled(false);
  };

  const dataSource = prepareDataSource();

  const handleFinishWithLock = (values) => {
    setIsCalculateButtonDisabled(true);
    setIsPdfButtonDisabled(false);
    handleFinish(values);
  };

  return (
    <>
      <Container>
        <AppHelmet title={"Калькулятор"} desc={"Калькулятор мощности"} />
        {isMobile ? (
          // Мобильная версия
          <MobileCalcView />
        ) : (
          // Десктопная версия
          <div className={styles.container}>
            <span>
              <Title level={2}>
                Калькулятор оценочного расчета электрической мощности
              </Title>
            </span>
            <Paragraph style={{ textAlign: "justify", marginBottom: "20px" }}>
              Калькулятор мощности позволяет оценить совокупную мощность
              электрооборудования индивидуального домохозяйства (объекта с
              бытовым характером нагрузки), необходимую для технологического
              присоединения к электросети АО "Мособлэнерго".
            </Paragraph>
            <Paragraph>
              <b>
                Для заявителей - физических лиц. Только для некоммерческого
                применения.
              </b>
            </Paragraph>
            <Paragraph style={{ textAlign: "justify", marginBottom: "20px" }}>
              {calcData.texts.mainParagraphText}
            </Paragraph>
            <Form
              form={form}
              onFinish={handleFinishWithLock}
              onValuesChange={onValuesChange}
              {...formItemLayout}
              labelWrap
              style={{ maxWidth: "none" }}
            >
              <CalcTable
                dataSource={dataSource}
                calculatedData={calculatedData}
                onValuesChange={onValuesChange}
              />
              <Form.Item className={styles.buttonContainer}>
                <Flex gap={10}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    disabled={isCalculateButtonDisabled}
                  >
                    Рассчитать
                  </Button>
                  <Button
                    type="default"
                    onClick={() => generatePDF(dataSource, totalPower)}
                    disabled={!showAdditionalInfo}
                  >
                    Выгрузить PDF
                  </Button>
                </Flex>
              </Form.Item>
            </Form>
            <div className={styles.totalPowerContainer}>
              <Title level={4}>
                Итого требуемая электрическая мощность (оценочно) в кВт:{" "}
                <TweenOne
                  animation={animation}
                  style={{ fontSize: 24, display: "inline-block" }}
                >
                  <span>{totalPower !== "0" ? totalPower : "0"}</span>
                </TweenOne>
                <sup>*</sup>
              </Title>
              <Paragraph style={{ textAlign: "justify", marginTop: "20px" }}>
                {calcData.texts.additionalInfoText}
              </Paragraph>
              <Paragraph style={{ textAlign: "justify", marginTop: "10px" }}>
                <sup>*</sup> Для точного расчета необходимой мощности,
                рекомендуем обратиться в специализированные проектные
                организации.
              </Paragraph>
            </div>
          </div>
        )}

        <div
          className={styles.mobileMessage}
          style={{ display: isMobile ? "none" : "block" }}
        >
          Воспользоваться калькулятором расчета мощности можно только на
          десктопной версии сайта.
        </div>

        <DocumentationCalc />
      </Container>
    </>
  );
}
