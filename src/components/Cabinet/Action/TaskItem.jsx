import axios from "axios";
import React, { useEffect, useState } from "react";
import useTasks from "../../../stores/Cabinet/useTasks";
import { Button, Flex, Form, Tabs } from "antd";
import selectComponent from "../../selectComponent";
import Preloader from "../../Main/Preloader";
import FieldsClaim from "../../../pages/Cabinet/Claims/ClaimItem/FieldsClaim";
import { FileTextOutlined, } from "@ant-design/icons";
import openDocs from "../openDocument";
import FileForDownload from "../../FileForDownload";


export default function TaskItem({ taskId, claimId, taskBasis, buttonText, versionId, onCancel }) {
    const { fetchTaskById, isLoadingTask, task, } = useTasks(store => store)

    useEffect(() => {
        fetchTaskById(taskId)
    }, [taskId])
    useEffect(() => {
        console.log(task);
    }, [task])
    const items = [
        {
            key: '1',
            label: 'Информация',
            children: <div>
                {task &&
                    <FieldsClaim template={task?.template} values={task?.values} />
                }
            </div>,
        },
        {
            key: '2',
            label: 'Файлы',
            children: <div>
                {task && task?.files?.map((item, index) =>
                    <FileForDownload key={index} type={item.ext} name={item.name} id={item.id} size={item.size} />
                )}
            </div>,
        },

    ]
    // const handlerFinish = (values) => {
    //     console.log(values)
    //     if (createNewTask({
    //         typeActionId: actionId,
    //         claimId,
    //         ...taskBasis,
    //         versionId: action.versionId,
    //         values
    //     })) {
    //         onCancel()
    //     }
    // }
    
    
    return (
        <>

            <Tabs defaultActiveKey="1" items={items} />
            {/* {isLoadingAction && <Preloader />}
            {!isLoadingAction && action?.fields &&
                <Form onFinish={handlerFinish}>
                    {action.fields.map((item, index) => selectComponent(item, index))}
                    <Flex justify="center" style={{ marginTop: 20 }}>

                        <Form.Item>
                            <Button htmlType={"submit"} type="primary">{!buttonText && "Отправить"}</Button>
                        </Form.Item>
                    </Flex>
                </Form>
            } */}
        </>
    )
}