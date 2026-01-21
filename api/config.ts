export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Return the Gemini API key from server environment
  const geminiApiKey = process.env.VITE_GEMINI_API_KEY || '';

  console.log('🔧 Config endpoint called');
  console.log('🔑 VITE_GEMINI_API_KEY present:', !!geminiApiKey);
  console.log('🔑 VITE_GEMINI_API_KEY value (first 10 chars):', geminiApiKey?.substring(0, 10) || 'undefined');

  if (!geminiApiKey) {
    return res.status(500).json({ error: 'Gemini API key not configured' });
  }

  return res.status(200).json({ geminiApiKey });
}
