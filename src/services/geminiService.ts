
import { GoogleGenAI } from "@google/genai";

export const askGemini = async (prompt: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = 'gemini-3-flash-preview';

  const systemInstruction = `
    You are the DUET Robotics Club (DRC) AI Assistant. 
    You are professional, encouraging, and highly knowledgeable about robotics and the club.
    DUET is Dhaka University of Engineering & Technology, located in Gazipur, Bangladesh.
    Club Activities include: LFR, Drones, Soccer Bots, Firefighting robots, and various workshops.
    You help potential members understand the club's mission and technical focus.
    Keep responses concise and helpful. Use markdown formatting.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
      },
    });

    return response.text || "I'm sorry, I couldn't process that request right now.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "The AI assistant is currently recharging its circuits. Please try again later!";
  }
};
