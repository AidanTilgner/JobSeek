import { Socket } from "socket.io";
import {
  getChatFixBySuggestion,
  getChatFixBySuggestionStream,
} from "../../utils/llms";
import { Request, Response } from "express";

export const suggestFix = async (req: Request, res: Response) => {
  try {
    const original = req.query.original || req.body.original;
    const suggestion = req.query.suggestion || req.body.suggestion;
    const mode = req.query.mode || req.body.mode;
    const context = req.query.context || req.body.context;

    const response = await getChatFixBySuggestion(
      original as string,
      suggestion as string,
      "gpt-4",
      mode,
      context
    );

    res.status(200).json({
      success: response.success,
      message: response.message,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong.",
    });
  }
};

export const suggestFixStream = async (
  socket: Socket,
  payload: Request["body"] | Request["query"],
  eventName: string
) => {
  try {
    const original = payload.original;
    const suggestion = payload.suggestion;
    const mode = payload.mode;
    const context = payload.context;

    const response = await getChatFixBySuggestionStream(
      original,
      suggestion,
      "gpt-4",
      mode,
      context
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
            message_fragment: "",
            done: true,
          });
          return;
        }

        const decodedValue = new TextDecoder("utf-8").decode(value);

        socket.emit(eventName, {
          success: true,
          message_fragment: decodedValue,
          done: false,
          index: count++,
        });

        // Read next chunk
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
