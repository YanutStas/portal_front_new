import { Button, ConfigProvider, Drawer, Flex, Timeline, Typography, theme } from 'antd'
import React, { useState } from 'react'
import { CheckCircleOutlined, ClockCircleOutlined, FileTextOutlined, InfoCircleOutlined, LikeOutlined } from "@ant-design/icons";
import { color } from 'framer-motion';
import moment from 'moment';


export default function StepsClaim({ steps = false }) {
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
            dotBg: token.colorBgLayout,
            tailWidth:3,
            dotBorderWidth:3
          },
        },
      }}>


      {steps &&
        <>
          <Timeline
            style={{ fontSize: 30, marginTop: 10 }}
            // mode='alternate'
            items={steps.map(item => {
              if (item.type === "status" || item.type === "statua") {
                return {
                  children: <div style={{ position: "relative" }}>
                    <Flex vertical justify='center' align='flex-start' style={{ marginBottom: 10, marginLeft: 5 }}>
                      <Typography.Text style={{ color: "gray", fontSize: 14 }}>{moment(item.date).format('DD.MM.YYYY hh:mm')}</Typography.Text>
                      <Flex gap={5}>
                        <Typography.Text style={{ fontSize: 18 }}>{item.name}</Typography.Text>
                        {item.description && <InfoCircleOutlined style={{ marginBottom: 10, fontSize: 14, color: "gray" }} onClick={() => { handlerOpenDrawer(item.name, item.description) }} />}
                      </Flex>
                      {item.action &&
                        <Button type='primary' style={{ marginTop: 10, fontSize: 16 }} onClick={() => {
                          console.log(item.action.id);
                        }}>{item.action.label}</Button>}
                    </Flex>
                    <div style={{ position: "absolute", height: "100%", width: 3, borderRadius: 3, backgroundColor: item.color || "#52c41a", top: 0, left: -3 }}></div>
                  </div>,
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
                    <CheckCircleOutlined style={{ color: item.color || "#52c41a", fontSize: 30 }} /> :
                    <ClockCircleOutlined className="timeline-clock-icon" style={{ color: item.color || (item.current ? "blue" : "gray"), fontSize: 30 }} />
                }
              }
              return undefined
            })}
          />

          <Drawer
            title={openDrawer?.title}
            closable={{ 'aria-label': 'Close Button' }}
            onClose={handlerCloseDrawer}
            open={openDrawer}
          >
            {openDrawer?.content}
          </Drawer>
        </>
      }
      {!steps &&
        <Typography.Text>Информация по этапам отсутствует</Typography.Text>
      }
    </ConfigProvider>
  )
}
