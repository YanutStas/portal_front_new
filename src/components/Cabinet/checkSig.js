import axios from "axios";
import b64toBlob from "../../lib/b64toBlob";

export default async function checkSig(documentId, sigId) {
    const backServer = import.meta.env.VITE_BACK_BACK_SERVER;
    try {
        const res = await axios
            .post(`${backServer}/api/cabinet/checkSig`, {
                documentId,
                sigId
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("jwt")}`,
                },
                withCredentials: true,
            })
        // console.log(res.data);
        return res.data


    } catch (error) {
        console.error("Ошибка при проверке подписанного документа:", error);
        return false
    }

}