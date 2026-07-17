import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function main() {
  try {
    const response = await ai.models.generateContent({
      model: "models/gemini-2.0-flash",
      contents: "Reply with only: Hello",
    });

    console.log("SUCCESS:");
    console.log(response.text);
  } catch (err) {
    console.error("ERROR:");
    console.error(err);
  }
}

main();