import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const summarizeContent = async (text: string): Promise<string> => {
  if (!text || text.length < 10) {
    return "Not enough content to summarize yet.";
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Provide a concise, bulleted summary of the following document content. Keep it professional and brief:\n\n${text}`,
      config: {
        maxOutputTokens: 200,
      }
    });

    return response.text || "No summary generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Failed to generate summary. Please check your API configuration.";
  }
};