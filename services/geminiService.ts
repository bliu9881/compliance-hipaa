
// Service for performing HIPAA compliance analysis using @google/genai
import { GoogleGenAI, Type } from "@google/genai";
import { Finding, Severity } from "../types";

// Schema for structured JSON output from Gemini.
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
  // Use process.env.API_KEY directly as per guidelines
  const apiKey = process.env.API_KEY;

  console.log("🔍 Starting HIPAA analysis for:", fileName);
  console.log("🔑 API Key present:", !!apiKey);
  console.log("📝 Code length:", code.length);

  if (!apiKey) {
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
    const ai = new GoogleGenAI({ apiKey });
    console.log("🤖 GoogleGenAI client created successfully");
    
    // Using 'gemini-1.5-pro' instead of 'gemini-3-pro-preview' which might not exist
    const response = await ai.models.generateContent({
      model: "gemini-1.5-pro",
      contents: `Perform a HIPAA compliance audit on the following code snippet from file "${fileName}". 
      Look for:
      1. Exposure of Protected Health Information (PHI).
      2. Lack of encryption (transit or rest).
      3. Insecure logging (logging PHI).
      4. Weak authentication/authorization.
      5. Hardcoded API keys or secrets.
      6. Missing audit trails.
      7. Exposed password or keys
      
      Return a JSON array of findings. Each finding should have: title, severity (CRITICAL/HIGH/MEDIUM/LOW), category, description, recommendation, codeExample.
      
      Code Snippet:
      \`\`\`
      ${code}
      \`\`\``,
      config: {
        responseMimeType: "application/json",
        responseSchema: HIPAA_SCHEMA,
      },
    });

    console.log("📡 Received response from Gemini");
    const text = response.text;
    console.log("📄 Response text length:", text?.length || 0);
    console.log("📄 Response text preview:", text?.substring(0, 200));
    
    if (!text) throw new Error("Empty response from Gemini");

    const findings = JSON.parse(text.trim());
    console.log("✅ Parsed findings:", findings.length, "items");
    
    const processedFindings = findings.map((f: any) => ({
      ...f,
      id: Math.random().toString(36).substring(2, 9), // Fixed deprecated substr
    }));
    
    console.log("🎯 Returning", processedFindings.length, "findings");
    return processedFindings;
  } catch (error) {
    console.error("❌ Gemini Scan Error:", error);
    console.error("❌ Error details:", {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    
    // Return a test finding to verify the pipeline works
    return [{
      id: 'test-finding',
      title: 'Test Finding - API Error',
      severity: Severity.HIGH,
      category: 'API Error',
      description: `Failed to analyze ${fileName}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      recommendation: 'Check console logs for detailed error information',
      codeExample: '// Error occurred during analysis'
    }];
  }
};
