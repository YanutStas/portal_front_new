import { Card, Divider, Typography, theme } from 'antd'
import Meta from 'antd/es/card/Meta'
import moment from 'moment'
import React from 'react'
const history = [
    {
        title: "Изменение статуса",
        text: 'Статус заявки №0000987 изменился на "Заявка на проверке"',
        datetime: "2024-12-28 10:42"
    },
    {
        title: "Изменение статуса",
        text: 'Статус заявки №0000987 изменился на "Заявка принята"',
        datetime: "2025-01-09 16:24"
    },
    {
        title: "Изменение статуса",
        text: 'Статус заявки №0000987 изменился на "Подпишите и/или оплатите договор ТП"',
        datetime: "2025-01-12 12:48"
    },

]
export default function History() {
    const token = theme.useToken().token
    return (
        <div>
            {history.map((item, index) =>
                <Card
                    key={index}
                    // title={item.title}
                    style={{ maxWidth: "100%", marginBottom: 20, border: `1px solid ${token.colorIcon}` }}
                >
                    <Typography.Paragraph>{item.text}</Typography.Paragraph>
                    <Meta
                        description={moment(item.datetime).format('DD.MM.YYYY hh:mm')}
                    />
                </Card>
            )}

        </div>
    )
}
