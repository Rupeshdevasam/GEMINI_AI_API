import { GoogleGenerativeAI } from "@google/generative-ai";

import { aiConfig } from "../config/aiConfig.js";

const genAI = new GoogleGenerativeAI(aiConfig.gemini.apiKey);

//These arrays are to maintain the history of the conversation
const conversationContext = [];
const currentMessages = [];

// Model initialization
const modelId = "gemini-pro";
const model = genAI.getGenerativeModel({ model: modelId });

// Controller function to handle chat conversation
export const  generateChatResponse = async (prompt) => {
  try {

    // Restore the previous context
    for (const [inputText, responseText] of conversationContext) {
      currentMessages.push({ role: "user", parts: inputText });
      currentMessages.push({ role: "model", parts: responseText });
    }

    const chat = model.startChat({
      history: currentMessages,
      generationConfig: {
        maxOutputTokens: 100,
      },
    });

    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    console.log(response)
    const responseText = response.text();

    // Stores the conversation
    conversationContext.push([prompt, responseText]);
    console.log(responseText)
    return {result: responseText};
  } catch (err) {
    console.error(err);
    return { Error: "Uh oh! Caught error while fetching AI response" };
  }
};
