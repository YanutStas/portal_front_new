import { Skeleton } from 'antd'
import Title from 'antd/es/typography/Title'
import React from 'react'
import AppHelmet from '../../../components/Global/AppHelmet'

export default function Checking() {
  return (
    <div>
      <AppHelmet title={"На проверке"} desc={"Заявки на проверке"} />
        <Title level={1}>Заявки на проверке</Title>
        
        <Skeleton active  paragraph={{ rows: 2}} />
        <Skeleton active  paragraph={{ rows: 2}} />
        <Skeleton active  paragraph={{ rows: 2}} />
        <Skeleton active  paragraph={{ rows: 2}} />
    </div>
  )
}
