import React from "react";
import { Typography, theme } from "antd";
import Markdown from "markdown-to-jsx";
import styles from "./MarkDownText.module.css";

export default function MarkDownText({ children,fontSize = false }) {
  const { fontFamily } = theme.useToken().token;
  if (typeof children !== "string") {
    return false;
  }
  return (
    <Markdown
      className={styles.markdown}
      // style={{ fontSize: fontSize }}
      options={{
        overrides: {
          p: {
            component: Typography.Paragraph,
            props: {
              className: styles.para,
              style: { fontFamily: fontFamily, fontSize: fontSize || undefined },
            },
          },
          h1: {
            component: Typography.Title,
            props: {
              className: "foo",
            },
          },
          code: {
            component: Typography.Paragraph,
            props: {
              className: styles.code,
            },
          },
          table: {
            props: {
              className: `${styles.tableDescription} ${styles.table}`,
            },
          },
          ul: {
            props: {
              style: { fontFamily: fontFamily, fontSize: fontSize || undefined },
            },
          },
        },
      }}
    >
      {children}
    </Markdown>
  );
}
