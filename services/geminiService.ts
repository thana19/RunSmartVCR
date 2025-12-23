import { GoogleGenAI } from "@google/genai";
import { CalculationResult } from "../types";

const formatPace = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const getCoachingAdvice = async (data: CalculationResult): Promise<string> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error("API Key is missing.");
    }

    const ai = new GoogleGenAI({ apiKey });

    // Using gemini-3-flash-preview for fast text generation
    const model = "gemini-3-flash-preview";

    const prompt = `
      You are an expert running coach. Analyze the following runner's data from a time trial test.
      
      Test Duration: ${data.duration} minutes
      Distance Covered: ${data.distance} km
      Calculated Threshold Pace: ${formatPace(data.thresholdPace)} /km
      Estimated VO2 Max: ${data.vo2MaxEstimate.toFixed(1)} ml/kg/min
      
      Please provide:
      1. A brief assessment of their current fitness level.
      2. Three specific training tips to improve their Threshold Pace.
      3. A suggested workout for next week based on their zones.
      
      Keep the tone encouraging, professional, and concise. Format with clear headings in Markdown.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text || "Unable to generate advice at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I couldn't connect to the AI coach right now. Please try again later.";
  }
};