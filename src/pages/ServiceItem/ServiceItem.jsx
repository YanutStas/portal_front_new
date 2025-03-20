import React, { useEffect, useState } from "react";
import useServices from "../../stores/useServices";
import { Link, useParams } from "react-router-dom";
import {
  Button,
  Collapse,
  Drawer,
  Flex,
  Steps,
  Typography,
  theme,
  Breadcrumb,
  Tag,
} from "antd";
import styles from "./ServicesItem.module.css";
import { motion } from "framer-motion";
import { InfoCircleOutlined } from "@ant-design/icons";
import MarkDownText from "../../components/MarkDownText/MarkDownText";
import Preloader from "../../components/Main/Preloader";
import Law from "../../components/Documentation/Law";
import ErrorModal from "../../components/ErrorModal";

const { Title, Text, Paragraph } = Typography;

export default function ServiceItem() {
  const [open, setOpen] = useState(false);
  const [openDrawerSteps, setOpenDrawerSteps] = useState(false);
  const { colorPrimary } = theme.useToken().token;
  const serviceItem = useServices((state) => state.serviceItem);
  const fetchServiceItem = useServices((state) => state.fetchServiceItem);
  const isLoading = useServices((state) => state.isLoading);
  const { level2, key } = useParams();

  const chain = useServices((state) => state.chain);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchServiceItem(key, { withChain: true, withFields: false });
      } catch (err) {
        setError(
          err.message || "Произошла ошибка при загрузке данных об услуге"
        );
      }
    };

    fetchData();
  }, [level2, key, fetchServiceItem]);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };
  // console.log(serviceItem);
  return (
    <div>
      {serviceItem && (
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
          <Title level={1} style={{ marginTop: "10px" }}>
            {serviceItem.Description}
          </Title>
          <Flex gap={5} style={{ marginBottom: "1.2rem" }} wrap={"wrap"}>
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
        </>
      )}
      {isLoading && (
        <Flex style={{ height: "300px" }} align="center" justify="center">
          <Preloader />
        </Flex>
      )}
      {!isLoading && !error && serviceItem && (
        <>
          <Collapse
            defaultActiveKey={["1"]}
            items={[
              {
                key: "1",
                label: "Описание",
                children: (
                  <div>
                    <Paragraph>{serviceItem.shortDescription}</Paragraph>
                    <MarkDownText>{serviceItem.fullDescription}</MarkDownText>
                    {serviceItem.descriptionOfDocumentPreparationPeriod && (
                      <Paragraph>
                        <b>Срок подготовки документов:</b>{" "}
                        {serviceItem.descriptionOfDocumentPreparationPeriod}
                      </Paragraph>
                    )}
                    {serviceItem.descriptionOfPeriodService && (
                      <Paragraph>
                        <b>Срок оказания услуги:</b>{" "}
                        {serviceItem.descriptionOfPeriodService}
                      </Paragraph>
                    )}
                    {serviceItem.descriptionOfCost && (
                      <Paragraph>
                        <b>Стоимость:</b> {serviceItem.descriptionOfCost}
                      </Paragraph>
                    )}
                  </div>
                ),
              },
              {
                key: "2",
                label: "Необходимая информация для подачи заявки",
                children: (
                  <>
                    <MarkDownText>
                      {serviceItem.requiredInformation}
                    </MarkDownText>
                  </>
                ),
              },
              {
                key: "3",
                label: "Этапы выполнения",
                children: (
                  <Steps
                    direction="vertical"
                    current={100}
                    items={serviceItem?.steps?.map((item, index) => ({
                      icon: (
                        <div
                          className={styles.icon}
                          style={{ border: `2px solid ${colorPrimary}` }}
                        >
                          <Text className={styles.iconText}>{index + 1}</Text>
                        </div>
                      ),
                      title: (
                        <>
                          <span>{item.name}</span>
                          {item.fullDescription && (
                            <InfoCircleOutlined
                              onClick={() => {
                                setOpenDrawerSteps(index + 1);
                              }}
                              style={{
                                marginLeft: 2,
                                color: "rgba(0, 0, 0, 0.45)",
                              }}
                            />
                          )}
                        </>
                      ),
                      description: (
                        <>
                          <span>{item.shortDescription}</span>
                          <Drawer
                            title={item.name}
                            placement="right"
                            onClose={() => {
                              setOpenDrawerSteps(false);
                            }}
                            open={openDrawerSteps === index + 1}
                          >
                            <MarkDownText>
                              {item.fullDescription || "Нет описания"}
                            </MarkDownText>
                          </Drawer>
                        </>
                      ),
                      subTitle: item.periodDescription,
                    }))}
                  />
                ),
              },
              {
                key: "4",
                label: "Нормативные акты и законодательство",
                children: <Law />,
              },
            ]}
          />

          <Flex align="center" justify="center" style={{ padding: "20px" }}>
            <motion.div
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Link to={`/cabinet/new-claim/${serviceItem.Ref_Key}`}>
                <Button type="primary" size="large" onClick={showDrawer}>
                  {"Заполнить заявку"}
                </Button>
              </Link>
            </motion.div>
          </Flex>

          <Drawer
            title="Вы почти подали заявку"
            placement="bottom"
            closable={false}
            onClose={onClose}
            open={open}
            key="bottom"
          >
            <Paragraph>Скоро механизм подачи заявок заработает</Paragraph>
          </Drawer>
        </>
      )}
      {error && (
        <ErrorModal
          visible={!!error}
          error={error}
          onClose={() => setError(null)}
        />
      )}
    </div>
  );
}
