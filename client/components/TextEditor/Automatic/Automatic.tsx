import React, { useState } from "react";
import styles from "./Automatic.module.scss";
import { Flex, Textarea } from "@mantine/core";

interface AutomaticProps {
  content: string;
  onUpdate: (content: string) => void;
}

function Automatic({ content, onUpdate }: AutomaticProps) {
  const [suggestion, setSuggestion] = useState<string>("");

  return (
    <div className={styles.automatic}>
      <div className={styles.content}>{content}</div>
      <div className={styles.controls}>
        <Flex>
          <Textarea
            value={suggestion}
            onChange={(event) => setSuggestion(event.currentTarget.value)}
            placeholder="Suggestion"
            className={styles.textarea}
            style={{
              width: "100%",
            }}
          />
        </Flex>
      </div>
    </div>
  );
}

export default Automatic;
