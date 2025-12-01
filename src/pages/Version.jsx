import { Card, Descriptions, Flex, List, Tabs, Typography, theme } from 'antd';
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import moment from 'moment';
import front from '../version.json'
const backServer = import.meta.env.VITE_BACK_BACK_SERVER;

export default function Version() {
    const token = theme.useToken().token
    const [version, setVersion] = useState(false);
    useEffect(() => {
        const fetchVersion = async () => {
            try {
                const response = await axios.get(`${backServer}/api/version`);
                setVersion(response.data);
            } catch (error) {
                console.error("Ошибка при получении версий:", error);
            }
        };
        fetchVersion();
    }, []);

    // console.log(token);

    return (
        <div>
            <Tabs items={[{
                key: "1",
                label: "Backend",
                children: version &&
                    <Flex vertical gap={5}>
                        {version.data.versions.map((item, index) => (
                            <Card style={{ backgroundColor: index === 0 ? token.colorPrimaryBg : undefined }}>
                                <Descriptions
                                    style={{ marginBottom: 10 }}
                                    items={[
                                        {
                                            key: "1",
                                            label: "Номер",
                                            children: item.number,
                                        },
                                        {
                                            key: "2",
                                            label: "Дата",
                                            children: moment(item.date).format('DD.MM.YYYY HH:mm'),
                                        },

                                    ]}


                                />
                                <Typography.Paragraph>{item.comment}</Typography.Paragraph>
                            </Card>

                        ))}
                    </Flex>


            },
            {
                key: "2",
                label: "Frontend",
                children:                 <Flex vertical gap={5}>
                            {front.map((item, index) => (
                                <Card style={{ backgroundColor: index === 0 ? token.colorPrimaryBg : undefined }}>
                                    <Descriptions
                                    style={{marginBottom:10}}
                                        items={[
                                            {
                                                key: "1",
                                                label: "Номер",
                                                children: item.version,
                                            },
                                            {
                                                key: "2",
                                                label: "Дата",
                                                children: item.date,
                                            },

                                        ]}


                                    />
                                    <Typography.Paragraph>{item.comment}</Typography.Paragraph>
                                </Card>

                            ))}
                        </Flex>
                
            }
            ]} />

        </div>
    )
}
