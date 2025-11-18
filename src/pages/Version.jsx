import { Descriptions, Flex, List, Typography } from 'antd';
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import moment from 'moment';
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
            {version &&
                <>
                    <Typography.Title>Текущая версия: {version.data.current?.number}</Typography.Title>
                    <Typography.Paragraph>{version.data.current?.comment}</Typography.Paragraph>
                    <List
                        // header={<div>Header</div>}
                        // footer={<div>Footer</div>}
                        bordered
                        dataSource={version.data.versions}
                        renderItem={item => (
                            <List.Item>
                                <Flex vertical gap={10}>

                                <Descriptions  items={[
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
            }
        </div>
    )
}
