import axios from "axios";
import React, { useEffect, useState } from "react";
import useTasks from "../../../stores/Cabinet/useTasks";
import { Button, Flex, Form, Modal } from "antd";
import selectComponent from "../../selectComponent";
import Preloader from "../../Main/Preloader";


export default function ActionItem({ actionId, claimId, taskBasis, buttonText, versionId, onCancel, title, open }) {
    const { fetchActionById, isLoadingAction, action, createNewTask } = useTasks(store => store)
    const [sendingTask, setSendingTask] = useState(false)

    useEffect(() => {
        fetchActionById(actionId)
    }, [actionId])
    // useEffect(() => {
    //     console.log(action);
    // }, [action])

    const handlerFinish = async (values) => {
        // console.log(values)
        setSendingTask(true)
        // const pause = (seconds) => new Promise(r => setTimeout(r, seconds * 1000));
        // if (await pause(5)) {
        //     setSendingTask(false)
        // }
        if (await createNewTask({
            typeActionId: actionId,
            claimId,
            ...taskBasis,
            versionId: action.versionId,
            values
        })) {
            setSendingTask(false)
            onCancel()
        }
        setSendingTask(false)
    }
    // console.log("action",action);

    return (
        <Modal
            title={title}
            open={open}
            onCancel={onCancel}
            footer={false}
            destroyOnHidden={true}
            width={action?.modalProperty?.style || "80%"}
        >

            <div style={{ maxWidth: "100%" }}>
                {isLoadingAction && <Preloader />}
                {!isLoadingAction && action?.fields &&
                    <Form
                        onFinish={handlerFinish}
                        layout="vertical"
                    >
                        {action.fields.map((item, index) => selectComponent(item, index, action.styles[item.stylesField_key]))}
                        <Flex justify="center" style={{ marginTop: 20 }}>
                            <Form.Item>
                                <Button htmlType={"submit"} type="primary" disabled={sendingTask}>{!buttonText && "Отправить"}</Button>
                            </Form.Item>
                        </Flex>
                    </Form>
                }
            </div>
        </Modal>
    )
}