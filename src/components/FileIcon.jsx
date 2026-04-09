import { Flex, Typography } from "antd";
import pdf from "../img/docs/pdf.svg";
import doc from "../img/docs/doc.svg";
import docx from "../img/docs/docx.svg";
import rar from "../img/docs/rar.svg";
import xls from "../img/docs/xls.svg";
import rtf from "../img/docs/rtf.svg";
import noext from "../img/docs/noext.svg";
const type = {
    pdf,
    doc,
    docx,
    rar,
    xls,
    rtf,
    noext
};
export default function FileIcon({ name, sizeKb, url = false, ext = undefined, index = 1, download = undefined, onClick = undefined }) {
    console.log("ext", ext);

    return (

        <a
            key={index}
            href={onClick ? undefined : url}
            download={onClick ? undefined : download}
            rel={onClick ? undefined : "noopener noreferrer"}
            target={onClick ? undefined : "_blank"}
            onClick={onClick}
        >
            <Flex gap={15} align="center">
                <div>
                    <img
                        src={type[ext.slice(1)]}
                        alt={`icon ${ext.slice(1)}`}
                    />
                </div>
                <Flex vertical>
                    <Typography.Text>{name}</Typography.Text>
                    <Typography.Text type="secondary">
                        {Number(sizeKb) > 1000
                            ? `${(sizeKb / 1000).toFixed(2)} МБ`
                            : `${Math.round(sizeKb)} КБ`}
                    </Typography.Text>
                </Flex>
            </Flex>
        </a>

    )
}