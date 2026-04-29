import { Badge, Button, Card, Collapse, ConfigProvider, Drawer, Flex, Modal, Radio, Tag, Timeline, Tree, Typography, theme } from 'antd'
import React, { useEffect, useState } from 'react'
import { CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined, FileTextOutlined, InfoCircleOutlined, LikeOutlined } from "@ant-design/icons";
import { color } from 'framer-motion';
import moment from 'moment';
import ActionItem from '../../../../components/Cabinet/Action/ActionItem';
import useClaims from "../../../../stores/Cabinet/useClaims";
import TaskItem from '../../../../components/Cabinet/Action/TaskItem';
import FileForDownload from '../../../../components/FileForDownload';
import Preloader from '../../../../components/Main/Preloader';
import MarkDownText from '../../../../components/MarkDownText/MarkDownText';
import ImagePublic from '../../../../components/ImagePublic';


function getCards(item) {
  return (
    <Card
      styles={{
        body: {
          // backgroundColor: item.style?.backgroundСolor,
          padding: 10
        }
      }}
      style={{
        // borderColor: "gray", 
        flex: 1
      }}
    >
      <Card.Meta
        avatar={<>{item.style?.picture?.id && <ImagePublic img={item.style?.picture} />}</>}
        title={
          <Flex
            align='center'
            gap={5}
          // style={{ color: item.style?.textСolor }}
          >
            {item.component?.name || item.component?.currentStatus?.label}
          </Flex>}
        description={item.component?.date && moment(item.component?.date).format('DD.MM.YYYY HH:mm')}
        styles={{
          title: {
            color: 'red'
          }
        }}
      />
    </Card>
  )
}
function getNeighbors(neighboard) {
  return (
    <>
      {neighboard?.map(item => (getCards(item)))}
    </>
  )
}

function getChildren(children, level) {
  return <Flex
    vertical
    gap={10}
    style={{ marginLeft: 15 * level }}
  >
    {children?.map(item =>
      <>
        <Flex gap={0} align='center' wrap='wrap' justify='stretch' style={{ width: "100%" }}>
          {getCards(item)}
          {item.neighbors && getNeighbors(item.neighbors)}
        </Flex>
        {item.children && getChildren(item.children, level + 1)}
      </>
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
      {node.neighbors && node.neighbors.map(item => <Card
        styles={{
          body: {
            backgroundColor: item.style?.backgroundСolor,
            padding: 5
          }
        }}
        style={{ borderColor: "gray" }} >
        <Card.Meta title={<Flex gap={10} align='center'>{item.style?.picture?.id && <ImagePublic img={item.style?.picture} />}<span style={{ color: node.style?.textСolor }}>{item.component.name || item.component.currentStatus.label}</span></Flex>} />
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


export default function StepsClaim({ steps = false, claimId, versionId, reloadClaim }) {

  console.log("steps", steps);

  // const fetchClaimItem = useClaims((state) => state.fetchClaimItem);
  const loadingDataByClaim = useClaims((state) => state.loadingDataByClaim);
  const fetchDataByClaim = useClaims((state) => state.fetchDataByClaim);
  const token = theme.useToken().token
  // console.log(token)
  const [changeSteps, setChangeSteps] = useState([])
  const [openDrawer, setOpenDrawer] = useState(null)
  const [openModalAction, setOpenModalAction] = useState(false)
  const [openModalTask, setOpenModalTask] = useState(false)
  const [reload, setReload] = useState(false)
  useEffect(() => {
    fetchDataByClaim(claimId, "steps")
  }, [reload])
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
  if (loadingDataByClaim) {
    return <Preloader />
  }
  [].length

  return (
    <>
      <div style={{ marginBottom: 20 }}>
        <Radio.Group size="middle" defaultValue={steps.processTrees.find(item => item.current).id}>
          {steps.processTrees?.map((item) =>
            <Radio.Button key={item.id} value={item.id}>{item.name}</Radio.Button>
          )}

        </Radio.Group>
      </div>
      {steps &&
        <Collapse items={steps.items.map((item, index) => ({
          key: index,
          label: <Flex align='center' gap={5}>{item.style?.picture?.id && <ImagePublic img={item.style?.picture} />}{item.component?.name}{item.children?.length && <span style={{ color: "gray" }}>({item.children?.length})</span>}</Flex>,
          children: getChildren(item.children, 1),
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
