import axios from "axios";

const b64toBlob = (b64Data, contentType = '', sliceSize = 512) => {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }
    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
}

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