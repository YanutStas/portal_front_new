import { List } from 'antd'
import Paragraph from 'antd/es/typography/Paragraph'
import Title from 'antd/es/typography/Title'
import React from 'react'
import { Link } from 'react-router-dom'
import styles from './CardOnMain.module.css'

export default function CardOnMain({ title, url, dataList, text, color }) {
    return (
        <Link to={url}
         style={{ backgroundColor: color,  }}
                className={styles.card}
        >
            <div
               
            >
                <Title level={2} style={{ textAlign: "center" }}>
                    {title}
                </Title>
                {dataList &&
                    <List
                        size="small"
                        dataSource={dataList}
                        renderItem={item => <List.Item>{item}</List.Item>}
                    />
                }
                {text &&
                    <Paragraph>
                        {text}
                    </Paragraph>
                }
            </div>
        </Link>
    )
}
