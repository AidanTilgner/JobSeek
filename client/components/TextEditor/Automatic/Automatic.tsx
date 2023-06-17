import React, { useEffect, useState } from "react";
import styles from "./Automatic.module.scss";
import { Button, Group, Loader, Textarea } from "@mantine/core";
import { api, socket } from "../../../utils/server";

interface AutomaticProps {
  content: string;
  onUpdate: (content: string, type: "replace" | "append") => void;
  onClearContent?: () => void;
  loading?: boolean;
  editable?: boolean;
}

function Automatic({
  content,
  onUpdate,
  onClearContent,
  loading: loadingProps,
  editable = true,
}: AutomaticProps) {
  const [suggestion, setSuggestion] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (loadingProps !== undefined && loading !== loadingProps) {
      setLoading(loadingProps);
    }
  }, [loadingProps]);

  const getFormattedContent = (content: string) => {
    return content
      .replace(/\n/g, "<br />")
      .replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;");
  };

  useEffect(() => {
    socket.on("llms/chat/suggest-fix:datastream", (data) => {
      if (data.done) {
        setLoading(false);
      }
      onUpdate(data.message_fragment, "append");
    });

    return () => {
      socket.off("llms/chat/suggest-fix:datastream");
    };
  }, []);

  const handleSubmit = () => {
    setLoading(true);
    onClearContent && onClearContent();
    api.post("/llms/chat/suggest-fix", {
      original: content,
      suggestion: suggestion,
      stream: true,
    });
  };

  return (
    <div className={styles.automatic}>
      {loading && <Loader size={"sm"} />}
      <div
        className={styles.content}
        dangerouslySetInnerHTML={{
          __html: getFormattedContent(content),
        }}
        contentEditable={editable}
      />
      <div className={styles.controls}>
        <Group spacing={24} position="right">
          <Textarea
            value={suggestion}
            onChange={(event) => setSuggestion(event.currentTarget.value)}
            placeholder="Suggestion"
            className={styles.textarea}
            style={{
              width: "100%",
            }}
          />
          <Button onClick={handleSubmit}>Submit</Button>
        </Group>
      </div>
    </div>
  );
}

export default Automatic;
