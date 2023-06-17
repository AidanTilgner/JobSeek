import { Socket } from "socket.io";
import {
  getGeneratedCoverLetter,
  getGeneratedCoverLetterStream,
} from "../../utils/coverLetter";
import { Request, Response } from "express";
import { JobDescription, Resume } from "../../declarations/main";

export const createCoverLetter = async (req: Request, res: Response) => {
  try {
    const { jobDescription, resume } = req.body;

    const response = await getGeneratedCoverLetter(jobDescription, resume);

    res.status(200).json({
      success: response.success,
      message: response.message,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong.",
    });
  }
};

export const createCoverLetterStream = async (
  socket: Socket,
  payload: unknown,
  eventName: string
) => {
  try {
    const { jobDescription, resume } = payload as {
      jobDescription: JobDescription;
      resume: Resume;
    };

    const response = await getGeneratedCoverLetterStream(
      jobDescription,
      resume
    );

    if (!response.success || !response.stream) {
      return socket.emit(eventName, {
        success: false,
        message_fragment: "Something went wrong.",
        done: true,
      });
    }

    const stream = response.stream;
    const reader = stream.getReader();
    let count = 0;

    const readStream = () => {
      reader.read().then(({ done, value }) => {
        if (done) {
          // Stream has ended
          socket.emit(eventName, {
            success: true,
            message_fragment: "", // Empty message fragment to indicate end of stream
            done: true,
          });
          return;
        }

        const decoded = new TextDecoder("utf-8").decode(value);

        // Send the value to the client as an SSE event
        socket.emit(eventName, {
          success: true,
          message_fragment: decoded,
          done: false,
          index: count++,
        });

        // Continue reading the stream
        readStream();
      });
    };

    // Start reading the stream
    readStream();
  } catch (error) {
    console.error(error);
    socket.emit(eventName, {
      success: false,
      message_fragment: "Something went wrong.",
      done: true,
    });
  }
};
