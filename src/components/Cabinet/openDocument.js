import axios from "axios";
import b64toBlob from "../../lib/b64toBlob";

export default function openDocs(documentId) {
    const backServer = import.meta.env.VITE_BACK_BACK_SERVER;
    axios
        .get(`${backServer}/api/cabinet/get-file/by-id/${documentId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("jwt")}`,
            },
            withCredentials: true,
        })
        .then((res) => {
            if (res.data?.data?.base64) {
                const file = b64toBlob(res.data.data.base64, "application/pdf")
                const fileURL = URL.createObjectURL(file);
                const newWindow = window.open("", "_blank");
                newWindow.location.href = fileURL;
            }else{
                return false
            }
        })
        .catch((error) => {
            console.error("Ошибка при открытии документа:", error);
        });
}