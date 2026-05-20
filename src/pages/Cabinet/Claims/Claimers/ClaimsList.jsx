import { useEffect } from "react";
import { Card, Empty, Flex } from "antd";
import useClaim from "../../../../stores/Cabinet/useClaims";
import CardClaim from "../CardClaim";
import LineClaim from "../LineClaim";
import Preloader from "../../../../components/Main/Preloader";

export default function ClaimsList({ page, pageSize, selectFilters, selectSort, typeView }) {
    const fetchClaims = useClaim((state) => state.fetchClaims);
    const claimsAll = useClaim((state) => state.claims);
    const loadingClaims = useClaim((state) => state.loadingClaims);

    useEffect(() => {
        fetchClaims(page, pageSize, selectFilters, selectSort);
    }, [page, pageSize, selectFilters, selectSort]);

    console.log("claimsAll", claimsAll)
    return (
        <Flex wrap={"wrap"} gap={20} style={{ marginTop: 20, marginBottom: 20, flex: 1, width: "100%" }}>
            {loadingClaims &&
                <Flex gap={10} style={{ width: "100%" }} wrap={"wrap"}>
                    <Card loading={true} style={{ minWidth: "calc(50% - 5px)" }}></Card>
                    <Card loading={true} style={{ minWidth: "calc(50% - 5px)" }}></Card>
                    <Card loading={true} style={{ minWidth: "calc(50% - 5px)" }}></Card>
                    <Card loading={true} style={{ minWidth: "calc(50% - 5px)" }}></Card>
                    {/* <Preloader /> */}
                </Flex>
            }
            {!loadingClaims && (!claimsAll || claimsAll.length < 1)&&
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}  description="Нет заявок"/>
            }
            {!loadingClaims && claimsAll && claimsAll.map((item, index) => {
                if (typeView === 'card') return <CardClaim item={item} key={index} state={item.currentStatus?.state} />
                if (typeView === 'line') return <LineClaim item={item} key={index} state={item.currentStatus?.state} />
            }
            )}
        </Flex>

    )
}