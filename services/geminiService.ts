import { GoogleGenAI } from "@google/genai";
import { CalculationResult } from "../types";

const formatPace = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const getApiKey = () => {
  return localStorage.getItem('gemini_api_key') || process.env.API_KEY;
};

export const getCoachingAdvice = async (data: CalculationResult, lang: string): Promise<string> => {
  try {
    const apiKey = getApiKey();
    
    if (!apiKey) {
      throw new Error("API Key is missing. Please check your settings.");
    }

    const ai = new GoogleGenAI({ apiKey });

    // Using gemini-3-flash-preview for fast text generation
    const model = "gemini-3-flash-preview";

    const languageInstruction = lang === 'th' 
      ? "IMPORTANT: Please answer entirely in Thai language (ภาษาไทย). Use running terminology commonly used by Thai runners (e.g., maintain English terms for specific zones like 'Threshold' or 'Interval' if appropriate, but explain in Thai)."
      : "Please answer in English.";

    const prompt = `
      You are an expert running coach. Analyze the following runner's data from a time trial test.
      
      Test Duration: ${data.duration} minutes
      Distance Covered: ${data.distance} km
      Calculated Threshold Pace: ${formatPace(data.thresholdPace)} /km
      Estimated VO2 Max: ${data.vo2MaxEstimate.toFixed(1)} ml/kg/min
      
      ${languageInstruction}

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
    const errorMsg = lang === 'th'
      ? "ขออภัย ไม่สามารถเชื่อมต่อกับ AI Coach ได้ (กรุณาตรวจสอบ API Key ที่เมนูตั้งค่า)"
      : "Sorry, I couldn't connect to the AI coach. Please check your API Key in settings.";
    return errorMsg;
  }
};

export const getTrainingPlan = async (data: CalculationResult, lang: string): Promise<string> => {
  try {
    const apiKey = getApiKey();
    if (!apiKey) throw new Error("API Key missing");

    const ai = new GoogleGenAI({ apiKey });
    const model = "gemini-3-flash-preview";

    const zonesList = data.zones.map(z => `- ${z.name}: ${formatPace(z.maxPace)} - ${formatPace(z.minPace)} /km`).join('\n');

    const languageInstruction = lang === 'th' 
      ? "IMPORTANT: Output the plan in Thai language (ภาษาไทย)."
      : "Output in English.";

    const prompt = `
      Create a structured 6-week daily running training plan for a runner with these stats:
      
      - Threshold Pace (T-Pace): ${formatPace(data.thresholdPace)} /km
      - Training Zones:
      ${zonesList}
      
      ${languageInstruction}

      Requirements:
      1. The goal is to improve Threshold Speed and VO2 Max.
      2. Provide a day-by-day plan for 6 weeks (Week 1 to Week 6).
      3. Use the specific Paces provided in the Zones above for every workout.
      4. Include Rest days.
      5. Format using strict bullet points for each day/week. Do NOT use Markdown tables. Use clear headings for each week.
      6. Be concise but specific about duration/distance and intensity (e.g., "5km Easy Run @ 6:00-6:30/km").
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text || "Unable to generate plan.";
  } catch (error) {
    console.error("Gemini API Error (Plan):", error);
    return lang === 'th' 
      ? "ไม่สามารถสร้างตารางฝึกซ้อมได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง" 
      : "Unable to generate training plan at this time. Please try again.";
  }
};