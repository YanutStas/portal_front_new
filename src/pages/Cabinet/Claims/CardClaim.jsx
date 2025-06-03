import { Card, Descriptions, Flex, Tag, theme, Typography } from 'antd'
import React from 'react'
import { Link } from 'react-router-dom'
import styles from "./Claimers/Claimers.module.css";
import moment from 'moment';
export default function CardClaim({ item, borderColor }) {
    const { token } = theme.useToken();
    return (
        <Link
            to={`/cabinet/claimers/${item.Ref_Key}`}
            className={styles.styleLink}
        >
            <Card
                className={styles.styleCard}
                hoverable
                title={<Flex wrap={"wrap"} align="center" justify="space-between">
                    <Typography.Text>Заявка №{item.number}</Typography.Text>
                    <div><Typography.Text style={{ color: token.colorTextDescription }}>от: </Typography.Text><Typography.Text>{moment(item.date).format('DD.MM.YYYY HH:mm')}</Typography.Text></div>
                </Flex>}
                style={{
                    border: `1px solid ${borderColor ? borderColor : token.colorPrimary}`,
                    position: "relative"
                    // background: "linear-gradient(00deg, rgba(0,97,170,.1) 0%, rgba(255,255,255,0) 30%)",
                }}
            // extra={<div><Typography.Text style={{ color: token.colorTextDescription }}>От: </Typography.Text><Typography.Text>{moment(item.create).format('DD.MM.YYYY HH:mm')}</Typography.Text></div>}

            >
                <Descriptions column={1}>
                    {/* <Descriptions.Item label="Создана">
                        {moment(item.date).format('DD.MM.YYYY HH:mm')}
                      </Descriptions.Item> */}
                    <Descriptions.Item label="По услуге">
                        {item.service.description}
                    </Descriptions.Item>
                </Descriptions>
                {item.currentStatus?.label && <Tag style={{ position: "absolute", bottom: 10, right: 10 }} color="geekblue">{item.currentStatus.label}</Tag>}
            </Card>
        </Link>
    )
}
