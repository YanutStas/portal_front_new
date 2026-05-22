import React, { useEffect, useMemo, useState } from "react";
import { Card, Typography, Skeleton, Descriptions, theme, Divider, Flex, Empty, Pagination, Collapse, Drawer, Form } from "antd";
import { BarsOutlined, BorderOutlined, FileSearchOutlined, FilterOutlined, UserOutlined } from "@ant-design/icons";
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
import FiltersClaimsNew from "./FiltersClaimsNew";
import ClaimsList from "./ClaimsList";
import SortClaimsNew from "./SortClaimsNew";

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
  const [formFilter] = Form.useForm()
  // const formFilter = useMemo(() => Form.createForm({}), []);
  const [openMobileFilters, setOpenMobileFilters] = useState(false)
  const [typeView, setTypeView] = useState('card')
  const [selectFilters, setSelectFilters] = useState({})
  const [selectSort, setSelectSort] = useState(false)
  // const [claims, setClaims] = useState()

  // const claimsAll = useClaims((state) => state.claims);

  const filtersClaims = useClaims((state) => state.filtersClaims);
  const fetchClaimsDataset = useClaims((state) => state.fetchClaimsDataset);


  const personalAccounts = usePersonalAccounts((state) => state.personalAccounts);
  const fetchPersonalAccounts = usePersonalAccounts((state) => state.fetchPersonalAccounts);

  const { token } = theme.useToken();

  useEffect(() => {
    fetchPersonalAccounts();
    fetchClaimsDataset("filters");
  }, []);

  // useEffect(() => {
  //   fetchClaims(page, pageSize, selectFilters);
  // }, [page, pageSize, selectFilters]);


  // console.log("token", token)
  // console.log("filtersClaims", filtersClaims)
  return (
    <>
      <Container>
        <AppHelmet title={"Список заявок"} desc={"Список поданных заявок"} />
        {/* <Title level={1}>Заявки</Title> */}

        <div className={styles.claimsContainer}>
          {personalAccounts.length === 0 &&
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={"Поданных заявок пока нет"}
            />
          }
          {/* {personalAccounts && personalAccounts.length > 0 && <Divider titlePlacement="start">
            <Flex gap={10} align="center">
              <UserOutlined style={{ fontSize: 24 }} />
              <Typography.Text>Личные кабинеты</Typography.Text>
            </Flex>
          </Divider>} */}
          {/* <Flex wrap={"wrap"} gap={20} >

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

                </Card>
              </Link>
            ))}
          </Flex> */}

          {/* -------------------------------------------------------- */}

          <>
            {/* <Divider titlePlacement="start">
              <Flex gap={10} align="center">
                <FileSearchOutlined style={{ fontSize: 24 }} />
                <Typography.Text>Заявки</Typography.Text>
              </Flex>
            </Divider> */}
            {/* <Collapse items={[
            {
              label: "Фильтры",
              children: <Flex vertical style={{ marginBottom: 10 }}>
                <Typography.Text strong>Фильтры:</Typography.Text>
                <FiltersClaimsNew filters={filtersClaims?.filters} setSelectFilters={setSelectFilters} />
              </Flex>
            },
            {
              label: "Сортировка",
              children: <Flex vertical style={{ marginBottom: 10 }}>
                <Typography.Text strong>Сортировка:</Typography.Text>
                <div style={{ flex: 1 }}>
                  <SortClaimsNew options={filtersClaims?.sortings} setSelectSort={setSelectSort} />
                </div>
              </Flex>
            },
          ]} /> */}

            {/* <Flex vertical style={{ flex: 1 }}>
            <Flex vertical style={{ marginBottom: 10 }}>
              <Typography.Text strong>Фильтры:</Typography.Text>
              <FiltersClaimsNew filters={filtersClaims?.filters} setSelectFilters={setSelectFilters} />
            </Flex>
            <Flex vertical style={{ marginBottom: 10 }}>
              <Typography.Text strong>Сортировка:</Typography.Text>
              <div style={{ flex: 1 }}>
                <SortClaimsNew options={filtersClaims?.sortings} setSelectSort={setSelectSort} />
              </div>
            </Flex>
          </Flex> */}
            {/* <FiltersClaims claimsAll={claimsAll} setSelectFilters={setSelectFilters} selectFilters={selectFilters} /> */}

            <Flex gap={10} style={{ width: "100%" }}>
              <Flex vertical style={{ marginTop: 0, width: 350, border: `1px solid ${token.colorBorder}`, padding: 10, borderRadius: 10, backgroundColor: token.colorBgBase }} className={styles.filtersDesktop}>
                {/* <Typography.Text strong>Фильтры:</Typography.Text> */}
                <FiltersClaimsNew formFilter={formFilter} filters={filtersClaims?.filters} setSelectFilters={setSelectFilters} />
              </Flex>
              <Flex vertical style={{ flex: 1 }} >
                <Flex style={{ marginLeft: 10 }} gap={10} justify="space-between">
                  <div className={styles.filtersMobile}>
                    <FilterOutlined style={{ fontSize: 24, cursor: "pointer" }} onClick={() => { setOpenMobileFilters(true) }} />
                  </div>
                  <SortClaimsNew sorts={filtersClaims?.sorts} setSelectSort={setSelectSort} />
                  <Flex justify='flex-end' gap={10} className={styles.types}>
                    <BorderOutlined style={{ fontSize: 24, cursor: "pointer" }} onClick={() => { setTypeView('card') }} />
                    <BarsOutlined style={{ fontSize: 24, cursor: "pointer" }} onClick={() => { setTypeView('line') }} />
                  </Flex>
                </Flex>
                <ClaimsList selectFilters={selectFilters} selectSort={selectSort} typeView={typeView} />
              </Flex>
            </Flex>
          </>


        </div>

      </Container>
      <Drawer
        title="Фильтры"
        open={openMobileFilters}
        onClose={() => {
          setOpenMobileFilters(false)
        }}
      >
        <FiltersClaimsNew formFilter={formFilter} filters={filtersClaims?.filters} setSelectFilters={setSelectFilters} mobile closeDrawer={() => { setOpenMobileFilters(false) }} />
      </Drawer>
    </>
  );
}
