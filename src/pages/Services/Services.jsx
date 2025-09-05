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
import folderPic from "../../img/catalog/folder.png";
import docPic from "../../img/catalog/doc.png";
import noImage from "../../img/catalog/noimage.png";

import { IconPowerUp } from "../../components/icons/IconPowerUp";
import { IconPowerUpArrow } from "../../components/icons/IconPowerUpArrow";
import { IconConnectNew } from "../../components/icons/IconConnectNew";
import { IconDocument } from "../../components/icons/IconDocument";
import { IconFolder } from "../../components/icons/IconFolder";
import { IconService } from "../../components/icons/IconService";
import getPublicFile from "../../lib/getPublicFile";
import ScrollToTop from "../../components/ScrollToTop";

const { Title } = Typography;
const backServer = import.meta.env.VITE_BACK_BACK_SERVER;

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
  // const fetchServiceChain = useServices((state) => state.fetchServiceChain);
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

  const getPicture = async (fileId, ext) => {
    const url = await getPublicFile(fileId, ext)
    // console.log("url", url);
    return url
    // if (!url) {
    //   return setSrcPictures(prev => ({ ...prev, [fileId]: noImage }))
    // }
    // setSrcPictures(prev => ({ ...prev, [fileId]: url }))
  }
  useEffect(() => {
    // services.services?.forEach(item => {
    //   // console.log("picture?.id", item.picture?.id);
    //   // if (!samePictureName(item.picture?.name))
    //   if (item.picture?.id) {
    //     getPicture(item.picture?.id, item.picture?.ext)
    //   }
    // })
  }, [services])
  useEffect(() => {
    console.log("srcPictures", srcPictures);

  }, [srcPictures])


  return (
    <>
      <ScrollToTop />
      <AppHelmet
        title={"Каталог услуг"}
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
              services.path.map((item, index) => {
                if (services.path.length - 1 === index) {
                  return {
                  }
                }
                return {
                  href: `/services/${item.Ref_Key}`,
                  title: item.label,
                }
              })
            }
          />
        </>
        {/* )} */}
        {isLoading ? (
          
            <Preloader />
          
        ) : error ? (
          <ErrorModal
            visible={!!error}
            error={error}
            onClose={() => error(null)}
          />
        ) : (
          <>
            <Title level={1} className={styles.title}>
              {services && services.label || "Каталог услуг"}
            </Title>
            {services && services.services?.length > 0 ? (
              <Flex wrap="wrap" style={{ width: "100%" }} className={styles.flexContainer}>
                {services.services
                  .sort((a, b) => a.order - b.order)
                  .map((item, index) => (
                    <Link
                      key={index}
                      to={
                        item.isFolder
                          ? `/services/${item.Ref_Key}`
                          : `/services/item/${item.Ref_Key}`
                      }

                      className={styles.styleCard}
                    >
                      <Card
                        style={{
                          height: "100%",
                          overflow: "hidden"
                        }}
                        classNames={{
                          body: `${styles.bodyCard}`
                        }}

                        hoverable
                        cover={<Image style={{
                          backgroundSize: "contain",
                          backgroundRepeat: "no-repeat",
                          backgroundPosition: "center",
                        }}
                          preview={false}
                          alt="услуга"
                          // src="https://avatars.mds.yandex.net/i?id=922dae47138a6505b8b2aea02eda9f39501ddf28-5231505-images-thumbs&n=13"
                          src={item.picture?.id ? `${backServer}/uploads/${item.picture?.checksum}.${item.picture?.ext}` : (item.isFolder ? folderPic : docPic)}
                          onError={async ({ currentTarget }) => {
                            // console.log(`${backServer}/uploads/${item.picture?.id}.${item.picture?.ext}`);

                            currentTarget.onerror = null; // prevents looping
                            currentTarget.src = "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs%3D"
                            currentTarget.src = item.picture?.id ? await getPicture(item.picture?.id, item.picture?.ext) || "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs%3D" : (item.isFolder ? folderPic : docPic)
                          }}
                        // src={item.picture?.id ? srcPictures[item.picture?.id] || "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs%3D" : (item.isFolder ? folderPic : docPic)}
                        // src="https://hammernail.ru/wp-content/uploads/2023/11/muzhchina_0.png"
                        />}
                      >
                        {/* <img
                          src={`${backServer}/uploads/${item.picture?.id}.${item.picture?.ext}`}
                          onError={({ currentTarget }) => {
                            currentTarget.onerror = null; // prevents looping
                            currentTarget.src = item.picture?.id ? srcPictures[item.picture?.id] || "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs%3D" : (item.isFolder ? folderPic : docPic)
                          }}
                          alt=""
                        /> */}
                        {/* <img src={`${backServer}/uploads/${item.picture?.id}.${item.picture?.ext}`} alt="" onerror="this.style.display='none'" />
                        <img src={item.picture?.id ? srcPictures[item.picture?.id] || "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs%3D" : (item.isFolder ? folderPic : docPic)} alt="" onerror="this.style.display='none'" /> */}
                        {/* <picture>
                            <source srcset={`${backServer}/uploads/${item.picture?.id}.${item.picture?.ext}`} />
                            <img src="mdn-logo-narrow.png" alt="MDN" />
                          </picture> */}
                        <Card.Meta
                          className={styles.styleCardMeta}
                          title={<Typography.Text className={styles.styleCardTitle} style={{ whiteSpace: "normal" }} >{item.label}</Typography.Text>}
                          description={!item.isFolder && item.codeService && (
                            `Код услуги: ${item.codeService}`
                          )} />
                        {/* <Title level={4} className={styles.cardTitle}>
                              {item.label}
                            </Title> */}

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
                          </Flex>
                        </Flex>
                      </Card>
                    </Link>
                    // </motion.div>
                  ))}
              </Flex>
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
