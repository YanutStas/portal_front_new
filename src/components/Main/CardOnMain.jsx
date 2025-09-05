import { Image, List } from 'antd'
import Paragraph from 'antd/es/typography/Paragraph'
import Title from 'antd/es/typography/Title'
import React from 'react'
import { Link } from 'react-router-dom'
import styles from './CardOnMain.module.css'

export default function CardOnMain({ title, url, dataList, text, color, image }) {
    return (
        <Link to={url}
            style={{ backgroundColor: color, }}
            className={styles.card}
        >
            <div>
                <Title level={2} style={{ 
                    textAlign: "center",
                    // color:"rgb(227, 112, 33)" 
                    // color:"rgb(0, 97, 170)" 
                    }}>
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
                {image &&
                    <Image src={image} preview={false} />
                }
            </div>
        </Link>
    )
}
