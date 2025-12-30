import { GoogleGenAI, Type } from "@google/genai";
import { Finding, Severity } from "../types.ts";

const HIPAA_SCHEMA = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      title: { 
        type: Type.STRING, 
        description: "A concise title of the HIPAA violation" 
      },
      severity: { 
        type: Type.STRING, 
        description: "Risk level: CRITICAL, HIGH, MEDIUM, or LOW" 
      },
      category: { 
        type: Type.STRING, 
        description: "The HIPAA rule category (e.g., Technical Safeguards, Privacy Rule)" 
      },
      description: { 
        type: Type.STRING, 
        description: "Detailed explanation of why this is a violation" 
      },
      recommendation: { 
        type: Type.STRING, 
        description: "Actionable fix recommendation" 
      },
      codeExample: { 
        type: Type.STRING, 
        description: "Secure code snippet to resolve the issue" 
      },
      file: { 
        type: Type.STRING, 
        description: "File path where issue was found" 
      },
      line: { 
        type: Type.INTEGER, 
        description: "Approximate line number" 
      },
    },
    propertyOrdering: ["title", "severity", "category", "description", "recommendation", "codeExample", "file", "line"],
    required: ["title", "severity", "category", "description", "recommendation", "codeExample"]
  }
};

export const analyzeCodeForHIPAA = async (code: string, fileName: string): Promise<Finding[]> => {
  // Use process.env.API_KEY directly as required by guidelines
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    console.error("Gemini Scan Error: API_KEY is missing.");
    return [{
      id: 'err-no-key',
      title: 'Configuration Error',
      severity: Severity.CRITICAL,
      category: 'System',
      description: 'The Gemini API Key is missing. The AI analysis cannot proceed.',
      recommendation: 'Check that the API_KEY environment variable is correctly set in your execution environment.',
      codeExample: '// API_KEY required'
    }];
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    // Complex reasoning tasks like code auditing require Gemini 3 Pro
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Audit this code snippet from "${fileName}" for HIPAA compliance issues (PHI leaks, encryption, access control, audit logs).
      
      Code:
      \`\`\`
      ${code}
      \`\`\``,
      config: {
        responseMimeType: "application/json",
        responseSchema: HIPAA_SCHEMA,
      },
    });

    // Directly access .text property
    const text = response.text;
    if (!text) throw new Error("Empty response from Gemini");

    const findings = JSON.parse(text.trim());
    return findings.map((f: any) => ({
      ...f,
      id: Math.random().toString(36).substr(2, 9),
    }));
  } catch (error) {
    console.error("Gemini Scan Error:", error);
    return [];
  }
};