import React, { useState, useEffect } from "react";
import {
  Typography,
  Button,
  Form,
  InputNumber,
  Slider,
  Card,
  Flex,
  Divider,
  Tooltip,
  theme,
  ConfigProvider,
} from "antd";
import calcData from "./calcData.json";
import useCalc from "../../stores/useCalc";
import { prepareDataSource } from "./helpers";
import styles from "./MobileCalcView.module.css";
import { InfoCircleOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;

export default function MobileCalcView() {
  const token = theme.useToken().token;
  const [form] = Form.useForm();
  const {
    totalPower,
    handleFinish,
    showAdditionalInfo,
    generatePDF,
    calculatedData,
  } = useCalc();

  const [isCalculateButtonDisabled, setIsCalculateButtonDisabled] =
    useState(false);

  const dataSource = prepareDataSource();

  useEffect(() => {
    const initialValues = {};
    dataSource.forEach((item) => {
      if (!item.isSection) {
        initialValues[item.key] = {
          value: item.value,
          count: 1,
          unit: item.unit,
          usageCoefficient: item.usageCoefficient,
        };
      }
    });
    form.setFieldsValue(initialValues);
  }, []);

  const onValuesChange = () => {
    setIsCalculateButtonDisabled(false);
  };

  const onFinish = (values) => {
    setIsCalculateButtonDisabled(true);
    handleFinish(values);
  };

  return (
    <div>
      <Title level={2} style={{ marginBottom: 16 }}>
        Калькулятор мощности
      </Title>

      <Paragraph>{calcData.texts.mainParagraphText}</Paragraph>
      <Paragraph>
        <b>
          Для заявителей - физических лиц. Только для некоммерческого
          применения.
        </b>
      </Paragraph>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        onValuesChange={onValuesChange}
      >
        <Flex gap={10} justify="center">
          <Form.Item style={{ marginBottom: 0 }}>
            <Button
              type="primary"
              htmlType="submit"
              disabled={isCalculateButtonDisabled}
            >
              Рассчитать
            </Button>
          </Form.Item>
          <Button
            type="default"
            onClick={() => generatePDF(dataSource, totalPower)}
          >
            Выгрузить PDF
          </Button>
        </Flex>
        {dataSource.map((item) => {
          if (item.isSection) {
            return (
              <Divider key={item.key} style={{ fontSize: 14 }}>
                {item.section}
              </Divider>
            );
          }

          const consumedPower =
            calculatedData[item.key]?.consumedPower || "0.00";

          return (
            <div key={item.key}>
              <Card
                title={item.name}
                extra={<span>{consumedPower} кВт</span>}
                style={{ marginBottom: 20 }}
                styles={{ body: { padding: 10 } }}
              >
                <ConfigProvider
                  theme={{
                    components: {
                      InputNumber: {
                        inputFontSize: 14,
                      },
                    },
                  }}
                >
                  <Flex gap={10} wrap justify="space-around">
                    <Form.Item
                      name={[item.key, "value"]}
                      className={styles.formItem}
                      style={{ marginBottom: 20 }}
                    >
                      <InputNumber
                        min={0}
                        step={0.01}
                        addonAfter={"кВт"}
                        addonBefore={
                          <Tooltip title="Мощность" color={token.colorPrimary}>
                            <InfoCircleOutlined />
                          </Tooltip>
                        }
                        formatter={(value) => {
                          if (!value) return "";
                          const num = parseFloat(value);
                          return Number.isNaN(num) ? "" : num.toString();
                        }}
                        parser={(value) => value.replace(/[^\d.]/g, "")}
                      />
                    </Form.Item>

                    <Form.Item
                      name={[item.key, "count"]}
                      className={styles.formItem}
                      style={{ marginBottom: 20 }}
                    >
                      <InputNumber
                        min={0}
                        step={1}
                        addonAfter={item.unitShort}
                        addonBefore={
                          <Tooltip
                            title="Количество"
                            color={token.colorPrimary}
                          >
                            <InfoCircleOutlined />
                          </Tooltip>
                        }
                      />
                    </Form.Item>
                  </Flex>
                </ConfigProvider>

                <Form.Item
                  name={[item.key, "usageCoefficient"]}
                  label="Коэффициент использования"
                  style={{ marginBottom: 0 }}
                >
                  <Slider
                    min={0}
                    max={1}
                    step={0.1}
                    marks={{ 0: "0", 0.5: "0,5", 1: "1" }}
                    dots={true}
                  />
                </Form.Item>
              </Card>
            </div>
          );
        })}
        <Flex gap={10} justify="center">
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              disabled={isCalculateButtonDisabled}
            >
              Рассчитать
            </Button>
          </Form.Item>
          <Button
            type="default"
            onClick={() => generatePDF(dataSource, totalPower)}
          >
            Выгрузить PDF
          </Button>
        </Flex>
      </Form>

      <div style={{ textAlign: "center", marginTop: 20 }}>
        <Typography.Text>
          <b>
            Итого: {totalPower || "0 кВт"}
            <sup>*</sup>
          </b>
        </Typography.Text>
        {showAdditionalInfo && (
          <Paragraph style={{ textAlign: "justify", marginTop: "20px" }}>
            {calcData.texts.additionalInfoText}
          </Paragraph>
        )}
      </div>
    </div>
  );
}
