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
  Modal,
  Empty,
  List,
  Alert,
} from "antd";
import React, { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import useClaims from "../../stores/Cabinet/useClaims";
import useServices from "../../stores/useServices";
import AppHelmet from "../../components/Global/AppHelmet";
import moment from "moment";
import Preloader from "../../components/Main/Preloader";
import ErrorModal from "../../components/ErrorModal";
import SubmitModal from "../../components/SubmitModal";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { motion } from "framer-motion";

import selectComponent from "../../components/selectComponent";

const { Title, Paragraph } = Typography;

export default function NewClaim() {
  const chain = useServices((state) => state.chain);
  const serviceItem = useServices((state) => state.serviceItem);
  const fetchServiceItem = useServices((state) => state.fetchServiceItem);
  const isLoading = useServices((state) => state.isLoading);
  const createClaim = useClaims((state) => state.createClaim);
  const newClaim = useClaims((state) => state.newClaim);
  const clearNewClaim = useClaims((state) => state.clearNewClaim);
  const {
    blockButtonNewClaim,
    addBlockButtonNewClaim,
    removeBlockButtonNewClaim,
  } = useClaims((state) => state);
  const { id } = useParams();
  const [form] = Form.useForm();

  const [error, setError] = useState(null);
  const [isDirty, setIsDirty] = useState(false);

  const [validationErrors, setValidationErrors] = useState([]);
  const [showValidationModal, setShowValidationModal] = useState(false);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirty) {
        e.preventDefault();
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  useEffect(() => {
    fetchServiceItem(id, { withChain: true, withFields: true });
  }, []);

  useEffect(() => {
    if (newClaim) {
      console.log("newClaim", newClaim);
    }
  }, [newClaim]);

  const onClose = () => {
    clearNewClaim();
    setIsDirty(false);
  };

  const onFinish = async (values) => {
    let newValues = {};

    const addNewValue = (value) => {
      if (typeof value === "object" && Object.hasOwn(value, "$d")) {
        return moment(value.$d).format();
      } else if (!Array.isArray(value)) {
        return value;
      }
    };

    for (const [key, value] of Object.entries(values)) {
      if (Array.isArray(value)) {
        // addNewValueArray(value,key)
        newValues[key] = values[key].map((element) => {
          let newElement = {};
          for (const [key, value] of Object.entries(element)) {
            newElement[key] = addNewValue(value);
          }
          return newElement;
        });
      } else {
        newValues[key] = addNewValue(value);
      }
    }

    try {
      console.log("Данные для создания заявки: ", newValues);
      addBlockButtonNewClaim();
      await createClaim({
        versionId: serviceItem.versionId,
        serviceId: serviceItem.Ref_Key,
        values: newValues,
      });
      removeBlockButtonNewClaim();
      setIsDirty(false);
    } catch (err) {
      console.log(err.message || "Ошибка при создании заявки.");
      removeBlockButtonNewClaim();
    }
  };

  const handleKeyDown = (event) => {
    if (event.keyCode === 13) {
      event.preventDefault();
    }
  };
  console.log(serviceItem);

  const onFinishFailed = ({ errorFields }) => {
    setValidationErrors(errorFields);
    setShowValidationModal(true);
  };

  const getFieldNames = useMemo(() => {
    if (!serviceItem?.fields) return {};

    const fieldMap = {};
    serviceItem.fields.forEach((field) => {
      fieldMap[field.name] = field.label;
    });
    return fieldMap;
  }, [serviceItem]);

  const getReadableErrorMessages = (errorFields) => {
    return errorFields.map((error) => {
      // Получаем fieldId из error.name[0] (это UUID)
      const fieldId = error.name[0];

      // Ищем поле в serviceItem.fields по Ref_Key или name
      const field = serviceItem.fields.find(
        (f) => f.Ref_Key === fieldId || f.name === fieldId
      );

      // Используем label поля, если нашли, иначе оставляем UUID
      const fieldLabel = field ? field.label : fieldId;

      // Форматируем сообщение об ошибке
      const errorMessage = error.errors[0].replace(
        "Это поле обязательное",
        "Обязательное поле"
      );

      return `${fieldLabel}: ${errorMessage}`;
    });
  };

  // 3. Функция для склонения слова "поле" в зависимости от количества
  const declineWord = (count) => {
    if (count % 10 === 1 && count % 100 !== 11) return "поле";
    if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100))
      return "поля";
    return "полей";
  };

  return (
    <div style={{ maxWidth: "100%", margin: "0 auto" }}>
      <AppHelmet
        title={"Новая заявка"}
        desc={"Новая заявка - Портал цифровых услуг АО Мособлэнерго"}
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
            itemRender={(currentRoute) => {
              return <Link to={currentRoute.href}>{currentRoute.title}</Link>;
            }}
            items={
              serviceItem &&
              serviceItem.path.map((item) => ({
                href: `/services/${item.Ref_Key}`,
                title: item.label,
              }))
            }
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
            <Title>{serviceItem.label}</Title>
            <Flex gap={10} style={{ marginBottom: "1.2rem" }} wrap="wrap">
              {serviceItem.tags.map((item, index) => (
                <Tag
                  key={index}
                  style={{ fontSize: "1.2rem", lineHeight: "1.8rem" }}
                  color={item.color?.name}
                >
                  {item.name}
                </Tag>
              ))}
            </Flex>

            <Form
              scrollToFirstError={{
                // boundary: (parent) => {
                //   // console.log(parent);
                // },
                behavior: (actions) => {
                  // console.log(actions);
                  actions.forEach(({ el, top, left }) => {
                    // implement the scroll anyway you want
                    el.scrollTop = top - 100;
                    el.scrollLeft = left;

                    // // If you need the relative scroll coordinates, for things like window.scrollBy style logic or whatever, just do the math
                    // const offsetTop = el.scrollTop - top
                    // const offsetLeft = el.scrollLeft - left
                  });
                },
              }}
              form={form}
              labelAlign="right"
              layout="vertical"
              onFinish={onFinish}
              onKeyDown={handleKeyDown}
              onValuesChange={() => setIsDirty(true)}
              style={{
                width: "100%",
                margin: "0 auto",
              }}
              labelWrap
              validateTrigger={["onSubmit", "onChange"]}
              onFinishFailed={onFinishFailed}
            >
              <Row gutter={[20, 20]} align={"stretch"}>
                {serviceItem.fields
                  ?.sort((a, b) => a.lineNum - b.lineNum)

                  .map((item, index) => selectComponent(item, index))}
              </Row>
              {serviceItem?.fields?.length > 0 && (
                <div
                  style={{
                    marginTop: 20,
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Form.Item>
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 10,
                      }}
                    >
                      <Button
                        type="primary"
                        htmlType="submit"
                        disabled={blockButtonNewClaim}
                      >
                        {serviceItem.buttonText || "Подать заявку на услугу"}
                      </Button>
                    </motion.div>
                  </Form.Item>
                </div>
              )}
              {!serviceItem?.fields?.length > 0 && (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={
                    <Typography.Text>Отсутствует содержимое</Typography.Text>
                  }
                />
              )}
            </Form>
          </ConfigProvider>
          {/* <Drawer
            title="Поля формы"
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
                <Paragraph>Данные по заявке в консоле</Paragraph>
              </>
            )}
          </Drawer> */}
        </>
      )}
      {newClaim && (
        <SubmitModal
          open={!!newClaim}
          claim={{ ...newClaim }}
          onClose={onClose}
        />
      )}
      {error && <ErrorModal visible={!!error} error={error} />}
      {showValidationModal && (
        <Modal
          // title={
          //   <span>
          //     <ExclamationCircleFilled
          //       style={{ color: "#ff4d4f", marginRight: 8 }}
          //     />
          //     Ошибка заполнения формы
          //   </span>
          // }
          open={showValidationModal}
          closable={false}
          onOk={() => setShowValidationModal(false)}
          onCancel={() => setShowValidationModal(false)}
          maskClosable={false}
          width={600}
          okText="Понятно"
          cancelText="Закрыть"
          style={{ top: 20 }}
        >
          <Alert
            message={`Вы не заполнили ${validationErrors.length} ${declineWord(
              validationErrors.length
            )} из обязательных`}
            // description="Пожалуйста, проверьте следующие поля:"
            type="error"
            showIcon
            style={{ marginBottom: 16 }}
          />

          {/* <List
            size="small"
            bordered
            dataSource={getReadableErrorMessages(validationErrors).slice(0, 5)}
            renderItem={(item) => (
              <List.Item
                style={{
                  padding: "8px 12px",
                  borderBottom: "1px solid #f0f0f0",
                }}
              >
                <span style={{ color: "#ff4d4f", fontSize: "14px" }}>
                  • {item}
                </span>
              </List.Item>
            )}
            footer={
              validationErrors.length > 5 && (
                <div
                  style={{
                    textAlign: "center",
                    padding: "8px",
                    backgroundColor: "#fafafa",
                    borderTop: "1px solid #f0f0f0",
                  }}
                >
                  ... и ещё {validationErrors.length - 5} ошибок
                </div>
              )
            }
            style={{ maxHeight: "200px", overflowY: "auto" }}
          /> */}

          <div style={{ marginTop: 16, color: "#8c8c8c", fontSize: "12px" }}>
            После исправления ошибок попробуйте отправить форму ещё раз.
          </div>
        </Modal>
      )}
    </div>
  );
}
