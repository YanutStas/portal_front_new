import { Card, Descriptions, Flex, Tag, Typography, theme } from "antd";
import moment from "moment";
import { CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined, FileTextOutlined, InfoCircleOutlined, LoadingOutlined, SyncOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

export default function LineClaim({ item, borderColor, state = false }) {
    // console.log("item", item);
    const { token } = theme.useToken();
    if (item.number == 7) console.log("state 7", state);

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
                    <Flex vertical gap={10}>
                        <Flex><Typography.Text strong>Заявка №{item.number} от {moment(item.date).format("DD.MM.YYYY HH.mm")}</Typography.Text></Flex>
                        <Flex><Descriptions items={[
                            {
                                key: "По услуге",
                                label: "По услуге",
                                children: item.service?.description
                            }
                        ]} /></Flex>
                        <Flex wrap={"wrap"} gap={10} align="center">
                            {state &&
                                <div style={{ borderRadius: 10, bottom: 5, right: 5 }}>
                                    {state === "inAction" && <SyncOutlined style={{ color: item.color || "blue", fontSize: 30 }} />}
                                    {state === "noAction" && <CloseCircleOutlined style={{ color: item.color || "red", fontSize: 30 }} />}
                                    {state === "completed" && <CheckCircleOutlined style={{ color: item.color || "#52c41a", fontSize: 30 }} />}
                                </div>}
                            <Tag style={{ marginRight: 2, whiteSpace: "normal" }} color="geekblue">{item.currentStatus?.label}</Tag> от {moment(item.currentStatus?.date).format("DD.MM.YYYY HH.mm")}
                        </Flex>

                    </Flex>
                </Card>
            </Link>
        </>
    )
}