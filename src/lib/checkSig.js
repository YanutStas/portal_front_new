import axios from "axios";
const url = "https://e-trust.gosuslugi.ru/app/scc/portal/api/v1/portal/ESV/verifyAndGetReports"
const checkSig = async (formData) => {
    const body = new FormData()
    body.append("captchaText", "00")
    body.append("captchaUuid", "a7c98e54-9c24-4e9b-bf69-58b678fcec95")
    body.append("VerifySignatureOnly", false)
    body.append("methodName", "verifyCMSSignatureDetached")
    body.append("cms",formData.cms.file.originFileObj)
    body.append("data", formData.data.file.originFileObj)
    console.log("body",Object.fromEntries(body.entries()))

    const res = await axios.post(url, body)
    console.log(res.data)

}

export default checkSig