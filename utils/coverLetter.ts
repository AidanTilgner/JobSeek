import { JobDescription, Resume } from "../declarations/main";
import { getChatCompletion, getChatCompletionStream } from "./openai";
import { getResumeDescribed } from "./resume";
import { ChatCompletionRequestMessage } from "openai-edge";

export const getCoverLetterSystemPrompt = () => {
  const prompt = `
    You are an expert cover letter writer. Given a job application and resume information, you will write an exceptional cover letter.

    The cover letter should:
    - Be addressed to the hiring manager if possible
    - Be about a page length
    - Capture the attention of the hiring manager
    - Be honest and accurate, a touch of tasteful flourish is okay
    - Be formatted with line breaks and paragraphs
    `;
  return prompt;
};

export const getCoverLetterUserPrompt = (
  jobDescription: JobDescription,
  resume: Resume
) => {
  const prompt = `
    Here is a job application for a ${jobDescription.title} position at ${
    jobDescription.company
  }:

    "${jobDescription.description}"

    Here is some resume information for ${
      resume.name
    }, the applicant, for your reference:

    ${getResumeDescribed(resume)}
    `;

  return prompt;
};

export const getGeneratedCoverLetterMessages = async (
  jobDescription: JobDescription,
  resume: Resume
) => {
  try {
    const systemPrompt = getCoverLetterSystemPrompt();
    const userPrompt = getCoverLetterUserPrompt(jobDescription, resume);

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

    return messages;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getGeneratedCoverLetter = async (
  jobDescription: JobDescription,
  resume: Resume
) => {
  try {
    const messages = await getGeneratedCoverLetterMessages(
      jobDescription,
      resume
    );
    if (!messages) {
      return {
        success: false,
        message: "Something went wrong.",
      };
    }
    const response = await getChatCompletion(messages, "gpt-3.5-turbo");
    return response;
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Something went wrong.",
    };
  }
};

export const getGeneratedCoverLetterStream = async (
  jobDescription: JobDescription,
  resume: Resume
) => {
  try {
    const messages = await getGeneratedCoverLetterMessages(
      jobDescription,
      resume
    );
    if (!messages) {
      return {
        success: false,
        stream: null,
      };
    }
    const response = await getChatCompletionStream(messages, "gpt-3.5-turbo");
    return response;
  } catch (error) {
    console.error(error);
    return {
      success: false,
      stream: null,
    };
  }
};
