import React, { useState } from "react";
import { Form, Drawer, Collapse } from "antd";
import StrapiRichText from "../../StrapiRichText";
import SelectDocumentType from "./SelectDocumentType";
import PassportFields from "./PassportFields";
import OtherDocumentFields from "./OtherDocumentFields";

export default function ConfirmationDocumentNewInput({ name }) {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const onClose = () => setDrawerVisible(false);

  return (
    <Collapse
      defaultActiveKey={["1"]}
      style={{ marginBottom: 24 }}
      items={[
        {
          key: "1",
          label: "Удостоверяющий документ",
          children: (
            <>
              <Form.List
                name={name}
                initialValue={{ "Вид документа": "Паспорт гражданина РФ" }}
              >
                {() => (
                  <>
                    <SelectDocumentType name={name} />

                    <PassportFields name={name} />

                    <OtherDocumentFields name={name} />
                  </>
                )}
              </Form.List>

              <Drawer
                title={"Удостоверяющий документ"}
                placement="right"
                onClose={onClose}
                open={drawerVisible}
              >
                <StrapiRichText content={"Удостоверяющий документ"} />
              </Drawer>
            </>
          ),
        },
      ]}
    />
  );
}
