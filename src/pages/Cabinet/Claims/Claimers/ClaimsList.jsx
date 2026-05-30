import { useEffect, useState } from "react";
import { Card, Empty, Flex, Pagination } from "antd";
import useClaim from "../../../../stores/Cabinet/useClaims";
import CardClaim from "../CardClaim";
import LineClaim from "../LineClaim";
import Preloader from "../../../../components/Main/Preloader";

export default function ClaimsList({ selectFilters, selectSort, typeView }) {
    const fetchClaims = useClaim((state) => state.fetchClaims);
    const claimsAll = useClaim((state) => state.claims);
    const metaClaims = useClaim((state) => state.metaClaims);
    const loadingClaims = useClaim((state) => state.loadingClaims);
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)

    useEffect(() => {

        // const currentPage = (selectFilters || selectSort) && page !== 1 ? 1 : page;
        fetchClaims(page, pageSize, selectFilters, selectSort);
    }, [page, pageSize]);

    useEffect(() => {
        if (page === 1) {
            fetchClaims(page, pageSize, selectFilters, selectSort);
        } else {
            setPage(1);
        }
    }, [selectFilters, selectSort]);



    // console.log("claimsAll", claimsAll)
    return (
        <>
            <Flex wrap={"wrap"} gap={20} style={{ marginTop: 20, marginBottom: 20, width: "100%" }} >
                {loadingClaims &&
                    <Flex gap={10} style={{ width: "100%" }} wrap={"wrap"}>
                        <Card loading={true} style={{ minWidth: "calc(50% - 5px)" }}></Card>
                        <Card loading={true} style={{ minWidth: "calc(50% - 5px)" }}></Card>
                        <Card loading={true} style={{ minWidth: "calc(50% - 5px)" }}></Card>
                        <Card loading={true} style={{ minWidth: "calc(50% - 5px)" }}></Card>
                        {/* <Preloader /> */}
                    </Flex>
                }
                {!loadingClaims && (!claimsAll || claimsAll.length < 1) &&
                    <Flex justify="center" style={{ width: "100%" }}>
                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Нет заявок" />
                    </Flex>
                }
                {!loadingClaims && claimsAll && claimsAll.map((item, index) => {

                    if (typeView === 'card') return <CardClaim item={item} key={index} state={item.currentStatus?.state} />
                    if (typeView === 'line') return <LineClaim item={item} key={index} state={item.currentStatus?.state} />


                }
                )}
            </Flex>
            <Flex justify="flex-end">

                <Pagination
                    locale={{
                        items_per_page: 'на страницу',
                        next_5: "Следующие 5 страниц",
                        prev_5: "Предыдущие 5 страниц",
                        next_page: "Следующая страница",
                        prev_page: "Предыдущая страница"
                    }}
                    styles={{
                        root: {
                            display: "flex",
                            rowGap: 10,
                            flexWrap: "wrap"
                        }
                    }}
                    defaultCurrent={page}
                    current={page}
                    showTotal={total => `Всего ${total}`}
                    pageSize={pageSize}
                    total={metaClaims?.total}
                    showSizeChanger
                    onChange={(page, pageSize) => {
                        setPage(page)
                        setPageSize(pageSize)
                    }} />
            </Flex>
        </>

    )
}