import axios from "axios";
// const url = "https://e-trust.gosuslugi.ru/app/scc/portal/api/v1/portal/ESV/verifyAndGetReports"
// const backServer = "https://testportal.mosoblenergo.ru";
const backServer = import.meta.env.VITE_BACK_CHECKSIG_SERVER;
const url = `${backServer}/api/checksig`
// const url = `https://testportal.mosoblenergo.ru/ari/checksig`
const checkSig = async (formData) => {
    const body = new FormData()
    // body.append("captchaText", "00")
    // body.append("captchaUuid", "a7c98e54-9c24-4e9b-bf69-58b678fcec95")
    // body.append("VerifySignatureOnly", false)
    // body.append("methodName", "verifyCMSSignatureDetached")
    body.append("cms", formData.cms.file.originFileObj)
    body.append("data", formData.data.file.originFileObj)
    console.log("body", Object.fromEntries(body.entries()))

    const res = await axios.post(url, body)
    console.log(res.data)
    if (res.data.status && res.data.status == "OK") {
        const json = JSON.parse(res.data.data)
        const jsonReport = JSON.parse(json.jsonReport)
        console.log("json",json)
        console.log("jsonReport",jsonReport)
        return jsonReport
    }
    return false

}

export default checkSig