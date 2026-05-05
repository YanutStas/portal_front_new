import { Badge, Button, Card, Collapse, ConfigProvider, Drawer, Flex, Modal, Radio, Tag, Timeline, Tree, Typography, theme } from 'antd'
import React, { useEffect, useState } from 'react'
import { CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined, FileTextOutlined, InfoCircleOutlined, LikeOutlined, DownloadOutlined, FileUnknownOutlined } from "@ant-design/icons";
import { color } from 'framer-motion';
import moment from 'moment';
import ActionItem from '../../../../components/Cabinet/Action/ActionItem';
import useClaims from "../../../../stores/Cabinet/useClaims";
import TaskItem from '../../../../components/Cabinet/Action/TaskItem';
import FileForDownload from '../../../../components/FileForDownload';
import Preloader from '../../../../components/Main/Preloader';
import MarkDownText from '../../../../components/MarkDownText/MarkDownText';
import ImagePublic from '../../../../components/ImagePublic';


function GetCards({ item, claimId, versionId, reloadClaim }) {
  const [openModalAction, setOpenModalAction] = useState(false)
  let actions = undefined
  if (item.type === "file") {
    actions = [<DownloadOutlined onClick={() => { }} />, <FileUnknownOutlined />]
  }

  return (
    <>
      <Card
        styles={{
          body: {
            // backgroundColor: item.style?.backgroundСolor,
            padding: 10
          },
          root: {

            flex: 1,
            maxWidth: "100%"
          }
        }}
        style={{
          // borderColor: "gray", 
        }}
      // actions={actions}
      >
        {/* Если это файл то ... */}
        {(item.type === "file" || item.type === "sign") &&
          <FileForDownload
            type={item.component?.ext}
            name={item.component?.name}
            id={item.component?.id}
            size={item.component?.size}
            sig={item.type === "sign"}
            idDocForCheckSig={item.component?.baseFile?.id}
            date={item.component?.date}
            img={<>{item.style?.picture?.id && <div style={{ width: 30, height: 30 }}><ImagePublic img={item.style?.picture} /></div>}</>}
          />}

        {/* Если это все остальное ... */}
        {(item.type !== "file" && item.type !== "task"&& item.type !== "sign") && <Flex gap={5}>
          <>{item.style?.picture?.id && <div style={{ width: 30, height: 30 }}><ImagePublic img={item.style?.picture} /></div>}</>
          <Flex vertical >
            <Flex
              align='center'
              gap={5}
              wrap="wrap"
              style={{
                // color: item.style?.textСolor 
                maxWidth: "100%"
              }}
            >
              <Typography.Text style={{ fontSize: 16, whiteSpace: "balance" }}>{item.component?.name || item.component?.currentStatus?.label}</Typography.Text>
              {(item.component?.shortDescription || item.component?.currentStatus?.label) && <Tag variant='outlined' color={item.style?.textСolor || "magenta"}>{item.component?.shortDescription || item.component?.currentStatus?.label}</Tag>}
            </Flex>
            <Typography.Text type="secondary">{item.component?.date && moment(item.component?.date).format('DD.MM.YYYY HH:mm')}</Typography.Text>
          </Flex>
        </Flex>
          //   <Card.Meta
          //   avatar={<>{item.style?.picture?.id && <ImagePublic img={item.style?.picture} />}</>}
          //   title={
          //     <Flex
          //       align='center'
          //       gap={5}
          //       wrap="wrap"
          //       style={{
          //         // color: item.style?.textСolor 
          //         maxWidth: "100%"
          //       }}
          //     >
          //       <Typography.Text style={{ fontSize: 16, whiteSpace: "balance" }}>{item.component?.name || item.component?.currentStatus?.label}</Typography.Text>
          //       {(item.component?.shortDescription || item.component?.currentStatus?.label) && <Tag variant='outlined' color={item.style?.textСolor || "magenta"}>{item.component?.shortDescription || item.component?.currentStatus?.label}</Tag>}
          //     </Flex>}
          //   description={item.component?.date && moment(item.component?.date).format('DD.MM.YYYY HH:mm')}
          //   styles={{
          //     title: {
          //       marginBottom: 0
          //     },
          //     root: {
          //       maxWidth: "100%"
          //     }
          //   }}

          // />
        }

        {/* Если это задача с типом ПЛАН ... */}
        {item.type === "task" && item.component.type === "plan" &&
          <Button type='primary' style={{ marginTop: 10, fontSize: 16 }} onClick={() => {
            setOpenModalAction({ id: item.component.id, title: item.component.label, taskBasis: item.component.taskBasis, buttonText: item.component.buttonText })
          }}>{item.component.label}</Button>}

        {/* Если есть описание карточки ... */}
        {(item.component?.description || item.component?.currentStatus?.description) && <Typography.Paragraph>{item.component?.description || item.component?.currentStatus?.description}</Typography.Paragraph>}
      </Card>
      {openModalAction &&
        <ActionItem
          title={openModalAction.title}
          open={!!openModalAction}
          actionId={openModalAction.id}
          claimId={claimId}
          versionId={versionId}
          buttonText={openModalAction.buttonText}
          taskBasis={openModalAction.taskBasis}
          onCancel={() => {
            setOpenModalAction(false)
            reloadClaim()
          }}
        />
      }
    </>
  )
}
function GetNeighbors({ neighbors, claimId, versionId, reloadClaim }) {
  return (
    <>
      {neighbors?.map((item, index) => (<GetCards key={index} item={item} claimId={claimId} versionId={versionId} reloadClaim={reloadClaim} />))}
    </>
  )
}

