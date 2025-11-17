import React, { useEffect, useState } from "react";
import { Flex, Select, Typography } from "antd";
export default function FiltersClaims({ claimsAll, setSelectFilters, selectFilters }) {
    const [selectStatus, setSelectStatus] = useState()

    const statusArray = claimsAll?.filter(item => item.currentStatus.label).map(item => ({ value: item.currentStatus.label }))

    useEffect(() => {
        setSelectFilters({ ...selectFilters, status: selectStatus })
    }, [selectStatus])

    return (
        <Flex style={{ marginBottom: 20 }} gap={10}>
            <Flex gap={5} align="center" wrap={"wrap"}>
                <Typography.Text>Статус:</Typography.Text>
                <Select
                    style={{ width: 300 }}
                    onChange={(value) => { setSelectStatus(value) }}
                    options={statusArray}
                    allowClear
                />
            </Flex>
        </Flex>
    )
}