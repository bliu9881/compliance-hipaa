import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';

export default async function handler(req: any, res: any) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code, fileName } = req.body;

  if (!code || !fileName) {
    return res.status(400).json({ error: 'Code and fileName are required' });
  }

  // Get AWS credentials from server environment
  const region = process.env.AWS_REGION || 'us-east-1';
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

  if (!accessKeyId || !secretAccessKey) {
    console.error('AWS credentials missing on server');
    return res.status(500).json({ error: 'AWS credentials not configured' });
  }

  const prompt = `Human: Perform a comprehensive HIPAA compliance audit on the following code snippet from file "${fileName}". 

IMPORTANT: For each violation found, you MUST provide:
1. The exact file name: "${fileName}"
2. The specific line number where the violation occurs
3. If the violation spans multiple lines, provide the starting line number

Analyze for these specific HIPAA violations:
1. Exposure of Protected Health Information (PHI) - names, SSNs, medical records, etc.
2. Lack of encryption in transit (HTTP instead of HTTPS)
3. Lack of encryption at rest (unencrypted databases, files)
4. Insecure logging that could expose PHI
5. Weak authentication/authorization mechanisms
6. Hardcoded API keys, passwords, or secrets
7. Missing audit trails for PHI access
8. Inadequate access controls
9. Data retention policy violations
10. Missing data integrity checks

Return your findings as a JSON array. Each finding MUST have exactly these fields:
- title: string (concise violation title)
- severity: string (exactly one of: "CRITICAL", "HIGH", "MEDIUM", "LOW")
- category: string (HIPAA category like "Technical Safeguards", "Privacy Rule", "Security Rule")
- description: string (detailed explanation of the violation)
- recommendation: string (specific actionable fix)
- codeExample: string (secure code snippet to resolve the issue)
- file: string (MUST be "${fileName}")
- line: number (specific line number where violation occurs - count from 1)

Code to analyze (with line numbers):
\`\`\`
${code.split('\n').map((line: string, index: number) => `${index + 1}: ${line}`).join('\n')}
\`\`\`

Return only the JSON array, no other text. ENSURE every finding includes the file name "${fileName}" and a specific line number.
Assistant: I'll analyze this code for HIPAA compliance violations and return my findings as a JSON array.`;

  try {
    const client = new BedrockRuntimeClient({
      region: region,
      credentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
      },
    });

    const modelIds = [
      "anthropic.claude-3-5-sonnet-20240620-v1:0",
      "anthropic.claude-3-sonnet-20240229-v1:0",
      "anthropic.claude-v2:1",
    ];

    let response;
    
    for (const modelId of modelIds) {
      try {
        const command = new InvokeModelCommand({
          modelId: modelId,
          contentType: "application/json",
          accept: "application/json",
          body: JSON.stringify({
            anthropic_version: "bedrock-2023-05-31",
            max_tokens: 4000,
            temperature: 0.1,
            messages: [
              {
                role: "user",
                content: prompt
              }
            ]
          })
        });

        response = await client.send(command);
        break;
      } catch (modelError: any) {
        console.log("Model", modelId, "failed:", modelError.message);
        if (modelId === modelIds[modelIds.length - 1]) {
          throw modelError;
        }
      }
    }

    if (!response) {
      throw new Error("No response received from any model");
    }

    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    const text = responseBody.content[0]?.text || '';

    if (!text) throw new Error("Empty response from Bedrock");

    // Extract JSON from response
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    const jsonText = jsonMatch ? jsonMatch[0] : text;
    
    const findings = JSON.parse(jsonText.trim());
    
    const processedFindings = findings.map((f: any) => ({
      ...f,
      id: Math.random().toString(36).substring(2, 9),
    }));

    return res.status(200).json({ findings: processedFindings });

  } catch (error: any) {
    console.error("Bedrock API Error:", error);
    
    // Return mock data for testing
    const mockFindings = [
      {
        id: 'mock-1',
        title: 'API Error - Using Mock Data',
        severity: 'HIGH',
        category: 'System',
        description: `Analysis failed for ${fileName}: ${error.message}`,
        recommendation: 'Check server logs and AWS configuration.',
        codeExample: '// Mock finding due to API error',
        file: fileName,
        line: 1
      }
    ];
    
    return res.status(200).json({ findings: mockFindings });
  }
}