import { Button, Descriptions, Form, Typography, Upload } from 'antd'
import React, { useEffect, useState } from 'react'
import checkSig from '../lib/checkSig'
import moment from 'moment';

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
                        <Button>Выбрать файл</Button>
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
                        <Button>Выбрать файл</Button>
                    </Upload>
                </Form.Item>
                <Button htmlType='submit' type='primary'>Проверить</Button>
            </Form>

            {chekingValue &&
                <Descriptions column={1} style={{ marginTop: 20 }} items={[
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
                    {
                        key: '3',
                        label: 'Издатель сертификата',
                        children: <span >{chekingValue.signatures[0].cert.issuer}</span>,
                    },
                    {
                        key: '4',
                        label: 'Владелец сертификата',
                        children: <span>{chekingValue.signatures[0].cert.subject}</span>,
                    },
                    {
                        key: '5',
                        label: 'Серийный номер',
                        children: <span>{chekingValue.signatures[0].cert.serial}</span>,
                    },
                    {
                        key: '56',
                        label: 'Действует',
                        children: <span>с {moment(chekingValue.signatures[0].cert.notBefore).format('DD.MM.YYYY')} по {moment(chekingValue.signatures[0].cert.notAfter).format('DD.MM.YYYY')}</span>,
                    },
                    {
                        key: '7',
                        label: 'Срок действия ключа подписи',
                        children: <span>с {moment(chekingValue.signatures[0].cert.pkeyNotBefore).format('DD.MM.YYYY')} по {moment(chekingValue.signatures[0].cert.pkeyNotAfter).format('DD.MM.YYYY')}</span>,
                    },
                ]} />
            }
            {chekingValue === null &&
                <Typography.Title style={{ color: "red" }} level={5}>Входные данные не являются подписанным сообщением!</Typography.Title>
            }
        </>
    )
}
