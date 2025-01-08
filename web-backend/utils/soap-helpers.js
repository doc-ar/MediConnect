import { GoogleGenerativeAI } from "@google/generative-ai";
import { currentDate } from "./date.js";

function getPrompt(name, age, gender, transcript) {
  const prompt =
    `Generate detailed SOAP notes in JSON format (subjective, objective, assessment, plan) based on the provided doctor-patient conversation, patient name, patient age, and patient gender.
Ensure:
1. Each section is clear, structured, and professional.
2. The subjective section includes a summary of the patient's complaints, symptoms, and any relevant history from the conversation.
3. The objective section remains placeholder-friendly if specific vitals and physical exam findings are unavailable but can be added by the user later.
4. The assessment outlines potential diagnoses or conditions based on the conversation.
5. The plan details actionable steps such as investigations, treatments, lifestyle recommendations, and follow-up plans.
Input Data:
- Patient Name: ${name}
- Patient Age: ${age}
- Patient Gender: ${gender}
- Conversation: "${transcript}"
Output Format (JSON):
{
  "subjective": "Detailed summary based on patient conversation...",
  "objective": "Placeholder-friendly physical exam and vitals details...",
  "assessment": "List of potential diagnoses or conditions...",
  "plan": "Detailed actionable steps for diagnosis, treatment, and follow-up..."
}
`.trim();
  return prompt;
}

async function getSOAPNotesFromGemini(prompt) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const response = await model.generateContent(prompt);
  const soapRaw = response.response.candidates[0].content.parts[0].text;
  const jsonOutput = JSON.parse(soapRaw.replace(/```json|```/g, "").trim());
  jsonOutput.lastUpdated = currentDate();
  return jsonOutput;
}

async function getSOAPNotesFromFlask(transcript) {
  const response = await fetch("http://127.0.0.1:5000", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ transcript }),
  });

  if (!response.ok) {
    throw new Error(`Flask server responded with status ${response.status}`);
  }

  const result = await response.json();
  result.soap_notes.lastUpdated = currentDate();
  return result;
}

export { getSOAPNotesFromGemini, getSOAPNotesFromFlask, getPrompt };
