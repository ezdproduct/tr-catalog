import { GoogleGenerativeAI } from "@google/generative-ai";

// Using Gemini 1.5 Flash as it is the most stable and performant flash model currently available for this task.
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function getChatResponse(prompt: string, history: any[] = []) {
  try {
    const chat = model.startChat({
      history: history,
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7,
      },
    });

    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I'm sorry, I'm having trouble connecting to my robotic brain right now. Please try again later.";
  }
}
