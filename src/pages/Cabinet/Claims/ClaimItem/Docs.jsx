import React from 'react'
import Law from '../../../../components/Documentation/Law'
import FileForDownload from '../../../../components/FileForDownload'
import { Collapse, Flex, Typography, Button } from 'antd'
import moment from 'moment'
import InfoDrawer from '../../../../components/InfoDrawer'

// const docs = [
//     {
//         type: "pdf",
//         name: "Скан паспорта",
//         url: "/uploads/123.pdf",
//         size: "3343"
//     },
//     {
//         type: "pdf",
//         name: "Доверенность",
//         url: "/uploads/124.pdf",
//         size: "2343"
//     },
//     {
//         type: "pdf",
//         name: "Документ подтверждающий собственность",
//         url: "/uploads/1255.pdf",
//         size: "343"
//     },
// ]

export default function Docs({ files }) {

    const groups = files.map((item, index) => ({
        key: index,
        label: item.groupName,
        children: <Flex vertical gap={10}>
            {item.docs.map((item, index) => <Flex vertical gap={10}>
                <div>

                    <Typography.Title style={{ marginBottom: 0, marginTop: 0 }} level={4}>{item.name}</Typography.Title>
                    <Typography.Text style={{ color: "gray" }}>от: {moment(item.date).format('DD.MM.YYYY hh:mm')}</Typography.Text>
                    {item.description &&
                        <div>

                            <InfoDrawer fullDescription={item.description} button></InfoDrawer>
                        </div>
                        // <Button onClick={() => { setOpenDrawer(true) }}>Подробнее...</Button>
                    }
                </div>
                <Flex vertical gap={10}>
                    {item.docFiles.map((item, index) =>
                        <FileForDownload key={index} type={item.ext} name={item.name} id={item.id} size={item.size} />
                    )}
                </Flex>
            </Flex>)}
        </Flex>,
    }))

    return (
        <div>
            <Collapse items={groups} />
            {/* {files.map((item, index) =>
                <FileForDownload key={index} type={item.ext} name={item.name} id={item.id} size={item.size} />
            )} */}
        </div>
    )
}
