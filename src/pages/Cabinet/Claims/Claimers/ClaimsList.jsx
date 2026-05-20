import { useEffect } from "react";
import { Flex } from "antd";
import useClaim from "../../../../stores/Cabinet/useClaims";
import CardClaim from "../CardClaim";
import LineClaim from "../LineClaim";

export default function ClaimsList({ page, pageSize, selectFilters, selectSort, typeView }) {
    const fetchClaims = useClaim((state) => state.fetchClaims);
    const claimsAll = useClaim((state) => state.claims);
    const loadingClaims = useClaim((state) => state.loadingClaims);

    useEffect(() => {
        fetchClaims(page, pageSize, selectFilters, selectSort);
    }, [page, pageSize, selectFilters, selectSort]);

    console.log("claimsAll", claimsAll)
    return (
        <Flex wrap={"wrap"} gap={20} style={{ marginTop: 20, marginBottom: 20 }}>
            {claimsAll && claimsAll.map((item, index) => {
                if (typeView === 'card') return <CardClaim item={item} key={index} state={item.currentStatus?.state} />
                if (typeView === 'line') return <LineClaim item={item} key={index} state={item.currentStatus?.state} />
            }
            )}
        </Flex>

    )
}