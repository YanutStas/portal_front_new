import { Button,Flex } from "antd";
import React, { useState } from "react";
import FieldsClaim from "./FieldsClaim";
import { FileTextOutlined, } from "@ant-design/icons";
import openDocs from "../../../../components/Cabinet/openDocument";

// const backServer = import.meta.env.VITE_BACK_BACK_SERVER;



export default function InfoClaim({ template, values, pdf }) {
    return (
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
            <FieldsClaim template={template} values={values} />
        </div>
    );
}
