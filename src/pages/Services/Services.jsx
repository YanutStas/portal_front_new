import React, { useEffect, useState } from "react";
import AppHelmet from "../../components/Global/AppHelmet";
import { Card, Flex, Typography, theme, Breadcrumb, Tag, Image } from "antd";
import { Link, useParams, useLocation } from "react-router-dom";
import { motion, MotionConfig } from "framer-motion";
import useServices from "../../stores/useServices";
import styles from "./Services.module.css";
import Container from "../../components/Container";
import Preloader from "../../components/Main/Preloader";
import ErrorModal from "../../components/ErrorModal";

import { IconPowerUp } from "../../components/icons/IconPowerUp";
import { IconPowerUpArrow } from "../../components/icons/IconPowerUpArrow";
import { IconConnectNew } from "../../components/icons/IconConnectNew";
import { IconDocument } from "../../components/icons/IconDocument";
import { IconFolder } from "../../components/icons/IconFolder";
import { IconService } from "../../components/icons/IconService";
import getPublicFile from "../../lib/getPublicFile";

const { Title } = Typography;
const pictureName = [
  "IconDocument",
  "IconPowerUpArrow",
  "IconConnectNew",
  "IconPowerUp",
  "IconService",
  "IconService",
  "IconService",
  "IconService"
]

const samePictureName = (name) => {
  return pictureName.includes(name)
}

export default function Services() {
  const [srcPictures, setSrcPictures] = useState({})
  const [isHoverCard, setIsHoverCard] = useState({});
  const location = useLocation();
  const { token } = theme.useToken();
  const isLoading = useServices((state) => state.isLoading);
  const services = useServices((state) => state.services);
  // const chain = useServices((state) => state.chain);
  // const path = useServices((state) => state.path);
  const error = useServices((state) => state.error);
  const fetchServiceChain = useServices((state) => state.fetchServiceChain);
  const serviceItem = useServices((state) => state.serviceItem);
  const fetchServices = useServices((state) => state.fetchServices);
  const { level2 } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchServices(level2);
      } catch (err) {
        console.error("Ошибка при загрузке услуг:", err);
      }
    };

    fetchData();
  }, [level2, fetchServices]);
  console.log("services", services);
  // console.log("path", path);

  const getPicture = async (fileId) => {
    const url = await getPublicFile(fileId)
    setSrcPictures(prev => ({...prev, [fileId]: url}))
}
useEffect(() => {
  services.services?.forEach(item => {
    console.log(item.picture?.id);
    if (!samePictureName(item.picture?.name))
      
      getPicture(item.picture?.id)
  })
}, [services])
useEffect(() => {
  console.log("srcPictures",srcPictures);
  
}, [srcPictures])


