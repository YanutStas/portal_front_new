import { Image } from "antd";

import getPublicFile from "../lib/getPublicFile";

const backServer = import.meta.env.VITE_BACK_BACK_SERVER;

const getPicture = async (fileId, ext) => {
    const url = await getPublicFile(fileId, ext)
    return url
}

export default function ImagePublic({ img, size = 50 }) {
    return (
        <Image
            preview={false}
            src={img?.id && `${backServer}/uploads/${img?.checksum}.${img?.ext}`}
            onError={async ({ currentTarget }) => {
                currentTarget.onerror = null; // prevents looping
                currentTarget.src = "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs%3D"
                currentTarget.src = img?.id ? await getPicture(img?.id, img?.ext) || "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs%3D" : (img.isFolder ? folderPic : docPic)
            }}
            alt={`Фото ${img?.id}`}
            height={size}
        />
    )
}