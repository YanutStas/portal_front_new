import React from "react";
import { Typography, theme } from "antd";
import Markdown from "markdown-to-jsx";
import styles from "./MarkDownText.module.css";

export default function MarkDownText({ children }) {
  const { fontFamily } = theme.useToken().token;
  if (typeof children !== "string") {
    return false;
  }
  return (
    <Markdown
      className={styles.markdown}
      options={{
        overrides: {
          p: {
            component: Typography.Paragraph,
            props: {
              className: styles.para,
              styles: { fontFamily: fontFamily },
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
        },
      }}
    >
      {children}
    </Markdown>
  );
}
