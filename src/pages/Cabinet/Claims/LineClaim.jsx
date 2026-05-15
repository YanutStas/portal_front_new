import { Badge, Card, Descriptions, Flex, Tag, Typography, theme } from "antd";
import moment from "moment";
import { CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined, FileTextOutlined, InfoCircleOutlined, LoadingOutlined, SyncOutlined, FileSearchOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

export default function LineClaim({ item, borderColor, state = false }) {
    // console.log("item", item);
    const { token } = theme.useToken();


    return (
        <>
            <Link
                to={`/cabinet/claimers/${item.Ref_Key}`}
            // className={styles.styleLink}
            >

                <Card
                    hoverable
                    styles={{
                        root: {
                            width: "100%",
                            border: `1px solid ${borderColor ? borderColor : token.colorPrimary}`,

                        }
                    }}>
                    {/* <Card.Meta
                        title={`Заявка №${item.number}`}
                        description={`от ${moment(item.date).format("DD.MM.YYYY HH.mm")}`}
                    /> */}
                    <Flex vertical gap={10}>
                        <Flex gap={5}><Typography.Text strong>Заявка №{item.number}</Typography.Text><Typography.Text type="secondary">от {moment(item.date).format("DD.MM.YYYY HH.mm")}</Typography.Text></Flex>
                        <Flex><Descriptions items={[
                            {
                                key: "По услуге",
                                label: "По услуге",
                                children: item.service?.description
                            }
                        ]} /></Flex>
                        {(item.countAppeals > 0 || item.countTasks > 0) && <div style={{ position: "absolute", borderRadius: 10, top: -5, right: -5 }}><Badge count={(Number(item.countAppeals) || 0) + (Number(item.countTasks) || 0)} showZero /></div>}
                        <Flex wrap={"wrap"} gap={5} align="center">
                            {state &&
                                <div style={{ borderRadius: 10, bottom: 5, right: 5 }}>
                                    {state === "new" && <FileSearchOutlined style={{ color: item.color || token.colorPrimary, fontSize: 30 }} />}
                                    {state === "inAction" && <SyncOutlined style={{ color: item.color || token.colorPrimary, fontSize: 30 }} />}
                                    {state === "noAction" && <CloseCircleOutlined style={{ color: item.color || token.colorError, fontSize: 30 }} />}
                                    {state === "completed" && <CheckCircleOutlined style={{ color: item.color || token.colorSuccess, fontSize: 30 }} />}
                                </div>}
                            <Tag style={{ marginRight: 2, whiteSpace: "normal" }} color="geekblue">{item.currentStatus?.label}</Tag> <Typography.Text type="secondary">{moment(item.currentStatus?.date).format("DD.MM.YYYY HH.mm")}</Typography.Text>
                        </Flex>

                    </Flex>
                </Card>
            </Link>
        </>
    )
}