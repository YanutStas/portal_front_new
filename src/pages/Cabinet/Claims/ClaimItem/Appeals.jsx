import React from 'react'
import { Card, Divider, Typography, theme, Button, Flex, Tag } from 'antd'
import Meta from 'antd/es/card/Meta'
import moment from 'moment'
const appeals = [
    {
        number: "123",
        question: "Хочу изменить фамилию заявителя с Васильченка на Васильченко",
        question_datetime: "2024-11-28 10:42",
        answer: 'Произвели изменения фамилии заявителя на Васильченко',
        answer_datetime: "2024-11-29 11:06"
    },
    {
        number: "124",
        question: "Когда заявка проверится",
        question_datetime: "2024-11-29 12:21",
        answer: 'Срок проверки заявки состовляет 2 рабочих дня',
        answer_datetime: "2024-11-29 16:33"
    },
    {
        number: "125",
        question: "Можно ли подписать договор с помощью госуслуг",
        question_datetime: "2024-12-05 09:53",
        // answer: 'Да, Вы можете подписать договор с помощью ЭЦП от госуслуг',
        // answer_datetime: "2024-12-06 10:42"
    },
]
export default function Appeals() {
    const token = theme.useToken().token
    // console.log(token);

    return (
        <div>
            {appeals.map((item, index) =>

                <Card
                    key={index}
                    title={`Обращение №${item.number}`}
                    style={{ maxWidth: "100%", marginBottom: 20, border: `1px solid ${token.colorIcon}` }}
                    styles={{
                        body: {
                            padding: 0
                        }
                    }}
                    extra={item.answer ? <Tag color="green">Отвечено</Tag> : <Tag color="blue">В обработке</Tag>}
                >
                    <Flex vertical>
                        <div style={{ padding: 10, paddingLeft: 24 }}>
                            <Typography.Title level={5} style={{ marginTop: 0 }}>Вопрос:</Typography.Title>
                            <Typography.Paragraph>{item.question}</Typography.Paragraph>
                            <Meta description={moment(item.question_datetime).format('DD.MM.YYYY hh:mm')} />
                        </div>
                        {item.answer &&
                            <div style={{ padding: 10, paddingLeft: 24, backgroundColor: "rgba(0,255,0,.4)" }}>
                                <Typography.Title level={5} style={{ marginTop: 0 }}>Ответ:</Typography.Title>
                                <Typography.Paragraph>{item.answer}</Typography.Paragraph>
                                <Meta description={moment(item.answer_datetime).format('DD.MM.YYYY hh:mm')} />
                            </div>
                        }
                    </Flex>
                </Card>

            )}
            <Button type='primary'>Подать обращение</Button>
        </div>
    )
}
