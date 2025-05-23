import React, { useEffect } from "react";
import { Card, Typography, Skeleton, Descriptions, theme, Divider, Flex } from "antd";
import { Link } from "react-router-dom";
import AppHelmet from "../../../../components/Global/AppHelmet";
import useClaims from "../../../../stores/Cabinet/useClaims";
import styles from "./Claimers.module.css";
import { motion } from "framer-motion";
import moment from "moment/moment";
import CardClaim from "../CardClaim";

const { Title } = Typography;

const listLK = [
  {
    Ref_Key: "kns6df-sdf67235-sdfs2-234234",
    Description: "ИП Попов Иван Сидорович",
    create: "2024-07-12 18:23",
    activeClaims: 12,
    finishedClaims: 20
  },
  {
    Ref_Key: "kn66df-sdfff555-sdfs2-235664",
    Description: "Савельев Егор Васильевич",
    create: "2024-09-23 10:29",
    activeClaims: 1,
    finishedClaims: 3
  },
]

export default function Claimers() {
  const claims = useClaims((state) => state.claims);
  const fetchClaims = useClaims((state) => state.fetchClaims);

  const { token } = theme.useToken();

  useEffect(() => {
    fetchClaims();
  }, [fetchClaims]);
  console.log("claims", claims)
  // console.log("token",token)
  return (
    <>
      <AppHelmet title={"Список заявок"} desc={"Список поданных заявок"} />
      {/* <Title level={1}>Заявки</Title> */}
      {!claims ? (
        <div>
          {/* Отображение скелетонов, пока данные загружаются */}
          <Skeleton active avatar paragraph={{ rows: 2 }} />
          <Skeleton active avatar paragraph={{ rows: 2 }} />
          <Skeleton active avatar paragraph={{ rows: 2 }} />
        </div>
      ) : (
        <div className={styles.claimsContainer}>
          <Divider orientation="left">Личные кабинеты</Divider>
          <Flex wrap={"wrap"} gap={20} >

            {listLK.map((item, index) => (
              <Link
                key={index}
                to={`/cabinet/lk/${item.Ref_Key}`}
                className={styles.styleLink}
              >
                <Card
                  className={styles.styleCard}
                  hoverable
                  title={<Flex wrap={"wrap"} align="center" justify="space-between">
                    <Typography.Text>{item.Description}</Typography.Text>
                    {/* <div><Typography.Text style={{ color: token.colorTextDescription }}>От: </Typography.Text><Typography.Text>{moment(item.date).format('DD.MM.YYYY HH:mm')}</Typography.Text></div> */}
                  </Flex>}
                  style={{
                    border: `1px solid ${token.colorInfo}`,
                    // background: "linear-gradient(0deg, rgba(243, 112, 33,.1) 0%, rgba(255,255,255,0) 30%)",
                  }}
                // extra={<div><Typography.Text style={{ color: token.colorTextDescription }}>Создан: </Typography.Text><Typography.Text>{moment(item.date).format('DD.MM.YYYY HH:mm')}</Typography.Text></div>}
                >
                  <Descriptions column={1}>
                    {/* <Descriptions.Item label="Создана">
                        {moment(item.date).format('DD.MM.YYYY HH:mm')}
                        </Descriptions.Item> */}
                    <Descriptions.Item label="Заявок в работе" contentStyle={{ color: "green", fontWeight: 700 }}>
                      {item.activeClaims}
                    </Descriptions.Item>
                    <Descriptions.Item label="Выполнено заявок">
                      {item.finishedClaims}
                    </Descriptions.Item>
                  </Descriptions>
                </Card>
              </Link>
            ))}
          </Flex>

          {/* -------------------------------------------------------- */}


          {claims.claimsProject?.length > 0 &&
            <Divider orientation="left">Заявки на проверке</Divider>
          }
          <Flex wrap={"wrap"} gap={20} >
            {claims.claimsProject?.map((item, index) => (
              <CardClaim item={item} key={index} />
            ))}
          </Flex>

          <Divider orientation="left">Отклоненные заявки</Divider>

        </div>
      )}
    </>
  );
}
