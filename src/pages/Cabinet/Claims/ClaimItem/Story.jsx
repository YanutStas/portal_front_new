import React from 'react'
import { Card, Divider, Typography, theme } from 'antd'
import Meta from 'antd/es/card/Meta'
import moment from 'moment'
// const history = [
//     {
//         title: "Изменение статуса",
//         text: 'Статус заявки №0000987 изменился на "Заявка на проверке"',
//         datetime: "2024-12-28 10:42"
//     },
//     {
//         title: "Изменение статуса",
//         text: 'Статус заявки №0000987 изменился на "Заявка принята"',
//         datetime: "2025-01-09 16:24"
//     },
//     {
//         title: "Изменение статуса",
//         text: 'Статус заявки №0000987 изменился на "Подпишите и/или оплатите договор ТП"',
//         datetime: "2025-01-12 12:48"
//     },

// ]
export default function History({ statuses }) {
    const token = theme.useToken().token
    // console.log("statuses", statuses);

    return (
        <div>
            {statuses && statuses.map((item, index) =>
                <Card
                    key={index}
                    // title={item.title}
                    style={{ maxWidth: "100%", marginBottom: 20, border: `1px solid ${token.colorIcon}` }}
                >
                    <Typography.Paragraph>{item.name}</Typography.Paragraph>
                    <Meta
                        description={moment(item.date).format('DD.MM.YYYY hh:mm')}
                    />
                </Card>
            )}

        </div>
    )
}
