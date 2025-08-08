import axios from "axios";
import React, { useEffect, useState } from "react";
import useTasks from "../../../stores/Cabinet/useTasks";
import { Button, Empty, Flex, Form, Typography } from "antd";
import selectComponent from "../../selectComponent";
import Preloader from "../../Main/Preloader";
import useDataForForm from "../../../stores/Cabinet/useDataForForm";


export default function AppealItem({ claimId, appeal, isLoadingAppeal }) {
    // const { fetchActionById, isLoadingAction, action, createNewTask } = useTasks(store => store)
    // const { setLinks } = useDataForForm((state) => state)
    // useEffect(() => {
    //     if (appeal && appeal.links) {
    //         setLinks(appeal.links)
    //     }
    //     //     setLinks(appeal.links)

    // }, [])
    const handlerFinish = (values) => {
        console.log(values)
        // if (createNewTask({
        //     typeActionId: actionId,
        //     claimId,
        //     ...taskBasis,
        //     versionId: action.versionId,
        //     values
        // })) {
        //     onCancel()
        // }
    }
    return (
        <>
            {isLoadingAppeal && <Preloader />}
            {!isLoadingAppeal && appeal && appeal?.fields && appeal.fields.length > 0 &&
                <Form
                    onFinish={handlerFinish}
                    layout="vertical"
                >
                    {appeal.fields.map((item, index) => selectComponent(item, index))}
                    <Flex justify="center" style={{ marginTop: 20 }}>

                        <Form.Item>
                            <Button htmlType={"submit"} type="primary">{"Подать обращение"}</Button>
                        </Form.Item>
                    </Flex>
                </Form>
            }
            {!isLoadingAppeal && appeal && appeal?.fields && !appeal.fields.length > 0 &&
                <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={
                        <Typography.Text>
                            Отсутствует содержимое
                        </Typography.Text>
                    }
                />
            }
        </>
    )
}