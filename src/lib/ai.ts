import { ChatOpenAI } from "langchain/chat_models/openai";
import { CallbackManager } from "langchain/callbacks";

import { ChatCraftMessage, ChatCraftSystemMessage } from "./ChatCraftMessage";
// TODO: not sure where to put this...
import { defaultSystemMessage } from "../hooks/use-system-message";

export type ChatOptions = {
  apiKey: string;
  model: GptModel;
  temperature?: number;
  onToken: (token: string, currentText: string) => void;
  controller?: AbortController;
  systemMessage?: string;
};

export const chat = (messages: ChatCraftMessage[], options: ChatOptions) => {
  const buffer: string[] = [];
  const chatOpenAI = new ChatOpenAI({
    openAIApiKey: options.apiKey,
    temperature: options.temperature ?? 0,
    streaming: true,
    modelName: options.model,
  });

  // Allow the stream to be cancelled
  const controller = options.controller ?? new AbortController();

  // Send the chat history + user's prompt, and prefix it all with our system message
  const systemChatMessage = new ChatCraftSystemMessage({
    text: options.systemMessage ?? defaultSystemMessage,
  });

  return chatOpenAI
    .call(
      [systemChatMessage, ...messages],
      {
        options: { signal: controller.signal },
      },
      CallbackManager.fromHandlers({
        handleLLMNewToken(token: string) {
          buffer.push(token);
          options.onToken(token, buffer.join(""));
        },
      })
    )
    .then(({ text }) => text);
};