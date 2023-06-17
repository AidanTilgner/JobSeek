import React, { useEffect } from "react";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { RichTextEditor, Link } from "@mantine/tiptap";
import styles from "./RichTextEditor.module.scss";

interface TextEditorProps {
  content: string;
  disabled?: boolean;
}

function TextEditor({ content }: TextEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit, Link],
    content,
  });

  useEffect(() => {
    editor?.commands.clearContent();
    editor?.commands.setContent(content);
  }, [content]);

  return (
    <div className={styles.editorContainer}>
      <RichTextEditor
        editor={editor}
        styles={{
          root: {
            height: "100%",
            width: "100%",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
          },
          toolbar: {
            flexGrow: 1,
          },
          typographyStylesProvider: {
            flexGrow: 3,
          },
        }}
      >
        <RichTextEditor.Toolbar sticky stickyOffset={60}>
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Bold />
            <RichTextEditor.Italic />
            <RichTextEditor.Underline />
            <RichTextEditor.Strikethrough />
            <RichTextEditor.ClearFormatting />
            <RichTextEditor.Highlight />
            <RichTextEditor.Code />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.H1 />
            <RichTextEditor.H2 />
            <RichTextEditor.H3 />
            <RichTextEditor.H4 />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Blockquote />
            <RichTextEditor.Hr />
            <RichTextEditor.BulletList />
            <RichTextEditor.OrderedList />
            <RichTextEditor.Subscript />
            <RichTextEditor.Superscript />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Link />
            <RichTextEditor.Unlink />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.AlignLeft />
            <RichTextEditor.AlignCenter />
            <RichTextEditor.AlignJustify />
            <RichTextEditor.AlignRight />
          </RichTextEditor.ControlsGroup>
        </RichTextEditor.Toolbar>

        <RichTextEditor.Content />
      </RichTextEditor>
    </div>
  );
}

export default TextEditor;
