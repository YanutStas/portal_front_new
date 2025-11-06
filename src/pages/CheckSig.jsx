import { Button, Form, Upload } from 'antd'
import React from 'react'
import checkSig from '../lib/checkSig'

export default function CheckSig() {
    const onFinish = (val) => {
        checkSig(val)
    }

    return (
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
    )
}
