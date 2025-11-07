import { Button, Descriptions, Form, Upload } from 'antd'
import React, { useState } from 'react'
import checkSig from '../lib/checkSig'

export default function CheckSig() {
    const [chekingValue, setChekingValue] = useState(false)
    const onFinish = async (val) => {
        setChekingValue(await checkSig(val))
    }
    console.log(chekingValue);

    return (
        <>
            <Form onFinish={onFinish}>
                <Form.Item
                    name={"data"}
                    label="Документ"
                >
                    <Upload >
                        <Button>Click to upload</Button>
                    </Upload>
                </Form.Item>
                <Form.Item
                    name={"cms"}
                    label="Подпись"
                >
                    <Upload >
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
        </>
    )
}
