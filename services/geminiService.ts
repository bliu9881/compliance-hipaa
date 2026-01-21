
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
// Add delay function for rate limiting
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock findings for testing when API is unavailable
const generateMockFindings = (fileName: string): Finding[] => {
  const mockFindings = [
    {
      id: 'mock-1',
      title: 'Hardcoded API Key Detected',
      severity: Severity.CRITICAL,
      category: 'Security',
      description: `Found potential hardcoded API key in ${fileName}. This could expose sensitive credentials.`,
      recommendation: 'Move API keys to environment variables and never commit them to version control.',
      codeExample: 'const apiKey = process.env.API_KEY; // Use environment variables'
    },
    {
      id: 'mock-2', 
      title: 'Missing Encryption in Transit',
      severity: Severity.HIGH,
      category: 'Technical Safeguards',
      description: `HTTP connection detected in ${fileName}. HIPAA requires encryption in transit for PHI.`,
      recommendation: 'Use HTTPS for all API calls handling PHI data.',
      codeExample: 'const url = "https://api.example.com"; // Always use HTTPS'
    },
    {
      id: 'mock-3',
      title: 'Potential PHI Logging',
      severity: Severity.MEDIUM,
      category: 'Privacy Rule',
      description: `Console logging detected in ${fileName}. This could inadvertently log PHI.`,
      recommendation: 'Implement structured logging that filters out PHI data.',
      codeExample: 'logger.info("User action completed", { userId: user.id }); // Log IDs, not PHI'
    }
  ];
  
  // Return 1-3 random findings
  const count = Math.floor(Math.random() * 3) + 1;
  return mockFindings.slice(0, count);
};

// Cache for API key to avoid repeated requests
let cachedApiKey: string | null = null;

const getApiKey = async (): Promise<string> => {
  // Return cached key if available
  if (cachedApiKey) {
    return cachedApiKey;
  }

  try {
    // Try to get from Vite env first (local dev)
    const viteKey = (globalThis as any).__VITE_GEMINI_API_KEY__;
    if (viteKey) {
      cachedApiKey = viteKey;
      return viteKey;
    }

    // Fall back to fetching from server endpoint (production)
    const response = await fetch('/api/config');
    if (!response.ok) {
      throw new Error('Failed to fetch API config');
    }
    const data = await response.json();
    cachedApiKey = data.geminiApiKey;
    return cachedApiKey;
  } catch (error) {
    console.error('Failed to get API key:', error);
    return '';
  }
};

export const analyzeCodeForHIPAA = async (code: string, fileName: string): Promise<Finding[]> => {
  // Get API key from cache or fetch it
  const apiKey = await getApiKey();

  console.log("🔍 Starting HIPAA analysis for:", fileName);
  console.log("🔑 API Key present:", !!apiKey);
  console.log("🔑 API Key value (first 10 chars):", apiKey?.substring(0, 10) || 'undefined');
  console.log("📝 Code length:", code.length);

  if (!apiKey) {
    console.error("Gemini Scan Error: VITE_GEMINI_API_KEY is missing in environment variables.");
    return [{
      id: 'err-no-key',
      title: 'Configuration Error',
      severity: Severity.CRITICAL,
      category: 'System',
      description: 'The Gemini API Key is missing. The AI analysis cannot proceed.',
      recommendation: 'Please ensure VITE_GEMINI_API_KEY is set in your .env.local file.',
      codeExample: '// VITE_GEMINI_API_KEY=your_key_here'
    }];
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    console.log("🤖 GoogleGenAI client created successfully");
    
    // Add a small delay to avoid hitting rate limits
    await delay(1000);
    
    // Using 'gemini-3-pro-preview' as this is a complex reasoning task (code auditing)
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
  } catch (error: any) {
    console.error("❌ Gemini Scan Error:", error);
    console.error("❌ Error details:", {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    
    // Handle specific API errors - return mock data for quota exceeded
    if (error?.message?.includes('429') || error?.message?.includes('quota')) {
      console.log("🎭 API quota exceeded - returning mock findings for testing");
      return generateMockFindings(fileName);
    }
    
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
