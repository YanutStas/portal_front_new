import { ConfigProvider, Drawer, Flex, Timeline, Typography, theme } from 'antd'
import React, { useState } from 'react'
import { CheckCircleOutlined, ClockCircleOutlined, FileTextOutlined, InfoCircleOutlined, LikeOutlined } from "@ant-design/icons";
import { color } from 'framer-motion';
import moment from 'moment';


export default function StepsClaim({ steps }) {
  const token = theme.useToken().token
  // console.log(token)
  const [openDrawer, setOpenDrawer] = useState(null)

  const handlerOpenDrawer = (title, content) => {
    setOpenDrawer({
      title,
      content
    })
  }
  const handlerCloseDrawer = () => {
    setOpenDrawer(null)
  }

  return (
    <ConfigProvider
      theme={{
        token: {
          fontSize: 20
        },
        components: {
          Timeline: {
            dotBg: token.colorBgLayout
          },
        },
      }}>

      <div style={{
        // width: "min(500px, 100%)" 
      }}>
        <Timeline
          style={{ fontSize: 30, marginTop: 10 }}
          // mode='alternate'
          items={steps.map(item => {
            if (item.type === "status") {
              return {
                children: <Flex vertical justify='center' style={{ marginBottom: 10, }}>
                  <Typography.Text style={{ color: "gray", fontSize: 14 }}>{moment(item.date).format('DD.MM.YYYY hh:mm')}</Typography.Text>
                  <Flex gap={5}>
                    <Typography.Text style={{ fontSize: 18 }}>{item.name}</Typography.Text>
                    {item.description && <InfoCircleOutlined style={{ marginBottom: 10, fontSize: 14, color: "gray" }} onClick={() => { handlerOpenDrawer(item.name, item.description) }} />}
                  </Flex>
                </Flex>,
                color: item.color || "green"
              }
            }
            if (item.type === "step") {
              return {
                children: <Flex style={{ marginBottom: 10, marginLeft: 10 }} gap={5}>
                  <Typography.Text>{item.name}</Typography.Text>
                  {item.description && <InfoCircleOutlined style={{ marginBottom: 10, fontSize: 14, color: "gray" }} onClick={() => { handlerOpenDrawer(item.name, item.description) }} />}
                </Flex>,
                dot: item.completed ?
                  <CheckCircleOutlined style={{ color: item.color || "green", fontSize: 30 }} /> :
                  <ClockCircleOutlined className="timeline-clock-icon" style={{ color: item.color || (item.current ? "blue" : "gray"), fontSize: 30 }} />
              }
            }
          })}
        />
      </div>
      <Drawer
        title={openDrawer?.title}
        closable={{ 'aria-label': 'Close Button' }}
        onClose={handlerCloseDrawer}
        open={openDrawer}
      >
        {openDrawer?.content}
      </Drawer>
    </ConfigProvider>
  )
}
