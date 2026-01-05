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

ANALYSIS INSTRUCTIONS:
- Examine each line of code systematically for HIPAA violations
- Look for multiple violations per line when they exist
- Consider both obvious security issues and subtle compliance gaps
- Analyze code patterns, configurations, and missing security controls
- Be thorough but focus on realistic, actionable violations

IMPORTANT: For each violation found, you MUST provide:
1. The exact file name: "${fileName}"
2. The specific line number where the violation occurs
3. If the violation spans multiple lines, provide the starting line number

Analyze for these HIPAA compliance violations:

TECHNICAL SAFEGUARDS:
1. Hardcoded credentials, passwords, API keys, or secrets
2. Unencrypted data storage (databases, files, variables containing sensitive data)
3. Unencrypted data transmission (HTTP instead of HTTPS, unencrypted connections)
4. Missing or inadequate authentication mechanisms
5. Missing or inadequate authorization/access controls
6. Insufficient audit logging for data access and modifications
7. Missing data integrity verification
8. Insecure session management
9. SQL injection vulnerabilities (dynamic query construction)
10. Cross-site scripting (XSS) vulnerabilities
11. Insecure direct object references
12. Missing input validation and sanitization

ADMINISTRATIVE SAFEGUARDS:
13. Missing security incident response procedures
14. Inadequate access management (overly broad permissions)
15. Missing workforce training indicators
16. Insufficient information system activity review

PHYSICAL SAFEGUARDS:
17. Inadequate workstation and device controls
18. Missing facility access controls in cloud configurations

PRIVACY RULE VIOLATIONS:
19. Potential exposure of Protected Health Information (PHI)
20. Violations of minimum necessary standard
21. Missing individual rights implementations
22. Inadequate business associate agreement requirements

INFRASTRUCTURE & CLOUD SECURITY:
23. Public accessibility where it should be private
24. Overly permissive security groups or firewall rules
25. Missing encryption at rest configurations
26. Inadequate backup and disaster recovery procedures
27. Missing compliance monitoring and alerting
28. Insecure network configurations
29. Missing multi-factor authentication requirements
30. Inadequate data retention and disposal policies

Return your findings as a JSON array. Each finding MUST have exactly these fields:
- title: string (concise violation title)
- severity: string (exactly one of: "CRITICAL", "HIGH", "MEDIUM", "LOW")
- category: string (HIPAA category like "Technical Safeguards", "Privacy Rule", "Administrative Safeguards")
- description: string (detailed explanation of the violation and its HIPAA implications)
- recommendation: string (specific actionable fix)
- codeExample: string (secure code snippet to resolve the issue)
- file: string (MUST be "${fileName}")
- line: number (specific line number where violation occurs - count from 1)

Code to analyze (with line numbers):
\`\`\`
${code.split('\n').map((line: string, index: number) => `${index + 1}: ${line}`).join('\n')}
\`\`\`

Be thorough and systematic in your analysis. Look for both obvious violations and subtle security gaps that could impact HIPAA compliance.

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
            max_tokens: 6000,
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
    
    // Return error instead of mock data
    return res.status(500).json({ 
      error: `Analysis failed: ${error.message}`,
      details: 'Check server logs for more information'
    });
  }
}