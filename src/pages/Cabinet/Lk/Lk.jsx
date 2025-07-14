import { Button, Collapse, Descriptions, Divider, Drawer, Flex, List, theme, Typography } from 'antd';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import CardClaim from '../Claims/CardClaim';
import usePersonalAccounts from '../../../stores/Cabinet/usePersonalAccount';
import Preloader from '../../../components/Main/Preloader'
import Container from '../../../components/Container';

export default function Lk() {
    const [openDrawer, setOpenDrawer] = useState(false)
    // const [lk, setLk] = useState(null)
    // const [listClaims, setListClaims] = useState(null)
    const [listCompletedClaims, setListCompletedClaims] = useState(null)
    const { token } = theme.useToken();
    const {
        personalAccount,
        fetchPersonalAccountItem,
        claimsByPersonalAccount,
        fetchClaimsByPersonalAccount,
        loadingPersonalAccounts,
        loadingPersonalAccount,
        loadingClaimsByPersonalAccount,
    } = usePersonalAccounts(state => state)
    const { id } = useParams();
    useEffect(() => {
        fetchPersonalAccountItem(id)
        fetchClaimsByPersonalAccount(id)
        setListCompletedClaims([
            {
                Ref_Key: "c416e302-98df-11ef-9501-5ef3fcb042f7",
                number: "000000109",
                date: "2024-10-01T09:00:32",
                service: {
                    description: "Описание услуги N3"
                }
            },
            {
                Ref_Key: "c416e302-98df-11ef-9501-5ef3fcb042f6",
                number: "000000108",
                date: "2024-09-12T10:56:32",
                service: {
                    description: "Описание услуги №4"
                }
            }
        ])
    }, [])
    const collap = [
        {
            key: '1',
            label: 'Выполненные заявки',
            children: <Flex gap={10} style={{ marginBottom: 10 }}>{listCompletedClaims && listCompletedClaims.map((item, index) => <CardClaim item={item} key={index} borderColor={"red"} />)}</Flex>,
        },
    ]
    // console.log(token)
    return (
        <Container>
            {loadingPersonalAccount && <Preloader />}
            {!loadingPersonalAccount &&
                <div>
                    <Typography.Title style={{ margin: 0 }}>{personalAccount?.name}</Typography.Title>
                    <Flex gap={10} style={{ marginBottom: 10 }}>
                        {personalAccount?.inn &&
                            <Typography.Text style={{ color: token.colorTextDescription }}>ИНН:{personalAccount?.inn}</Typography.Text>
                        }
                        {personalAccount?.kpp &&
                            <Typography.Text style={{ color: token.colorTextDescription }}>КПП:{personalAccount?.kpp}</Typography.Text>
                        }
                    </Flex>

                    <Button onClick={() => { setOpenDrawer(true) }}>Подробнее о компании</Button>
                    {loadingClaimsByPersonalAccount && <Preloader />}
                    {!loadingClaimsByPersonalAccount &&
                        <>
                            <Divider orientation='left'>В работе</Divider>
                            <Flex wrap={"wrap"} gap={20} style={{ marginTop: 20, marginBottom: 20 }}>
                                {claimsByPersonalAccount && claimsByPersonalAccount.sort((a, b) => b.number - a.number).map((item, index) =>
                                    <CardClaim item={item} key={index} />)}
                            </Flex>
                        </>
                    }
                    {/* <Collapse items={collap} /> */}

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
                            dataSource={personalAccount?.profiles?.map(item => item.email)}
                            renderItem={item => (
                                <List.Item>
                                    <Typography.Text>{item}</Typography.Text>
                                </List.Item>
                            )}
                        />

                    </Drawer>
                </div>
            }
        </Container>
    )
}