function GetChildren({ childrenArr, level, claimId, versionId, reloadClaim }) {
  return <Flex
    vertical
    gap={10}
    style={{ marginLeft: 15 * level - 15 }}
  >
    {childrenArr?.map((item, index) =>
      <Flex vertical gap={10} key={index}>
        <Flex gap={3} align='stretch' wrap='wrap' justify='stretch' style={{ width: "100%" }}>
          <GetCards item={item} claimId={claimId} versionId={versionId} reloadClaim={reloadClaim} />
          {item.neighbors && <GetNeighbors neighbors={item.neighbors} claimId={claimId} versionId={versionId} reloadClaim={reloadClaim} />}
        </Flex>
        {item.children && <GetChildren childrenArr={item.children} level={level + 1} claimId={claimId} versionId={versionId} reloadClaim={reloadClaim} />}
      </Flex>
    )}
  </Flex>
}
// const selectElement = (step, index) => {
//   if (step.type === "step") {
//   }
// }


function processTreeData(data) {
  // Счетчик для генерации уникальных ключей
  let uniqueKeyCounter = 0;
  const defaultExpandedKeys = []

  /**
   * Рекурсивная функция обработки одного узла
   */
  function traverse(node) {
    if (!node || typeof node !== 'object') return;

    // 1. Добавляем/обновляем свойства для текущего узла
    // Если component существует, берем имя, иначе пустая строка
    const name = (node.component && node.component.name) ? node.component.name : (node.component && node.component.currentStatus && node.component.currentStatus.label) ? node.component.currentStatus.label : '';
    if (node.component?.state === "inAction") defaultExpandedKeys.push(uniqueKeyCounter)
    node.title = <Flex gap={10} align='center' wrap='wrap'>
      <Card
        styles={{
          body: {
            backgroundColor: node.style?.backgroundСolor,
            padding: 5
          }
        }}
        style={{ borderColor: "gray" }} >
        <Card.Meta title={<Flex gap={10} align='center'>{node.style?.picture?.id && <ImagePublic img={node.style?.picture} />}<span style={{ color: node.style?.textСolor }}>{name}</span></Flex>} />
      </Card>
      {node.neighbors && node.neighbors.map((item, index) => <Card
        key={index}
        styles={{
          body: {
            backgroundColor: item.style?.backgroundСolor,
            padding: 5
          }
        }}
        style={{ borderColor: "gray" }} >
        <Card.Meta title={<Flex gap={10} align='center'>{item.style?.picture?.id && <ImagePublic img={item.style?.picture} />}<span style={{ color: node.style?.textСolor }}>{item.component?.name || item.component?.currentStatus?.label}</span></Flex>} />
      </Card>)}
    </Flex>


    // Генерируем уникальный ключ. 
    // Можно использовать просто счетчик или комбинацию: `${node.type}_${node.component?.id}_${uniqueKeyCounter++}`
    node.key = `key_${uniqueKeyCounter++}`;

    // 2. Если есть массив children, проходим по нему рекурсивно
    if (Array.isArray(node.children)) {
      node.children.forEach(child => {
        traverse(child);
      });
    }
  }

  // Запускаем обработку для каждого элемента корневого массива
  if (Array.isArray(data)) {
    data.forEach(item => {
      traverse(item);
    });
  }

  return { data, defaultExpandedKeys };
}


export default function StepsClaim({ claimId, versionId, reloadClaim, activeProcessTrees }) {

  const [steps, setSteps] = useState({})

  const [loadingSteps, setLoadingSteps] = useState(false)
  // const fetchClaimItem = useClaims((state) => state.fetchClaimItem);
  const loadingDataByClaim = useClaims((state) => state.loadingDataByClaim);
  const fetchDataByClaim = useClaims((state) => state.fetchDataByClaim);
  const token = theme.useToken().token
  // console.log(token)
  const [changeSteps, setChangeSteps] = useState([])
  const [openDrawer, setOpenDrawer] = useState(null)

  const [openModalTask, setOpenModalTask] = useState(false)
  const [reload, setReload] = useState(false)

  async function fetchSteps() {
    try {
      setLoadingSteps(true)
      setSteps((await fetchDataByClaim(claimId, "steps", activeProcessTrees))?.steps)
      setLoadingSteps(false)
    } catch (error) {
      console.log('Проблемы загрузки steps')
    }
  }
  useEffect(() => {
    fetchSteps()
  }, [reload, activeProcessTrees])
  useEffect(() => {
    if (steps) {
      setChangeSteps(processTreeData(steps.items))
      // console.log("changeSteps", changeSteps);
    }

  }, [steps])
  const handlerOpenDrawer = (title, content) => {
    setOpenDrawer({
      title,
      content
    })
  }
  const handlerCloseDrawer = () => {
    setOpenDrawer(null)
  }
  if (loadingSteps) {
    return <Preloader />
  }


  console.log("steps", steps);
  return (
    <>
      {steps && steps?.items &&
        <Collapse defaultActiveKey={[steps?.items?.findIndex(item => item.component.current)]} items={steps?.items?.map((item, index) => ({
          key: index,
          label: <Flex align='center' gap={5}>{item.style?.picture?.id && <ImagePublic img={item.style?.picture} />}{item.component?.name}{item.children?.length && <span style={{ color: "gray" }}>({item.children?.length})</span>}</Flex>,
          children: <GetChildren childrenArr={item.children} level={1} claimId={claimId} versionId={versionId} reloadClaim={reloadClaim} />,
          styles: {
            header: {
              // backgroundColor: item.style?.backgroundСolor,
            },
          }
        }))} />
        // <Tree
        //   selectable={false}
        //   showLine={<p>234</p>}
        //   treeData={changeSteps.data}
        //   defaultExpandedKeys={changeSteps.defaultExpandedKeys}
        //   styles={{
        //     itemIcon: {
        //       color: 'red'
        //     }
        //   }}
        // />

      }
    </>
  )
}
