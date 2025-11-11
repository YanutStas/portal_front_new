import axios from "axios";
import b64toBlob from "../../lib/b64toBlob";

export default async function openDocs(documentId, sig = false) {
    const backServer = import.meta.env.VITE_BACK_BACK_SERVER;
    try {
        const res = await axios
            .get(`${backServer}/api/cabinet/get-file/by-id/${documentId}?sig=${sig ? "1" : "0"}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("jwt")}`,
                },
                withCredentials: true,
            })
        if (res.data?.data?.base64) {
            file = b64toBlob(res.data.data.base64, sig ? "application/pgp-signature" : "application/pdf")
            const fileURL = URL.createObjectURL(file);
            if (sig) {
                const newWindow = window.open(fileURL);
            } else {
                const newWindow = window.open("", "_blank");
                newWindow.location.href = fileURL;
            }
            return true
        } else {
            return false
        }
    } catch (error) {
        console.error("Ошибка при открытии документа:", error);
        return false
    }

}