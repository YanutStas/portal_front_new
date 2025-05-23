import { Button, Collapse, Descriptions, Divider, Drawer, Flex, theme, Typography } from 'antd';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import CardClaim from '../Claims/CardClaim';

export default function Lk() {
    const [openDrawer, setOpenDrawer] = useState(false)
    const [lk, setLk] = useState(null)
    const [listClaims, setListClaims] = useState(null)
    const [listCompletedClaims, setListCompletedClaims] = useState(null)
    const { token } = theme.useToken();
    useEffect(() => {
        setLk({
            name: "ООО Красный октябрь",
            inn: "7856942776",
            kpp: "5661668766"
        })
        setListClaims([
            {
                Ref_Key: "c416e302-98df-11ef-9501-5ef3fcb042f8",
                number: "000000110",
                date: "2024-11-02T09:00:32",
                service: {
                    description: "Описание услуги"
                }
            },
            {
                Ref_Key: "c416e302-98df-11ef-9501-5ef3fcb042f9",
                number: "000000111",
                date: "2024-12-12T10:56:32",
                service: {
                    description: "Описание услуги №2"
                }
            }
        ])
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
            children: <Flex gap={10} style={{ marginBottom: 10 }}>{listCompletedClaims && listCompletedClaims.map((item, index) => <CardClaim item={item} key={index} borderColor={"red"}/>)}</Flex>,
        },
    ]
    console.log(token)
    const { id } = useParams();
    return (
        <div>
            <Typography.Title style={{ margin: 0 }}>{lk?.name}</Typography.Title>
            <Flex gap={10} style={{ marginBottom: 10 }}>

                {lk?.inn &&
                    <Typography.Text style={{ color: token.colorTextDescription }}>ИНН:{lk?.inn}</Typography.Text>
                }
                {lk?.kpp &&
                    <Typography.Text style={{ color: token.colorTextDescription }}>КПП:{lk?.kpp}</Typography.Text>
                }
            </Flex>

            <Button onClick={() => { setOpenDrawer(true) }}>Подробнее о компании</Button>
            <Divider orientation='left'>В работе</Divider>
            <Flex wrap={"wrap"} gap={20} style={{ marginTop: 20, marginBottom: 20 }}>
                {listClaims && listClaims.map((item, index) =>
                    <CardClaim item={item} key={index} />)}
            </Flex>
            <Collapse items={collap} />

            <Drawer
                title={lk?.name}
                open={openDrawer}
                onClose={() => { setOpenDrawer(false) }}
            >
                <Typography.Paragraph>
                    Подробная информация о заявителе
                    включая файлы со сканами документов
                    по заявителю.
                </Typography.Paragraph>
                <Typography.Paragraph>
                    И показать представителей, которые имеют
                    доступ к этому заявителю
                </Typography.Paragraph>

            </Drawer>
        </div>
    )
}
