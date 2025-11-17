import { Badge, Card, Descriptions, Drawer, Flex, Tag, theme, Typography } from 'antd'
import React, { useState } from 'react'
import { FileTextOutlined } from "@ant-design/icons";
import { Link } from 'react-router-dom'
import styles from "./Claimers/Claimers.module.css";
import moment from 'moment';
import InfoDrawer from '../../../components/InfoDrawer';
import { InfoCircleOutlined } from "@ant-design/icons";
import MarkDownText from '../../../components/MarkDownText/MarkDownText';

export default function CardClaim({ item, borderColor }) {
    const { token } = theme.useToken();
    const [drawerVisible, setDrawerVisible] = useState(false);
    const showDrawer = (event) => {
        event.preventDefault()
        event.stopPropagation()
        setDrawerVisible(true)
    };
    const onClose = (event) => {
        event.preventDefault()
        event.stopPropagation()
        setDrawerVisible(false)
    }

    return (
        <>
            <Link
                to={`/cabinet/claimers/${item.Ref_Key}`}
                className={styles.styleLink}
            >
                <Card
                    // extra={<FileTextOutlined style={{ fontSize: 24, color: "gray" }} />}
                    className={styles.styleCard}
                    hoverable
                    title={<Flex wrap={"wrap"} align="center" justify="space-between">
                        <Typography.Text>Заявка №{item.number}</Typography.Text>
                        <div><Typography.Text style={{ color: token.colorTextDescription }}>от: </Typography.Text><Typography.Text>{moment(item.date).format('DD.MM.YYYY HH:mm')}</Typography.Text></div>
                    </Flex>}
                    style={{
                        border: `1px solid ${borderColor ? borderColor : token.colorPrimary}`,
                        position: "relative",
                        overflow: 'visible'
                        // background: "linear-gradient(00deg, rgba(0,97,170,.1) 0%, rgba(255,255,255,0) 30%)",
                    }}
                // extra={<div><Typography.Text style={{ color: token.colorTextDescription }}>От: </Typography.Text><Typography.Text>{moment(item.create).format('DD.MM.YYYY HH:mm')}</Typography.Text></div>}
                >
                    {(item.countAppeals > 0 || item.countTasks > 0) && <div style={{ position: "absolute", borderRadius: 10, top: -5, right: -5 }}><Badge count={(Number(item.countAppeals) || 0) + (Number(item.countTasks) || 0)} showZero /></div>}

                    <Descriptions column={1}>
                        {/* <Descriptions.Item label="Создана">
                        {moment(item.date).format('DD.MM.YYYY HH:mm')}
                        </Descriptions.Item> */}
                        <Descriptions.Item label="По услуге">
                            {item.service.description}
                        </Descriptions.Item>
                    </Descriptions>
                    {item.currentStatus?.label &&
                        <div style={{ position: "absolute", bottom: 10, right: 10 }}>
                            <Flex gap={5} wrap="wrap" align='center'>
                                <div>
                                    <Tag  style={{marginRight:2}}color="geekblue">{item.currentStatus.label}</Tag>
                                    {item.currentStatus.reason &&
                                        <InfoCircleOutlined
                                            onClick={showDrawer}
                                            style={{
                                                color: token.colorInfoText,
                                                transform: "translate(0px, -7px)",
                                            }}
                                        />
                                    }
                                </div>
                                <Typography.Text style={{ color: "gray", fontSize: 12 }}>от {moment(item.currentStatus.data).format("DD.MM.YYYY")}</Typography.Text>


                            </Flex>
                        </div>}
                </Card>
            </Link>
            <Drawer
                title={item.currentStatus.reason}
                placement="right"
                onClose={onClose}
                open={drawerVisible}
            >
                <MarkDownText>{item.currentStatus?.comment}</MarkDownText>
            </Drawer>
        </>
    )
}
