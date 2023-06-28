import { getUserResume } from "../database/functions/resume";
import { CoverLetterModes, JobDescription } from "../declarations/main";
import { Resume } from "../database/models/resume";
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
    - Be written from the perspective of the applicant
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

    ${
      jobDescription.recruiter_name
        ? `The recruiter's name is ${jobDescription.recruiter_name}.`
        : ""
    }

    Here is some resume information for ${
      resume.name
    }, the applicant, for your reference:

    ${getResumeDescribed(resume)}
    `;

  return prompt;
};

export const getConversationStarterSystemPrompt = () => {
  const prompt = `
  You are an expert conversation starter writer. Given a job description and resume information, you will write an exceptional conversation starter.

  The conversation starter should:
  - Be addressed to the hiring manager if possible
  - Be short and sweet
  - Be relatively casual
  - Capture the attention of the hiring manager
  - Emphasize projects that the applicant worked on that may be similar to the company's work
  - Be written from the perspective of the applicant
  - Have a clear call to action
  `;

  return prompt;
};

export const getConversationStarterUserPrompt = (
  jobDescription: JobDescription,
  resume: Resume
) => {
  const prompt = `
    Here is a job application for a ${jobDescription.title} position at ${
    jobDescription.company
  }:

    "${jobDescription.description}"

    ${
      jobDescription.recruiter_name
        ? `The recruiter's name is ${jobDescription.recruiter_name}.`
        : ""
    }

    Here is some resume information for ${
      resume.name
    }, the applicant, for your reference:

    ${getResumeDescribed(resume)}
    `;
  return prompt;
};

export const modeToPrompts = {
  "cover-letter": {
    system: getCoverLetterSystemPrompt,
    user: getCoverLetterUserPrompt,
  },
  "conversation-starter": {
    system: getConversationStarterSystemPrompt,
    user: getConversationStarterUserPrompt,
  },
};

export const getCheckedMode = (mode: string): CoverLetterModes => {
  if (mode === "cover-letter") {
    return "cover-letter";
  } else if (mode === "conversation-starter") {
    return "conversation-starter";
  } else {
    return "cover-letter";
  }
};

export const getGeneratedCoverLetterMessages = async (
  jobDescription: JobDescription,
  resume: Resume,
  mode: CoverLetterModes = "cover-letter"
) => {
  try {
    const systemPrompt = modeToPrompts[mode].system();
    const userPrompt = modeToPrompts[mode].user(jobDescription, resume);

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
  userId: number,
  mode: CoverLetterModes = "cover-letter"
) => {
  try {
    const resume = await getUserResume(userId, true);

    if (!resume) {
      return {
        success: false,
        message: "Something went wrong.",
      };
    }

    const messages = await getGeneratedCoverLetterMessages(
      jobDescription,
      resume,
      getCheckedMode(mode)
    );
    if (!messages) {
      return {
        success: false,
        message: "Something went wrong.",
      };
    }
    const response = await getChatCompletion(messages, "gpt-4");
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
  userId: number,
  mode: CoverLetterModes = "cover-letter"
) => {
  try {
    const resume = await getUserResume(userId, true);

    if (!resume) {
      return {
        success: false,
        stream: null,
      };
    }

    const messages = await getGeneratedCoverLetterMessages(
      jobDescription,
      resume,
      getCheckedMode(mode)
    );

    if (!messages) {
      return {
        success: false,
        stream: null,
      };
    }
    const response = await getChatCompletionStream(messages, "gpt-4");
    return response;
  } catch (error) {
    console.error(error);
    return {
      success: false,
      stream: null,
    };
  }
};
