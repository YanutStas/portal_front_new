import React from 'react'
import Law from '../../../../components/Documentation/Law'
import FileForDownload from '../../../../components/FileForDownload'

const docs = [
    {
        type: "pdf",
        name: "Скан паспорта",
        url: "/uploads/123.pdf",
        size: "3343"
    },
    {
        type: "pdf",
        name: "Доверенность",
        url: "/uploads/124.pdf",
        size: "2343"
    },
    {
        type: "pdf",
        name: "Документ подтверждающий собственность",
        url: "/uploads/1255.pdf",
        size: "343"
    },
]

export default function Docs() {
    return (
        <div>
            {docs.map((item, index) =>
                <FileForDownload key={index} type={item.type} name={item.name} url={item.url} size={item.size} />
            )}
        </div>
    )
}
