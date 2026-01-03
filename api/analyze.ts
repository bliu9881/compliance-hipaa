import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';
import { regulationUpdateService } from '../services/regulationUpdateService';

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

  // Check for regulation updates and get current requirements
  const updateCheck = await regulationUpdateService.checkForUpdates();
  const auditEnhancements = regulationUpdateService.getAuditEnhancements();
  
  console.log(`Using HIPAA regulations version: ${updateCheck.version} (${updateCheck.lastUpdated})`);
  if (updateCheck.hasUpdates) {
    console.log('New regulation updates available:', updateCheck.updateSummary);
  }

  const prompt = `Human: Perform a comprehensive HIPAA compliance audit on the following code snippet from file "${fileName}" using the LATEST 2024 HIPAA regulations and industry best practices.

${auditEnhancements}

CRITICAL: Use the most current HIPAA requirements including:
- HIPAA Security Rule (45 CFR §164.302-318) - Updated 2024
- HIPAA Privacy Rule (45 CFR §164.500-534) - Updated 2024  
- HIPAA Breach Notification Rule (45 CFR §164.400-414) - Updated 2024
- HITECH Act requirements for enhanced penalties and breach notifications
- OCR Guidance on Cybersecurity (2024 updates)
- Recent OCR enforcement actions and settlement agreements

IMPORTANT: For each violation found, you MUST provide:
1. The exact file name: "${fileName}"
2. The specific line number where the violation occurs
3. Reference to specific HIPAA regulation (CFR section)
4. Current penalty ranges for violations

Analyze for these UPDATED HIPAA violations with 2024 standards:

ADMINISTRATIVE SAFEGUARDS:
1. Missing Security Officer designation in code comments/documentation
2. Inadequate workforce training indicators (missing security awareness)
3. Information access management violations
4. Security incident procedures missing
5. Contingency plan implementation gaps

PHYSICAL SAFEGUARDS:
6. Workstation use controls missing in remote access code
7. Device and media controls inadequate
8. Facility access controls not implemented in cloud configurations

TECHNICAL SAFEGUARDS:
9. Access control violations - inadequate unique user identification
10. Audit controls missing - no logging of PHI access/modifications
11. Integrity controls missing - no data integrity verification
12. Person or entity authentication inadequate
13. Transmission security violations - unencrypted PHI transmission

PRIVACY RULE VIOLATIONS:
14. Minimum necessary standard violations
15. Individual rights violations (access, amendment, accounting)
16. Notice of privacy practices missing
17. Business associate agreement requirements not met

BREACH NOTIFICATION VIOLATIONS:
18. Missing breach detection mechanisms
19. Inadequate breach assessment procedures
20. Missing notification timelines implementation

MODERN CYBERSECURITY REQUIREMENTS (2024):
21. Multi-factor authentication missing for PHI access
22. Zero-trust architecture principles not implemented
23. Cloud security misconfigurations
24. API security vulnerabilities
25. Container/microservices security gaps
26. Supply chain security issues
27. AI/ML model security for PHI processing
28. Remote work security controls missing

Return your findings as a JSON array. Each finding MUST have exactly these fields:
- title: string (concise violation title)
- severity: string (exactly one of: "CRITICAL", "HIGH", "MEDIUM", "LOW")
- category: string (specific HIPAA category like "Technical Safeguards - Access Control", "Privacy Rule - Minimum Necessary", "Administrative Safeguards - Security Officer")
- description: string (detailed explanation referencing specific CFR section)
- recommendation: string (specific actionable fix with 2024 best practices)
- codeExample: string (secure code snippet following current standards)
- file: string (MUST be "${fileName}")
- line: number (specific line number where violation occurs - count from 1)
- regulation: string (specific CFR reference like "45 CFR §164.312(a)(1)")
- penaltyTier: string (applicable penalty tier: "Tier 1", "Tier 2", "Tier 3", or "Tier 4")

Code to analyze (with line numbers):
\`\`\`
${code.split('\n').map((line: string, index: number) => `${index + 1}: ${line}`).join('\n')}
\`\`\`

Return only the JSON array, no other text. ENSURE every finding includes the file name "${fileName}", specific line number, CFR regulation reference, and penalty tier.
Assistant: I'll analyze this code for HIPAA compliance violations using the latest 2024 regulations and return my findings as a JSON array.`;

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