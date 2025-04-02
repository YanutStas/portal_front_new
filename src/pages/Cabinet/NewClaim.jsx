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
} from "antd";
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import useClaims from "../../stores/Cabinet/useClaims";
import useServices from "../../stores/useServices";
import AppHelmet from "../../components/Global/AppHelmet";
import moment from "moment";
import Preloader from "../../components/Main/Preloader";
import ErrorModal from "../../components/ErrorModal";
import SubmitModal from "../../components/FormComponentsNew/SubmitModal";
import { motion } from "framer-motion";

import selectComponent from "../../components/selectComponent";

const { Title, Paragraph } = Typography;

export default function NewClaim() {
  const [open, setOpen] = useState(false);
  const chain = useServices((state) => state.chain);
  const serviceItem = useServices((state) => state.serviceItem);
  const fetchServiceItem = useServices((state) => state.fetchServiceItem);
  const isLoading = useServices((state) => state.isLoading);
  const createClaim = useClaims((state) => state.createClaim);
  const newClaim = useClaims((state) => state.newClaim);
  const clearNewClaim = useClaims((state) => state.clearNewClaim);
  const { id } = useParams();
  const [form] = Form.useForm();

  const [error, setError] = useState(null);

  useEffect(() => {
    fetchServiceItem(id, { withChain: true, withFields: true });
  }, []);

  useEffect(() => {
    if (newClaim) {
      showDrawer();
    }
  }, [newClaim]);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    clearNewClaim();
    setOpen(false);
  };

  const onFinish = async (values) => {
    let newValues = {};

    const addNewValue = (value) => {
      if (typeof value === "object" && Object.hasOwn(value, "$d")) {
        return moment(value).format();
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

      await createClaim({
        versionId: serviceItem.versionId,
        serviceId: serviceItem.Ref_Key,
        values: newValues,
      });
    } catch (err) {
      console.log(err.message || "Ошибка при создании заявки.");
    }
  };

  const handleKeyDown = (event) => {
    if (event.keyCode === 13) {
      event.preventDefault();
    }
  };
  console.log(serviceItem);
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
              chain &&
              chain.map((item) => ({
                href: `/services/${item.Ref_Key}`,
                title: item.Description,
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
            <Title>{serviceItem.Description}</Title>
            <Flex gap={5} style={{ marginBottom: "1.2rem" }}>
              {serviceItem.tags.map((item, index) => (
                <Tag
                  key={index}
                  style={{ fontSize: "1.2rem", lineHeight: "1.8rem" }}
                  color={item.tag?.color?.Имя}
                >
                  {item.tag?.Description}
                </Tag>
              ))}
            </Flex>

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
              <Row gutter={[20, 20]} align={"stretch"}>
                {serviceItem.fields
                  ?.sort((a, b) => a.lineNum - b.lineNum)

                  .map(selectComponent)}
              </Row>

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
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <Button type="primary" htmlType="submit">
                      {serviceItem.buttonText || "Подать заявку на услугу"}
                    </Button>
                  </motion.div>
                </Form.Item>
              </div>
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
          visible={!!newClaim}
          claim={{ ...newClaim, Code: serviceItem.Code }}
          onClose={onClose}
        />
      )}

      {error && <ErrorModal visible={!!error} error={error} />}
    </div>
  );
}
