import axios from "axios";
import b64toBlob from "./b64toBlob";
import mimeType from './mimeType.json'

const backServer = import.meta.env.VITE_BACK_BACK_SERVER;


const getMimeType = (ext) => {
    return mimeType.find(item => item.ext === ext)?.mime || false
}

export default async function getPublicFile(fileId) {
    try {
        const res = await axios
            .get(`${backServer}/api/publicFile/${fileId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("jwt")}`,
                },
                withCredentials: true,
            })
        if (res.data?.data?.base64) {
            const file = b64toBlob(res.data.data.base64, getMimeType(res.data.data.ext))
            return URL.createObjectURL(file);
        } else {
            return false
        }
    } catch (error) {
        console.error("Ошибка при открытии документа:", error);
    }

}