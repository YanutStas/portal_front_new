import { Button, Flex } from "antd";
import React, { useEffect, useState } from "react";
import FieldsClaim from "./FieldsClaim";
import { FileTextOutlined, } from "@ant-design/icons";
import openDocs from "../../../../components/Cabinet/openDocument";
import axios from "axios";
import useClaim from "../../../../stores/Cabinet/useClaims";
import Preloader from "../../../../components/Main/Preloader";

// const backServer = import.meta.env.VITE_BACK_BACK_SERVER;



export default function InfoClaim({ template, values, pdf, claimId }) {
    const [infoClaim, setInfoClaim] = useState()
    const [loadingInfoClaim, setLoadingInfoClaim] = useState(false)
    const fetchDataByClaim = useClaim((state) => state.fetchDataByClaim);
    async function fetchInfoClaim() {
        try {
            setLoadingInfoClaim(true)
            setInfoClaim(await fetchDataByClaim(claimId, "fields"))
            setLoadingInfoClaim(false)
        } catch (error) {
            console.log('Проблемы загрузки infoClaim')
        }
    }
    useEffect(() => {
        fetchInfoClaim()
    }, [])

    console.log("infoClaim", infoClaim);
    if (loadingInfoClaim) {
        return <Preloader />
    }
    return (
        <>
            {infoClaim &&

                <div>
                    <Flex justify="flex-end">

                        {pdf &&
                            <Button
                                type="primary"
                                icon={<FileTextOutlined />}
                                onClick={() => { openDocs(pdf?.id) }}
                            >
                                Печатная форма заявки
                            </Button>
                        }
                    </Flex>
                    <FieldsClaim template={infoClaim?.template} values={infoClaim?.values} />
                </div>
            }
        </>
    );
}
