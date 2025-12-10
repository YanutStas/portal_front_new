import axios from "axios";
import b64toBlob from "../../lib/b64toBlob";

export default async function openDocs(documentId, filename = "document.pdf", download = false, sig = false,) {
    const backServer = import.meta.env.VITE_BACK_BACK_SERVER;
    try {
        const res = await axios
            .get(`${backServer}/api/cabinet/get-file/by-id/${documentId}?sig=${sig ? "1" : "0"}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("jwt")}`,
                },
                withCredentials: true,
            })
        // console.log(res.data);

        if (res.data?.data?.base64) {
            const file = b64toBlob(res.data.data.base64, sig ? "application/pgp-signature" : "application/pdf")
            const fileURL = URL.createObjectURL(file);
            // if (sig) {
            //     const newWindow = window.open(fileURL);
            // } else {
            //     const newWindow = window.open("", "_blank");
            //     newWindow.location.href = fileURL;
            // }
            const link = document.createElement('a');
            link.href = fileURL;
            download ? link.download = filename : link.target = "_blank";
            
            document.body.appendChild(link);
            link.click();

            document.body.removeChild(link);
            window.URL.revokeObjectURL(fileURL);
            return true
        } else {
            return false
        }
    } catch (error) {
        console.error("Ошибка при открытии документа:", error);
        return false
    }

}