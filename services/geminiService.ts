
// Service for performing HIPAA compliance analysis using @google/genai
import { GoogleGenAI, Type } from "@google/genai";
import { Finding, Severity } from "../types";

// Schema for structured JSON output from Gemini.
// We specify propertyOrdering and types to ensure consistent results.
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
        description: "File path where issue was found (if provided)" 
      },
      line: { 
        type: Type.INTEGER, 
        description: "Approximate line number" 
      },
    },
    propertyOrdering: ["title", "severity", "category", "description", "recommendation", "codeExample", "file", "line"]
  }
};

/**
 * Analyzes code for HIPAA compliance issues using Gemini AI.
 */
export const analyzeCodeForHIPAA = async (code: string, fileName: string): Promise<Finding[]> => {
  // Use process.env.API_KEY directly as it is guaranteed to be available in the environment.
  if (!process.env.API_KEY) {
    console.error("Gemini Scan Error: API_KEY is missing in environment variables.");
    return [{
      id: 'err-no-key',
      title: 'Configuration Error',
      severity: Severity.CRITICAL,
      category: 'System',
      description: 'The Gemini API Key is missing. The AI analysis cannot proceed.',
      recommendation: 'Please ensure the API_KEY environment variable is configured in the environment settings.',
      codeExample: '// API_KEY required'
    }];
  }

  try {
    // Always initialize a new GoogleGenAI client with named apiKey parameter as per guidelines.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Using 'gemini-3-pro-preview' as this is a complex reasoning task (code auditing).
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
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

    // Access the text property directly from the response.
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
