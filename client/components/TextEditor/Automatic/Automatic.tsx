import React, { useEffect, useRef, useState } from "react";
import styles from "./Automatic.module.scss";
import { ActionIcon, Button, Group, Loader, Textarea } from "@mantine/core";
import { api, socket } from "../../../utils/server";
import { showNotification } from "@mantine/notifications";
import { Check, Copy } from "@phosphor-icons/react";
import { copyTextToClipboard } from "../../../utils/methods";

interface AutomaticProps {
  content: string;
  onUpdate: (content: string, type: "replace" | "append") => void;
  onClearContent?: () => void;
  loading?: boolean;
  editable?: boolean;
  disabled?: boolean;
}

function Automatic({
  content,
  onUpdate,
  onClearContent,
  loading: loadingProps,
  editable = true,
  disabled = false,
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
    if (!suggestion) {
      showNotification({
        title: "Suggestion cannot be empty",
        message: "Please enter a suggestion",
        color: "red",
      });
      return;
    }
    setLoading(true);
    onClearContent && onClearContent();
    api.post("/llms/chat/suggest-fix", {
      original: content,
      suggestion: suggestion,
      stream: true,
    });
    setSuggestion("");
  };

  const contentRef = useRef<HTMLDivElement>(null);

  // when the content changes, scroll to the bottom
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [content]);

  const [copied, setCopied] = useState<boolean>(false);

  return (
    <div className={styles.automatic}>
      {loading && <Loader size={"sm"} />}
      <div className={styles.contentContainer}>
        {content ? (
          <div
            className={styles.content}
            dangerouslySetInnerHTML={{
              __html: getFormattedContent(content),
            }}
            contentEditable={editable && !disabled}
            ref={contentRef}
            onBlur={() => {
              onUpdate(contentRef.current?.innerHTML || "", "replace");
            }}
          />
        ) : (
          <div className={styles.content} ref={contentRef}>
            <p className={styles.disclaimer}>{`There's`} nothing here yet!</p>
          </div>
        )}
        {content && (
          <div className={styles.options}>
            <ActionIcon
              onClick={() => {
                copyTextToClipboard(content);
                showNotification({
                  title: "Copied to clipboard",
                  message: "The content has been copied to your clipboard",
                });
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 1000);
              }}
            >
              {copied ? <Check color="green" /> : <Copy />}
            </ActionIcon>
          </div>
        )}
      </div>

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
            onKeyDown={(event) => {
              if (event.ctrlKey && event.key === "Enter") {
                return;
              }
              if (event.key === "Enter") {
                event.preventDefault();
                handleSubmit();
              }
            }}
            disabled={disabled}
          />
          <Button onClick={handleSubmit}>Submit</Button>
        </Group>
      </div>
    </div>
  );
}

export default Automatic;
