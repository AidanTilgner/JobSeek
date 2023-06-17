import {
  ChatCompletionRequestMessage,
  CreateChatCompletionRequest,
} from "openai-edge";
import { getChatCompletion, getChatCompletionStream } from "./openai";

const getFixBySuggestionSystemPrompt = () => {
  const prompt = `
    You are a helpful assistant which takes an original document, and based on the user suggestions, returned a fixed copy.

    Your Response Should:
    - Only be the fixed copy, no extra words or meta information, just the text of the fixed copy
    - Implement the user's suggestions based on intent, not just the exact words
    - Always return at least the original copy as a fallback if you do not understand the user's suggestions
    `;

  return prompt;
};

export const getFixBySuggestionUserPrompt = (
  original: string,
  suggestion: string
) => {
  const prompt = `
    Original: "${original}"
    Suggestion: "${suggestion}"
    `;
  return prompt;
};

export const getChatFixBySuggestion = async (
  original: string,
  suggestion: string,
  model: CreateChatCompletionRequest["model"] = "gpt-3.5-turbo"
) => {
  try {
    const systemPrompt = getFixBySuggestionSystemPrompt();

    const userPrompt = getFixBySuggestionUserPrompt(original, suggestion);

    const messages: ChatCompletionRequestMessage[] = [
      {
        role: "system",
        content: systemPrompt,
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
  model: CreateChatCompletionRequest["model"] = "gpt-3.5-turbo"
) => {
  try {
    const systemPrompt = getFixBySuggestionSystemPrompt();
    const userPrompt = getFixBySuggestionUserPrompt(original, suggestion);

    const messages: ChatCompletionRequestMessage[] = [
      {
        role: "system",
        content: systemPrompt,
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
