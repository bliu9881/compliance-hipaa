
import { GoogleGenAI, Type } from "@google/genai";
import { Finding, Severity } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const HIPAA_SCHEMA = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING, description: "A concise title of the HIPAA violation" },
      severity: { type: Type.STRING, enum: ["CRITICAL", "HIGH", "MEDIUM", "LOW"], description: "Risk level" },
      category: { type: Type.STRING, description: "The HIPAA rule category (e.g., Technical Safeguards, Privacy Rule)" },
      description: { type: Type.STRING, description: "Detailed explanation of why this is a violation" },
      recommendation: { type: Type.STRING, description: "Actionable fix recommendation" },
      codeExample: { type: Type.STRING, description: "Secure code snippet to resolve the issue" },
      file: { type: Type.STRING, description: "File path where issue was found (if provided)" },
      line: { type: Type.INTEGER, description: "Approximate line number" },
    },
    required: ["title", "severity", "category", "description", "recommendation", "codeExample"]
  }
};

export const analyzeCodeForHIPAA = async (code: string, fileName: string): Promise<Finding[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Perform a HIPAA compliance audit on the following code snippet from file "${fileName}". 
      Look for:
      1. Exposure of Protected Health Information (PHI).
      2. Lack of encryption (transit or rest).
      3. Insecure logging (logging PHI).
      4. Weak authentication/authorization.
      5. Hardcoded API keys or secrets.
      6. Missing audit trails.
      
      Code Snippet:
      \`\`\`
      ${code}
      \`\`\``,
      config: {
        responseMimeType: "application/json",
        responseSchema: HIPAA_SCHEMA,
      },
    });

    const findings = JSON.parse(response.text);
    return findings.map((f: any) => ({
      ...f,
      id: Math.random().toString(36).substr(2, 9),
    }));
  } catch (error) {
    console.error("Gemini Scan Error:", error);
    return [];
  }
};
