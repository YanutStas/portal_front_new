// import { Button, Result } from "antd";
import { Button, Typography } from "antd";
import React, { useState } from "react";
import Container from "../components/Container";
import ModalPrivacy from "../components/ModalPrivacy";

export default function Privacy() {
    const [open, setOpen] = useState(false)
    const onCancel = () => {
        setOpen(false)
    }
    return (
        <>
            <Button onClick={() => { setOpen(true) }}>Показать согласие о персональных данных</Button>
            <ModalPrivacy open={open} onCancel={onCancel} />
        </>
    );
}

