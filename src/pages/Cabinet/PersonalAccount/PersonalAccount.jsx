import { Typography } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
const backServer = import.meta.env.VITE_BACK_BACK_SERVER;
export default function PersonalAccounts() {
    const [personalAccounts, setPersonalAccounts] = useState()
    async function fetchPersonalAccounts() {
        try {
            const url = `${backServer}/api/cabinet/personalAccounts`
            const res = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("jwt")}`,
                },
                withCredentials: true,
            })
            console.log(res.data);
            
            if (!res.data) return console.log("Аккаунтов нет");
            setPersonalAccounts(res.data)
        } catch (error) {
            console.log(error);

        }

    }
    useEffect(() => {
        fetchPersonalAccounts()
    }, [])
    console.log(personalAccounts);

    return (
        <Typography.Title>Личные кабинеты</Typography.Title>
    )
}