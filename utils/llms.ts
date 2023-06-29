import {
  ChatCompletionRequestMessage,
  CreateChatCompletionRequest,
} from "openai-edge";
import { getChatCompletion, getChatCompletionStream } from "./openai";
import { SuggestionFixModes } from "../declarations/main";
import {
  getConversationStarterSystemPrompt,
  getCoverLetterSystemPrompt,
} from "./coverLetter";

export const modeToSystemPrompt = (mode: SuggestionFixModes) => {
  switch (mode) {
    case "cover-letter":
      return `
      It's important to note that the primary output should be a cover letter. Here is some additonal context:
      ${getCoverLetterSystemPrompt()}
      `;
    case "conversation-starter":
      return `
      It's important to note that the primary output should be a conversation starter. Here is some additonal context:
      ${getConversationStarterSystemPrompt()}
      `;
  }
};
export const getCheckedMode = (
  mode: string | undefined
): SuggestionFixModes | null => {
  if (!mode) return null;
  if (mode === "cover-letter") {
    return "cover-letter";
  } else if (mode === "conversation-starter") {
    return "conversation-starter";
  } else {
    return null;
  }
};

const getFixBySuggestionSystemPrompt = (mode?: SuggestionFixModes) => {
  const prompt = `
    You are a helpful assistant which takes an original document, and based on the user suggestions, returned a fixed copy.

    Your Response Should:
    - Only be the fixed copy, no extra words or meta information, just the text of the fixed copy
    - Implement the user's suggestions based on intent, not just the exact words
    - Always return at least the original copy as a fallback if you do not understand the user's suggestions
    - Don't surround in quotes, or add any extra characters, just the text of the fixed copy

    ${
      getCheckedMode(mode)
        ? `
    Here is some additional information to guide your behavior:
    ${modeToSystemPrompt(mode as SuggestionFixModes)}
        `
        : ""
    }
    `;

  return prompt;
};

export const getFixBySuggestionUserPrompt = (
  original: string,
  suggestion: string,
  context?: string
) => {
  const prompt = `
    Original: "${original}"
    Suggestion: "${suggestion}"
    ${context ? `Context: "${context}"` : ""}
    `;
  return prompt;
};

export const getChatFixBySuggestion = async (
  original: string,
  suggestion: string,
  model: CreateChatCompletionRequest["model"] = "gpt-4",
  mode?: SuggestionFixModes,
  context?: string
) => {
  try {
    const sysPrompt = getFixBySuggestionSystemPrompt(mode);

    const userPrompt = getFixBySuggestionUserPrompt(
      original,
      suggestion,
      context
    );

    const messages: ChatCompletionRequestMessage[] = [
      {
        role: "system",
        content: sysPrompt,
      },
      {
        role: "user",
        content: userPrompt,
      },
    ];

    const response = await getChatCompletion(messages, model);

    return response;
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Something went wrong.",
    };
  }
};

export const getChatFixBySuggestionStream = async (
  original: string,
  suggestion: string,
  model: CreateChatCompletionRequest["model"] = "gpt-4",
  mode?: SuggestionFixModes,
  context?: string
) => {
  try {
    const sysPrompt = getFixBySuggestionSystemPrompt(mode);
    const userPrompt = getFixBySuggestionUserPrompt(
      original,
      suggestion,
      context
    );

    const messages: ChatCompletionRequestMessage[] = [
      {
        role: "system",
        content: sysPrompt,
      },
      {
        role: "user",
        content: userPrompt,
      },
    ];

    const response = await getChatCompletionStream(messages, model);

    return response;
  } catch (error) {
    console.error(error);
    return {
      success: false,
      stream: null,
    };
  }
};
