import React, { useEffect, useState } from "react";
import {
  Form,
  Typography,
  Button,
  Drawer,
  Flex,
  Breadcrumb,
  ConfigProvider,
  Row,
  Tag,
  Steps,
} from "antd";
import { useParams, Link } from "react-router-dom";
import moment from "moment";
import { motion } from "framer-motion";

import AppHelmet from "../../components/Global/AppHelmet";
import Preloader from "../../components/Main/Preloader";
import ErrorModal from "../../components/ErrorModal";

import useClaimsTest from "../../stores/Cabinet/useClaims";
import useServicesTest from "../../stores/useServices";

import selectComponent from "../../components/selectComponent";

const { Title, Paragraph } = Typography;
const { Step } = Steps;

function chunkArray(array, chunkSize = 5) {
  const results = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    results.push(array.slice(i, i + chunkSize));
  }
  return results;
}

export default function NewClaimTest() {
  const [open, setOpen] = useState(false);
  const chain = useServicesTest((state) => state.chain) || [];
  const serviceItem = useServicesTest((state) => state.serviceItem);
  const fetchServiceItem = useServicesTest((state) => state.fetchServiceItem);
  const isLoading = useServicesTest((state) => state.isLoading);

  const createClaim = useClaimsTest((state) => state.createClaim);
  const newClaim = useClaimsTest((state) => state.newClaim);
  const clearNewClaim = useClaimsTest((state) => state.clearNewClaim);

  const { id } = useParams();
  const [form] = Form.useForm();
  const [error, setError] = useState(null);

  // Текущий шаг
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (id) {
      fetchServiceItem(id, { withChain: true, withFields: true });
    }
  }, [id, fetchServiceItem]);


  useEffect(() => {
    if (newClaim) {
      setOpen(true);
    }
  }, [newClaim]);

  const onClose = () => {
    clearNewClaim();
    setOpen(false);
  };

  // Приводим даты к формату moment-строк
  const normalizeValues = (values) => {
    for (const [key, value] of Object.entries(values)) {
      if (Array.isArray(value)) {
        value.forEach((element) => {
          for (const [k, v] of Object.entries(element)) {
            if (v && typeof v === "object" && Object.hasOwn(v, "$d")) {
              element[k] = moment(v).format();
            }
          }
        });
      }
      if (value && typeof value === "object" && Object.hasOwn(value, "$d")) {
        values[key] = moment(value).format();
      }
    }
    return values;
  };

  // Сабмит всей формы (вызывается на последнем шаге)
  const onFinish = async (values) => {
    try {
      const normalized = normalizeValues(values);
      console.log("Данные для создания заявки:", normalized);

      await createClaim({
        versionId: serviceItem?.versionId,
        serviceId: serviceItem?.Ref_Key,
        values: normalized,
      });
    } catch (err) {
      console.log(err.message || "Ошибка при создании заявки.");
      setError(err.message);
    }
  };

  // Валидация полей текущего шага и переход "Далее"
  const nextStep = async () => {
    try {
      const currentFields = steps[currentStep]?.fields || [];
      await form.validateFields(currentFields.map((f) => f.name));
      setCurrentStep((prev) => prev + 1);
    } catch (validationErr) {
      console.log("Ошибка валидации", validationErr);
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  };

  // Сортированные поля (или пустой массив, если их нет)
  const allFields =
    serviceItem?.fields?.sort((a, b) => a.lineNum - b.lineNum) || [];

  // Посмотрим в консоли, сколько реально пришло полей:
  console.log("Полученные поля:", allFields);

  // Делаем массив «шагов», разделяя поля по 5 штук на шаг
  const chunked = chunkArray(allFields, 5);
  // Формируем массив шагов для компонента Steps
  const steps = chunked.map((fieldsChunk, index) => ({
    title: `Шаг ${index + 1}`,
    fields: fieldsChunk,
  }));

  // Если всё загружено и serviceItem есть, но полей 0,
  // значит для этой услуги нет полей (или неверный id).
  // Тогда steps = [] и страница будет иметь 0 шагов.

  return (
    <div style={{ maxWidth: "100%", margin: "0 auto" }}>
      <AppHelmet
        title="Новая заявка (тест)"
        desc="Пошаговая заявка - тестовый вариант"
      />

      {isLoading && (
        <Flex style={{ height: "300px" }} align="center" justify="center">
          <Preloader />
        </Flex>
      )}

      {!isLoading && serviceItem && (
        <>
          <Breadcrumb
            separator=">"
            itemRender={(route) => <Link to={route.href}>{route.title}</Link>}
            items={(chain || []).map((item) => ({
              href: `/services/${item.Ref_Key}`,
              title: item.Description,
            }))}
          />

          <ConfigProvider
            theme={{
              token: {},
              components: {
                Select: {
                  optionFontSize: 18,
                  fontSize: 18,
                },
                Input: {
                  fontSize: 18,
                },
                Form: {
                  labelFontSize: 18,
                  verticalLabelPadding: "0 0 4px",
                  itemMarginBottom: 0,
                },
              },
            }}
          >
            <Title>{serviceItem.Description} (Тестовый wizard)</Title>

            <Flex gap={5} style={{ marginBottom: "1.2rem" }}>
              {(serviceItem.tags || []).map((item, index) => (
                <Tag
                  key={index}
                  style={{ fontSize: "1.2rem", lineHeight: "1.8rem" }}
                  color={item.tag?.color?.Имя}
                >
                  {item.tag?.Description}
                </Tag>
              ))}
            </Flex>

            {/* Показываем Steps — сколько получилось шагов */}
            <Steps current={currentStep} style={{ marginBottom: 40 }}>
              {steps.map((step, idx) => (
                <Step key={idx} title={step.title} />
              ))}
            </Steps>

            <Form
              scrollToFirstError
              form={form}
              labelAlign="right"
              layout="vertical"
              onFinish={onFinish}
              onKeyDown={handleKeyDown}
              style={{
                width: "100%",
                margin: "0 auto",
              }}
              labelWrap
              validateTrigger={["onSubmit", "onChange"]}
            >
              <Row gutter={[20, 20]} align="stretch">
                {(steps[currentStep]?.fields || []).map((item,index)=>selectComponent(item,index))}
              </Row>

              <div
                style={{
                  marginTop: 20,
                  display: "flex",
                  justifyContent: "center",
                  gap: "1rem",
                }}
              >
                {currentStep > 0 && (
                  <Button onClick={prevStep} style={{ minWidth: 100 }}>
                    Назад
                  </Button>
                )}

                {/* Если не последний шаг — показываем "Далее" */}
                {currentStep < steps.length - 1 && (
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 10,
                    }}
                  >
                    <Button
                      type="primary"
                      onClick={nextStep}
                      style={{ minWidth: 100 }}
                    >
                      Далее
                    </Button>
                  </motion.div>
                )}

                {/* Если последний шаг — кнопка "Отправить" */}
                {currentStep === steps.length - 1 && steps.length > 0 && (
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 10,
                    }}
                  >
                    <Button
                      type="primary"
                      htmlType="submit"
                      style={{ minWidth: 120 }}
                    >
                      {serviceItem.buttonText || "Отправить заявку"}
                    </Button>
                  </motion.div>
                )}
              </div>
            </Form>
          </ConfigProvider>

          <Drawer
            title="Результат создания заявки (тест)"
            placement="bottom"
            closable={false}
            onClose={onClose}
            open={open}
            key="bottom"
          >
            {newClaim && (
              <>
                <Typography.Title level={3}>
                  Создана заявка с Ref_Key: <b>{newClaim.Ref_Key}</b>
                </Typography.Title>
                <Paragraph>Данные по заявке см. в консоли</Paragraph>
              </>
            )}
          </Drawer>
        </>
      )}

      {error && <ErrorModal visible={!!error} error={error} />}
    </div>
  );
}
