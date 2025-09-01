import React, { useEffect, useState } from 'react'
import { Card, Divider, Typography, theme, Button, Flex, Tag, Modal, Empty, TreeSelect } from 'antd'
import Meta from 'antd/es/card/Meta'
import moment from 'moment'
import useAppeals from '../../../../stores/Cabinet/useAppeals'
import Preloader from '../../../../components/Main/Preloader'
import AppealItem from '../../../../components/Cabinet/Appeal/AppealItem'
import useDataForForm from '../../../../stores/Cabinet/useDataForForm'
// const appealsByClaim = [
//     // {
//     //     number: "123",
//     //     question: "Хочу изменить фамилию заявителя с Васильченка на Васильченко",
//     //     question_datetime: "2024-11-28 10:42",
//     //     answer: 'Произвели изменения фамилии заявителя на Васильченко',
//     //     answer_datetime: "2024-11-29 11:06"
//     // },
//     // {
//     //     number: "124",
//     //     question: "Когда заявка проверится",
//     //     question_datetime: "2024-11-29 12:21",
//     //     answer: 'Срок проверки заявки состовляет 2 рабочих дня',
//     //     answer_datetime: "2024-11-29 16:33"
//     // },
//     // {
//     //     number: "125",
//     //     question: "Можно ли подписать договор с помощью госуслуг",
//     //     question_datetime: "2024-12-05 09:53",
//     //     // answer: 'Да, Вы можете подписать договор с помощью ЭЦП от госуслуг',
//     //     // answer_datetime: "2024-12-06 10:42"
//     // },
// ]

const changeData = (arr) => {
    // console.log("changeData", arr);
    arr.forEach((item, index) => {
        if (item.children) {
            arr[index].selectable = false
            // console.log("arr.children");
            changeData(item.children)
        }

    })

}
export default function Appeals({ claimId, appealsByClaim }) {
    const { setLinks, setStyles, clearDataForForm } = useDataForForm((state) => state)
    const { appeals, fetchAppealsAll, isLoadingAppeals, fetchAppealById, isLoadingAppeal, appeal, clearAppeal } = useAppeals(store => store)
    const [isOpenModalAppeals, setIsOpenModalAppeals] = useState(false)
    const [treeData, setTreeData] = useState(false)
    const [selectType, setSelectType] = useState(false)
    const token = theme.useToken().token

    useEffect(() => {
        fetchAppealsAll()
    }, [])
    useEffect(() => {
        if (appeals.length > 0) {
            changeData(appeals)
            setTreeData(appeals)
        }
    }, [appeals])
    useEffect(() => {
        if (appeal) {

            // console.log(appeal);
            setLinks(appeal.links)
            setStyles(appeal.styles)
        } else {

            // console.log("appeal пуст");
        }
    }, [appeal])

    useEffect(() => {
        // console.log(appeal);
        if (selectType) {

            fetchAppealById(selectType)
        } else {
            clearAppeal()
        }
    }, [selectType])

    const onChangeTypeAppeal = (value) => {
        // console.log(value);
        setSelectType(value)
    }
    // console.log(token);
    const closeModal = () => {
        clearAppeal()
        clearDataForForm()
        setIsOpenModalAppeals(false)
    }
    return (
        <div>
            {(!appealsByClaim || appealsByClaim.length < 1) && <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                    <Typography.Text>Нет обращений по данной заявке</Typography.Text>
                }
            />}
            {appealsByClaim && appealsByClaim.map((item, index) =>
                <Card
                    key={index}
                    title={`Обращение №${item.number}`}
                    style={{ maxWidth: "100%", marginBottom: 20, border: `1px solid ${token.colorIcon}` }}
                    styles={{
                        body: {
                            padding: 0
                        }
                    }}
                    extra={<Tag color="blue">{item.currentStatus?.label}</Tag>}
                >
                    <Flex vertical>
                        <div style={{ padding: 10, paddingLeft: 24 }}>
                            <Typography.Title level={5} style={{ marginTop: 0 }}>Вопрос:</Typography.Title>
                            <Typography.Paragraph>{item.question}</Typography.Paragraph>
                            <Meta description={moment(item.date).format('DD.MM.YYYY hh:mm')} />
                        </div>
                        {item.response &&
                            <div style={{ padding: 10, paddingLeft: 24, backgroundColor: "rgba(0,255,0,.4)" }}>
                                <Typography.Title level={5} style={{ marginTop: 0 }}>Ответ:</Typography.Title>
                                <Typography.Paragraph>{item.response}</Typography.Paragraph>
                                <Meta description={moment(item.date).format('DD.MM.YYYY hh:mm')} />
                            </div>
                        }
                    </Flex>
                </Card>

            )
            }
            <Button
                disabled={appealsByClaim?.length === 0 || appealsByClaim.reduce((accum, item) => {
                    if (item.response && item.response !== '') {                        
                        return Number(accum) + 1
                    } else {
                        console.log(item.response);
                        console.log(accum);
                        return Number(accum)
                    }
                }, 0)}
                type='primary'
                onClick={() => { setIsOpenModalAppeals(true) }}
            >Подать обращение</Button>
            <Modal
                open={isOpenModalAppeals}
                onCancel={closeModal}
                footer={false}
                title={"Подать обращение"}
                destroyOnClose={true}
                width={"80%"}
            >
                {/* <Typography.Text>Выберите тип обращения:</Typography.Text> */}
                {isLoadingAppeals && <Preloader />}
                {!isLoadingAppeals &&
                    <TreeSelect
                        showSearch
                        style={{ width: 'min(500px, 100%)' }}
                        // tagRender={(props) => {
                        //     console.log("props", props);

                        // }}                        
                        // value={value}
                        styles={{
                            popup: { root: { maxHeight: 400, overflow: 'auto' } },
                        }}
                        placeholder="Выберите тип обращения"
                        allowClear
                        treeDefaultExpandAll
                        onChange={onChangeTypeAppeal}
                        treeData={treeData}
                    // onPopupScroll={onPopupScroll}
                    />
                }
                <div style={{ marginTop: 20 }}>

                    <AppealItem
                        isLoadingAppeal={isLoadingAppeal}
                        appeal={appeal}
                        appealsId={selectType}
                        claimId={claimId}
                        closeModal={closeModal}
                    // claimId={}
                    />
                </div>
                {/* {isLoadingAppeal && <div><Preloader /></div>}
                {!isLoadingAppeal && appeal && <div>Форма тут</div>} */}
            </Modal>
        </div >
    )
}
