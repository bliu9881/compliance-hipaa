import { Finding, Severity } from '../types';

export const analyzeCodeForHIPAA = async (code: string, fileName: string): Promise<Finding[]> => {
  console.log("🔍 Starting HIPAA analysis via API for:", fileName);

  try {
    // Call our secure API endpoint (works on Vercel as serverless function)
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code,
        fileName
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: response.statusText }));
      throw new Error(errorData.error || `API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error);
    }

    console.log("✅ Received findings from API:", data.findings?.length || 0);
    return data.findings || [];

  } catch (error: any) {
    console.error("❌ API Scan Error:", error);
    
    // Return error finding with helpful message
    return [{
      id: 'api-error',
      title: 'Analysis Service Error',
      severity: Severity.HIGH,
      category: 'System',
      description: `Failed to analyze ${fileName}: ${error instanceof Error ? error.message : 'Unknown error'}. The analysis service may not be deployed or configured correctly.`,
      recommendation: 'Ensure the /api/analyze endpoint is deployed and AWS credentials are configured in Vercel environment variables.',
      codeExample: '// Check Vercel deployment and environment variables',
      file: fileName,
      line: 1
    }];
  }
};