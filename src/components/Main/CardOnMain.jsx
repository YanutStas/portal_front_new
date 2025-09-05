import { Image, List, theme } from 'antd'
import Paragraph from 'antd/es/typography/Paragraph'
import Title from 'antd/es/typography/Title'
import Text from 'antd/es/typography/Text'
import React from 'react'
import { Link } from 'react-router-dom'
import styles from './CardOnMain.module.css'

export default function CardOnMain({ title, url, dataList, text, color, image }) {
    const { token } = theme.useToken()
    console.log(token);

    return (
        <Link to={url}
            style={{ backgroundColor: token.colorBgContainer, borderColor: token.colorBorderSecondary }}
            className={styles.card}
        >
            <div>
                <div className={styles.titleContainer}>
                    <Text className={styles.title}>
                        {title}
                    </Text>
                </div>
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
