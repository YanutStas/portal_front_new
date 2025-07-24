import { Button, ConfigProvider, Drawer, Flex, Modal, Timeline, Typography, theme } from 'antd'
import React, { useState } from 'react'
import { CheckCircleOutlined, ClockCircleOutlined, FileTextOutlined, InfoCircleOutlined, LikeOutlined } from "@ant-design/icons";
import { color } from 'framer-motion';
import moment from 'moment';
import ActionItem from '../../../../components/Cabinet/Action/ActionItem';
import useClaims from "../../../../stores/Cabinet/useClaims";
import TaskItem from '../../../../components/Cabinet/Action/TaskItem';


export default function StepsClaim({ steps = false, claimId, versionId }) {
  const fetchClaimItem = useClaims((state) => state.fetchClaimItem);
  const token = theme.useToken().token
  // console.log(token)
  const [openDrawer, setOpenDrawer] = useState(null)
  const [openModalAction, setOpenModalAction] = useState(false)
  const [openModalTask, setOpenModalTask] = useState(false)

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
    <>


      {steps &&
        <>
          <ConfigProvider
            theme={{
              token: {
                fontSize: 20
              },
              components: {
                Timeline: {
                  dotBg: token.colorBgLayout,
                  tailWidth: 3,
                  dotBorderWidth: 3
                },
              },
            }}>
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
                        {item.action && item.action.type === "plan" &&
                          <Button type='primary' style={{ marginTop: 10, fontSize: 16 }} onClick={() => {
                            // console.log(item.action.id);
                            setOpenModalAction({ id: item.action.id, title: item.action.label, taskBasis: item.action.taskBasis, buttonText: item.action.buttonText })
                          }}>{item.action.label}</Button>}
                        {item.action && item.action.type === "fact" &&
                          <Flex gap={1} align='baseline' vertical style={{ borderLeft: `4px solid ${item.action.currentStatus?.color || "#52c41a"}`, paddingLeft: 5, borderRadius: 3, marginLeft:10}}>
                            <a
                              style={{ color: "#0061aa" }}
                              onClick={() => {
                                console.log(item.action.currentStatus?.id);
                                setOpenModalTask({ id: item.action.id, title: item.action.typeAction.label, })
                              }}>{item.action.typeAction.label}</a>
                            <Typography.Text style={{ color: "gray", fontSize: 14 }}>
                              {item.action.currentStatus.label}
                            </Typography.Text>
                            <Typography.Text style={{ color: "gray", fontSize: 14 }}>
                              {moment(item.action.date).format("DD.MM.YYYY hh:mm")}
                            </Typography.Text>
                            <Typography.Text style={{ color: "gray", fontSize: 14 }}>
                              №{item.action.number}
                            </Typography.Text>
                          </Flex>
                        }
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
          </ConfigProvider>

          <Drawer
            title={openDrawer?.title}
            closable={{ 'aria-label': 'Close Button' }}
            onClose={handlerCloseDrawer}
            open={openDrawer}
          >
            {openDrawer?.content}
          </Drawer>
          <Modal
            title={openModalAction.title}
            open={!!openModalAction}
            onCancel={() => {
              setOpenModalAction(false)
              fetchClaimItem(claimId)

            }}
            footer={false}
            destroyOnClose={true}
          >
            <ActionItem
              actionId={openModalAction.id}
              claimId={claimId}
              versionId={versionId}
              buttonText={openModalAction.buttonText}
              taskBasis={openModalAction.taskBasis}
              onCancel={() => {
                setOpenModalAction(false)
              }}
            />
          </Modal>
          <Modal
            title={openModalTask.title}
            open={!!openModalTask}
            onCancel={() => {
              setOpenModalTask(false)
              // fetchClaimItem(claimId)
            }}
            footer={false}
            destroyOnClose={true}
          >
            <TaskItem
              taskId={openModalTask.id}
              // claimId={claimId}
              // versionId={versionId}
              // buttonText={openModalAction.buttonText}
              // taskBasis={openModalAction.taskBasis}
              onCancel={() => {
                setOpenModalTask(false)
              }}
            />
          </Modal>
        </>
      }
      {!steps &&
        <Typography.Text>Информация по этапам отсутствует</Typography.Text>
      }
    </>
  )
}