return (
  <>
    <AppHelmet
      title={
        location.pathname === "/services" ||
          location.pathname === "/services/"
          ? "Каталог услуг"
          : serviceItem?.name
      }
      desc="Услуги компании"
    />
    <Container>
      {/* {serviceItem && ( */}
      <>
        <Breadcrumb
          separator=">"
          itemRender={(currentRoute) => {
            return <Link to={currentRoute.href}>{currentRoute.title}</Link>;
          }}
          items={
            !(
              location.pathname === "/services" ||
              location.pathname === "/services/"
            ) &&
            services.path &&
            services.path.map((item) => ({
              href: `/services/${item.Ref_Key}`,
              title: item.label,
            }))
          }
        />
      </>
      {/* )} */}
      {isLoading ? (
        <Flex style={{ height: "300px" }} align="center" justify="center">
          <Preloader />
        </Flex>
      ) : error ? (
        <ErrorModal
          visible={!!error}
          error={error}
          onClose={() => error(null)}
        />
      ) : (
        <>
          <Title level={1} className={styles.title}>
            {services && services.path ? services.path[services.path.length - 1]?.label : "Каталог услуг"}
          </Title>
          {services && services.services?.length > 0 ? (
            <MotionConfig transition={{ duration: 0.2 }}>
              <Flex wrap="wrap" gap="large" style={{ width: "100%" }} className={styles.flexContainer}>
                {services.services
                  .sort((a, b) => a.order - b.order)
                  .map((item, index) => (
                    <motion.div key={index} className={styles.styleLink}>
                      <Link
                        key={index}
                        to={
                          item.isFolder
                            ? `/services/${item.Ref_Key}`
                            : `/services/item/${item.Ref_Key}`
                        }
                      >
                        <Card
                          onMouseEnter={() =>
                            setIsHoverCard((prev) => ({
                              ...prev,
                              [index]: true,
                            }))
                          }
                          onMouseLeave={() =>
                            setIsHoverCard((prev) => ({
                              ...prev,
                              [index]: false,
                            }))
                          }
                          onClick={() =>
                            setIsHoverCard((prev) => ({
                              ...prev,
                              [index]: false,
                            }))
                          }
                          className={styles.styleCard}
                          style={{
                            border: `1px solid ${token.colorBorder}`,
                          }}
                          styles={{
                            body: {
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "space-between",
                              height: "100%",
                              background:
                                "linear-gradient(-30deg, rgba(0,97,170,.1) 0%, rgba(255,255,255,0) 50%)",
                            },
                          }}
                          hoverable
                        >
                          <Title level={4} className={styles.cardTitle}>
                            {item.label}
                          </Title>

                          <Flex
                            justify={
                              !item.isFolder ? "space-between" : "flex-end"
                            }
                            align="flex-start"
                            gap={20}
                            style={{ width: "100%", flex: 1 }}
                          >
                            {!item.isFolder && (
                              <Flex vertical gap={10}>
                                {item.tags?.map((item, index) => (
                                  <Tag
                                    key={index}
                                    className={styles.tags}
                                    color={item.tag?.color?.Имя}
                                  >
                                    {item.tag?.Description}
                                  </Tag>
                                ))}
                              </Flex>
                            )}
                            <Flex
                              align="center"
                              justify="center"
                              style={{
                                width: !item.isFolder ? "35%" : "35%",
                                alignSelf: "flex-end",
                              }}
                            >
                              {!item.isFolder && item.codeService && (
                                <div className={styles.codeDiv}>
                                  Код услуги: {item.codeService}
                                </div>
                              )}

                              {!item.isFolder && (
                                <div className={styles.iconDiv}>
                                  {item.picture?.name === "IconDocument" && (
                                    <IconDocument
                                      isHover={isHoverCard[index]}
                                    />
                                  )}
                                  {item.picture?.name === "IconPowerUpArrow" && (
                                    <IconPowerUpArrow
                                      isHover={isHoverCard[index]}
                                    />
                                  )}
                                  {item.picture?.name === "IconConnectNew" && (
                                    <IconConnectNew
                                      isHover={isHoverCard[index]}
                                    />
                                  )}
                                  {item.picture?.name === "IconPowerUp" && (
                                    <IconPowerUp
                                      isHover={isHoverCard[index]}
                                    />
                                  )}
                                  {item.picture?.name === "IconService" && (
                                    <IconService
                                      isHover={isHoverCard[index]}
                                    />
                                  )}

                                  {!samePictureName(item.picture?.name) && (
                                    <Image
                                    width={"100%"}
                                      preview={false}
                                      src={srcPictures[item.picture?.id]}
                                    />
                                  )}
                                </div>
                              )}
                              {item.isFolder && (
                                <div className={styles.iconDiv}>
                                  <IconFolder isHover={isHoverCard[index]} />
                                </div>
                              )}
                            </Flex>
                          </Flex>
                        </Card>
                      </Link>
                    </motion.div>
                  ))}
              </Flex>
            </MotionConfig>
          ) : (
            <Title
              level={2}
              className={styles.title}
              style={{ color: "#999" }}
            >
              Услуг в данной категории не найдено
            </Title>
          )}
        </>
      )}
    </Container>
  </>
);
}
