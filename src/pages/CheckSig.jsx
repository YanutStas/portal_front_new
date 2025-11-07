import { Button, Descriptions, Form, Typography, Upload } from 'antd'
import React, { useEffect, useState } from 'react'
import checkSig from '../lib/checkSig'

export default function CheckSig() {
    const [dataList, setDataList] = useState(false);
    const [cmsList, setCmsList] = useState(false);
    const [chekingValue, setChekingValue] = useState(false)
    const onFinish = async () => {
        setChekingValue(await checkSig({
            data: dataList,
            cms: cmsList
        }))
    }
    useEffect(() => {
        console.log(dataList);

    }, [dataList])
    console.log(chekingValue);

    return (
        <>
            <Form onFinish={onFinish}>
                <Form.Item
                    name={"data"}
                    label="Документ"
                >
                    <Upload
                        beforeUpload={(data) => {
                            setDataList(data);
                            return false
                        }}
                        maxCount={1}
                    >
                        <Button>Click to upload</Button>
                    </Upload>
                </Form.Item>
                <Form.Item
                    name={"cms"}
                    label="Подпись"
                >
                    <Upload
                        beforeUpload={(cms) => {
                            setCmsList(cms);
                            return false
                        }}
                        maxCount={1}
                    >
                        <Button>Click to upload</Button>
                    </Upload>
                </Form.Item>
                <Button htmlType='submit'>Проверить</Button>
            </Form>

            {chekingValue &&
                <Descriptions style={{ marginTop: 20 }} items={[
                    {
                        key: '1',
                        label: 'Действительность',
                        children: <span style={{ color: chekingValue.isValid ? "green" : "red" }}>{chekingValue.resultText}</span>,
                    },
                    {
                        key: '2',
                        label: 'Дата отчета',
                        children: <span>{chekingValue.reportDate}</span>,
                    },
                ]} />
            }
            { chekingValue === null &&
                <Typography.Title style={{color:"red"}} level={5}>Входные данные не являются подписанным сообщением!</Typography.Title>
            }
        </>
    )
}
