import React, { useEffect, useState } from "react";
import { Card, Typography, Skeleton, Descriptions, theme, Divider, Flex, Empty, Pagination } from "antd";
import { BarsOutlined, BorderOutlined, FileSearchOutlined, UserOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import AppHelmet from "../../../../components/Global/AppHelmet";
import useClaims from "../../../../stores/Cabinet/useClaims";
import styles from "./Claimers.module.css";
import { motion } from "framer-motion";
import moment from "moment/moment";
import CardClaim from "../CardClaim";
import usePersonalAccounts from "../../../../stores/Cabinet/usePersonalAccount";
import Container from "../../../../components/Container";
import FiltersClaims from "./FiltersClaims";
import Preloader from "../../../../components/Main/Preloader";
import LineClaim from "../LineClaim";

// const { Title } = Typography;

// const listLK = [
//   {
//     Ref_Key: "kns6df-sdf67235-sdfs2-234234",
//     Description: "ИП Попов Иван Сидорович",
//     create: "2024-07-12 18:23",
//     activeClaims: 12,
//     finishedClaims: 20
//   },
//   {
//     Ref_Key: "kn66df-sdfff555-sdfs2-235664",
//     Description: "Савельев Егор Васильевич",
//     create: "2024-09-23 10:29",
//     activeClaims: 1,
//     finishedClaims: 3
//   },
// ]

export default function Claimers() {
  const [typeView, setTypeView] = useState('card')
  const [selectFilters, setSelectFilters] = useState({})
  const [claims, setClaims] = useState()
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const claimsAll = useClaims((state) => state.claims);
  const metaClaims = useClaims((state) => state.metaClaims);
  const fetchClaims = useClaims((state) => state.fetchClaims);
  const personalAccounts = usePersonalAccounts((state) => state.personalAccounts);
  const fetchPersonalAccounts = usePersonalAccounts((state) => state.fetchPersonalAccounts);

  const { token } = theme.useToken();
  useEffect(() => {
    setClaims(claimsAll)
  }, [claimsAll])
  useEffect(() => {
    // console.log(selectFilters);

    if (claimsAll) {
      setClaims(claimsAll.filter(item => {
        if (selectFilters.status || selectFilters.number) {
          const select = selectFilters.status ? item.currentStatus.label === selectFilters.status : true
          const number = selectFilters.number ? item.number?.includes(selectFilters.number) : true
          return (select && number)
        }
        return true
      }))
    }
  }, [selectFilters])
  useEffect(() => {
    fetchPersonalAccounts();
  }, []);
  useEffect(() => {
    fetchClaims(page, pageSize);
  }, [page, pageSize]);
  console.log("claimsAll", claimsAll)
  // console.log("token",token)
  return (
    <Container>

      <AppHelmet title={"Список заявок"} desc={"Список поданных заявок"} />
      {/* <Title level={1}>Заявки</Title> */}
      {!claims ? (
        <Preloader />
      ) : (
        <div className={styles.claimsContainer}>
          {claims?.length === 0 && personalAccounts.length === 0 &&
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <Typography.Text>Поданных заявок пока нет</Typography.Text>
              }
            />
          }
          {personalAccounts && personalAccounts.length > 0 && <Divider titlePlacement="start">
            <Flex gap={10} align="center">
              <UserOutlined style={{ fontSize: 24 }} />
              <Typography.Text>Личные кабинеты</Typography.Text>
            </Flex>
          </Divider>}
          <Flex wrap={"wrap"} gap={20} >

            {personalAccounts && personalAccounts.map((item, index) => (
              <Link
                key={index}
                to={`/cabinet/lk/${item.id}`}
                className={styles.styleLink}
                // style={{width:"100%"}}
              >
                <Card
                  hoverable
                  style={{
                    border: `1px solid ${token.colorInfo}`,
                  }}
                // extra={<div><Typography.Text style={{ color: token.colorTextDescription }}>Создан: </Typography.Text><Typography.Text>{moment(item.date).format('DD.MM.YYYY HH:mm')}</Typography.Text></div>}
                >
                  <Card.Meta
                    avatar={<UserOutlined
                      style={{ fontSize: 24, color: "gray" }} />}
                    title={item.name}
                    description={`Заявок ${item.totalClaims}`}
                  />
                  {/* <Descriptions column={1}>
                     <Descriptions.Item label="Создана">
                        {moment(item.date).format('DD.MM.YYYY HH:mm')}
                        </Descriptions.Item> 
                    {item.totalClaims &&
                      <Descriptions.Item label="Заявок" styles={{ content: { color: "green", fontWeight: 700 } }}>
                        {item.totalClaims}
                      </Descriptions.Item>
                    }
                    {item.finishedClaims &&
                      <Descriptions.Item label="Заявок в архиве">
                        {item.finishedClaims}
                      </Descriptions.Item>
                    }
                  </Descriptions> */}
                </Card>
              </Link>
            ))}
          </Flex>

          {/* -------------------------------------------------------- */}

          {/* {claimsAll?.length > 0 &&
            <div style={{ marginTop: 20 }}>
            </div>

          } */}
          {claimsAll?.length > 0 &&
            <>
              <Divider titlePlacement="start">
                <Flex gap={10} align="center">
                  <FileSearchOutlined style={{ fontSize: 24 }} />
                  <Typography.Text>Заявки на проверке</Typography.Text>
                </Flex>
              </Divider>
              {/* <FiltersClaims claimsAll={claimsAll} setSelectFilters={setSelectFilters} selectFilters={selectFilters} /> */}
              <Flex justify='flex-end' gap={10}>
                <BorderOutlined style={{ fontSize: 24, cursor: "pointer" }} onClick={() => { setTypeView('card') }} />
                <BarsOutlined style={{ fontSize: 24, cursor: "pointer" }} onClick={() => { setTypeView('line') }} />
              </Flex>
              <Flex wrap={"wrap"} gap={20} style={{ marginTop: 20, marginBottom: 20 }}>
                {claims && claims.map((item, index) => {
                  if (typeView === 'card') return <CardClaim item={item} key={index} state={item.currentStatus?.state} />
                  if (typeView === 'line') return <LineClaim item={item} key={index} state={item.currentStatus?.state} />
                }
                )}
              </Flex>
              <Pagination
                locale={{
                  items_per_page: 'на страницу',
                  next_5: "Следующие 5 страниц",
                  prev_5: "Предыдущие 5 страниц",
                  next_page: "Следующая страница",
                  prev_page: "Предыдущая страница"
                }}
                styles={{
                  root: {
                    display: "flex",
                    rowGap: 10,
                    flexWrap: "wrap"
                  }
                }}
                defaultCurrent={page}
                showTotal={total => `Всего ${total}`}
                pageSize={pageSize}
                total={metaClaims?.total}
                showSizeChanger
                onChange={(page, pageSize) => {
                  setPage(page)
                  setPageSize(pageSize)
                }} />
            </>
          }

        </div>
      )}
    </Container>
  );
}
