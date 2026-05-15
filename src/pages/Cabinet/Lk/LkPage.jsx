import { Button, Collapse, Descriptions, Divider, Drawer, Flex, List, Pagination, theme, Typography } from 'antd';
import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import CardClaim from '../Claims/CardClaim';
import usePersonalAccounts from '../../../stores/Cabinet/usePersonalAccount';
import Preloader from '../../../components/Main/Preloader'
import Container from '../../../components/Container';
import FiltersClaims from "../Claims/Claimers/FiltersClaims";
import LineClaim from '../Claims/LineClaim';
import { BarsOutlined, BorderOutlined, LeftOutlined } from '@ant-design/icons';

export default function LkPage() {
    const navigate = useNavigate()
    const [openDrawer, setOpenDrawer] = useState(false)
    const [selectFilters, setSelectFilters] = useState({})
    const [claims, setClaims] = useState()
    const [typeView, setTypeView] = useState('card')
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    // const [lk, setLk] = useState(null)
    // const [listClaims, setListClaims] = useState(null)
    // const [listCompletedClaims, setListCompletedClaims] = useState(null)
    const { token } = theme.useToken();
    const {
        personalAccount,
        fetchPersonalAccountItem,
        claimsByPersonalAccount,
        fetchClaimsByPersonalAccount,
        // loadingPersonalAccounts,
        metaClaimsByPersonalAccount,
        loadingPersonalAccount,
        loadingClaimsByPersonalAccount,
    } = usePersonalAccounts(state => state)
    const { id } = useParams();

    useEffect(() => {
        setClaims(claimsByPersonalAccount)
    }, [claimsByPersonalAccount])
    useEffect(() => {
        if (claimsByPersonalAccount) {
            setClaims(claimsByPersonalAccount.filter(item => {
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
        fetchPersonalAccountItem(id)
        fetchClaimsByPersonalAccount(id, page, pageSize)
    }, [page, pageSize])

    // console.log("page", page)
    // console.log("pageSize", pageSize)
    // console.log("claims", claimsByPersonalAccount)
    // console.log("metaClaimsByPersonalAccount", metaClaimsByPersonalAccount)
    return (
        <Container>
            <Button icon={<LeftOutlined />} onClick={() => navigate(-1)}>Назад</Button>
            {loadingPersonalAccount && <Preloader />}
            {!loadingPersonalAccount &&
                <div>
                    <Typography.Title style={{ margin: "10px 0" }}>{personalAccount?.name}</Typography.Title>
                    <Flex gap={10} style={{ marginBottom: 10 }}>
                        {personalAccount?.inn &&
                            <Typography.Text style={{ color: token.colorTextDescription }}>ИНН:{personalAccount?.inn}</Typography.Text>
                        }
                        {personalAccount?.kpp &&
                            <Typography.Text style={{ color: token.colorTextDescription }}>КПП:{personalAccount?.kpp}</Typography.Text>
                        }
                    </Flex>
                    <Button onClick={() => { setOpenDrawer(true) }}>Подробнее...</Button>

                    {loadingClaimsByPersonalAccount && <Preloader />}

                    {!loadingClaimsByPersonalAccount &&
                        <>
                            <Flex justify='flex-end' gap={10}>
                                <BorderOutlined style={{ fontSize: 24, cursor: "pointer" }} onClick={() => { setTypeView('card') }} />
                                <BarsOutlined style={{ fontSize: 24, cursor: "pointer" }} onClick={() => { setTypeView('line') }} />
                            </Flex>
                            {/* <div style={{ marginTop: 20 }}>
                                <FiltersClaims claimsAll={claimsByPersonalAccount} setSelectFilters={setSelectFilters} selectFilters={selectFilters} />
                            </div> */}
                            {/* <Divider titlePlacement='start'>В работе</Divider> */}
                            <Flex wrap={"wrap"} gap={20} style={{ marginTop: 20, marginBottom: 20 }}>
                                {claims && claims.map((item, index) => {
                                    if (typeView === 'card') return <CardClaim item={item} key={index} state={item.currentStatus?.state} />
                                    if (typeView === 'line') return <LineClaim item={item} key={index} state={item.currentStatus?.state} />
                                }
                                )}
                            </Flex>
                            {/* <Divider titlePlacement='start'>В архиве</Divider>
                            <Flex wrap={"wrap"} gap={20} style={{ marginTop: 20, marginBottom: 20 }}>
                                {claims && claims.sort((a, b) => b.number - a.number).filter(item => item.currentStatus.state === "completed" || item.currentStatus.state === "noAction").map((item, index) =>
                                    <CardClaim item={item} key={index} state={item.currentStatus.state} />)}
                            </Flex> */}
                            <Pagination
                                locale={{
                                    items_per_page: 'на страницу',
                                    next_5: "Следующие 5 страниц",
                                    prev_5: "Предыдущие 5 страниц",
                                    next_page:"Следующая страница",
                                    prev_page:"Предыдущая страница"
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
                                total={metaClaimsByPersonalAccount?.total}
                                onChange={(page, pageSize) => {
                                    setPage(page)
                                    setPageSize(pageSize)
                                }} />
                        </>
                    }

                    <Drawer
                        title={personalAccount?.name}
                        open={openDrawer}
                        onClose={() => { setOpenDrawer(false) }}
                    >
                        <Typography.Paragraph>
                            Всего заявок в личном кабинете: {personalAccount?.totalClaims}
                        </Typography.Paragraph>
                        <Typography.Paragraph>
                            Пользователи, которые имеют доступ к текущему личному кабинету:
                        </Typography.Paragraph>
                        <List
                            bordered
                            dataSource={personalAccount?.profiles?.map(item => item)}
                            renderItem={item => (
                                <List.Item>
                                    <Flex vertical>
                                        <Typography.Text>{item.email}</Typography.Text>
                                        {<Typography.Text style={{ fontSize: 10, color: "gray" }}>Создан: 15.05.2024</Typography.Text>}
                                        {<Typography.Text style={{ fontSize: 10, color: "gray" }}>Присоединен к ЛК: 18.10.2024</Typography.Text>}
                                        {item.block ? <Typography.Text style={{ fontSize: 10, color: "red" }}>Профиль заблокирован</Typography.Text> : false}
                                    </Flex>
                                </List.Item>
                            )}
                        />

                    </Drawer>
                </div>
            }
        </Container>
    )
}
