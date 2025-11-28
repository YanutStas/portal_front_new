import { Descriptions, Flex, List, Tabs, Typography } from 'antd';
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import moment from 'moment';
import front from '../version.json'
const backServer = import.meta.env.VITE_BACK_BACK_SERVER;

export default function Version() {
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


    return (
        <div>
            <Tabs items={[{
                key: "1",
                label: "Backend",
                children: version &&
                    <>
                        <Typography.Title>Текущая версия: {version.data.current?.number}</Typography.Title>
                        <Typography.Paragraph>{version.data.current?.comment}</Typography.Paragraph>
                        <Typography.Title level={5}>Предыдущие версии</Typography.Title>
                        <List
                            // header={<div>Header</div>}
                            // footer={<div>Footer</div>}
                            bordered
                            dataSource={version.data.versions.slice(1, version.data.versions.length)}
                            renderItem={item => (
                                <List.Item>
                                    <Flex vertical gap={10}>
                                        <Descriptions items={[
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
                                        ]} />
                                        <Typography.Paragraph>{item.comment}</Typography.Paragraph>
                                    </Flex>
                                </List.Item>
                            )}
                        />
                    </>
            },
            {
                key: "2",
                label: "Frontend",
                children: <>
                    <Typography.Title>Текущая версия: {front[0]?.version}</Typography.Title>
                    <Typography.Paragraph>{front[0]?.comment}</Typography.Paragraph>
                    <Typography.Title level={5}>Предыдущие версии</Typography.Title>
                    <List
                        bordered
                        dataSource={front.slice(1, front.length)}
                        renderItem={item => (
                            <List.Item>
                                <Flex vertical gap={10}>
                                    <Descriptions items={[
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
                                    ]} />
                                    <Typography.Paragraph>{item.comment}</Typography.Paragraph>
                                </Flex>
                            </List.Item>
                        )}
                    />
                </>
            }
            ]} />

        </div>
    )
}
