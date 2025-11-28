import React, { useEffect, useState } from "react";
import { Flex, Input, Select, Typography } from "antd";
export default function FiltersClaims({ claimsAll, setSelectFilters, selectFilters }) {
    const [selectStatus, setSelectStatus] = useState()
    const [valueNumber, setValueNumber] = useState()

    const statusArray = new Set(claimsAll?.filter(item => item.currentStatus.label).map(item => (item.currentStatus.label)))

    useEffect(() => {
        setSelectFilters({ ...selectFilters, status: selectStatus, number: valueNumber })
    }, [selectStatus,valueNumber])
    // console.log(valueNumber, valueNumber);

    return (
        <Flex style={{ marginBottom: 20 }} gap={10}>
            <Flex gap={5} align="center" wrap={"wrap"}>
                <Typography.Text>Статус:</Typography.Text>
                <Select
                    style={{ width: 300 }}
                    onChange={(value) => { setSelectStatus(value) }}
                    options={Array.from(statusArray).sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase())).map(item => ({ value: item }))}
                    allowClear
                />
            </Flex>
            <Flex gap={5} align="center" wrap={"wrap"}>
                <Typography.Text>Номер:</Typography.Text>
                <Input
                    style={{ width: 300 }}
                    value={valueNumber}
                    onChange={(event) => { setValueNumber(event.target.value) }}
                />
            </Flex>
        </Flex>
    )
}