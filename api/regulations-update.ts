import fs from 'fs';
import path from 'path';

interface RegulationCheckResult {
  hasUpdates: boolean;
  newVersion?: string;
  changes?: string[];
  lastChecked: string;
}

/**
 * Fetch and parse HHS cybersecurity guidance for updates
 */
async function fetchHHSGuidance(): Promise<string> {
  try {
    const response = await fetch('https://www.hhs.gov/hipaa/for-professionals/security/guidance/cybersecurity/index.html');
    if (!response.ok) throw new Error(`HHS fetch failed: ${response.status}`);
    return await response.text();
  } catch (error) {
    console.error('Failed to fetch HHS guidance:', error);
    return '';
  }
}

/**
 * Extract newsletter dates and topics from HHS page
 */
function parseNewsletterUpdates(html: string): string[] {
  const updates: string[] = [];
  
  // Look for newsletter entries with dates
  const newsletterPattern = /(\w+\s+\d{4})\s+OCR\s+Cybersecurity\s+Newsletter:\s+([^<]+)/g;
  let match;
  
  while ((match = newsletterPattern.exec(html)) !== null) {
    updates.push(`${match[1]}: ${match[2].trim()}`);
  }
  
  return updates;
}

/**
 * Check if regulations have been updated by comparing with HHS sources
 */
async function checkForRegulationUpdates(): Promise<RegulationCheckResult> {
  const regulationsPath = path.join(process.cwd(), 'compliance-hipaa/config/hipaa-regulations.json');
  
  try {
    // Read current regulations
    const currentRegulations = JSON.parse(fs.readFileSync(regulationsPath, 'utf-8'));
    const lastUpdated = new Date(currentRegulations.lastUpdated);
    const now = new Date();
    
    // Fetch latest from HHS
    const hhsHtml = await fetchHHSGuidance();
    const newsletters = parseNewsletterUpdates(hhsHtml);
    
    // Check if there are newer newsletters than our last update
    const hasNewerContent = newsletters.some(newsletter => {
      // Extract year from newsletter
      const yearMatch = newsletter.match(/(\d{4})/);
      if (!yearMatch) return false;
      const newsletterYear = parseInt(yearMatch[1]);
      return newsletterYear > lastUpdated.getFullYear() || 
             (newsletterYear === lastUpdated.getFullYear() && 
              new Date(newsletter).getTime() > lastUpdated.getTime());
    });
    
    if (hasNewerContent) {
      // Update the regulations file with new version and timestamp
      const newVersion = `2024.${Math.floor(now.getMonth() / 3) + 1}`;
      currentRegulations.version = newVersion;
      currentRegulations.lastUpdated = now.toISOString().split('T')[0];
      currentRegulations.regulations.securityRule.lastModified = now.toISOString().split('T')[0];
      
      // Add latest newsletter topics to key updates
      const latestNewsletters = newsletters.slice(0, 3);
      currentRegulations.regulations.securityRule.keyUpdates = [
        ...latestNewsletters.map(n => n.split(': ')[1] || n),
        'Enhanced cybersecurity requirements',
        'Cloud security guidance updates'
      ];
      
      // Write updated regulations back
      fs.writeFileSync(regulationsPath, JSON.stringify(currentRegulations, null, 2));
      
      return {
        hasUpdates: true,
        newVersion,
        changes: latestNewsletters,
        lastChecked: now.toISOString()
      };
    }
    
    return {
      hasUpdates: false,
      lastChecked: now.toISOString()
    };
  } catch (error) {
    console.error('Error checking for regulation updates:', error);
    return {
      hasUpdates: false,
      lastChecked: new Date().toISOString()
    };
  }
}

export default async function handler(req: any, res: any) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const result = await checkForRegulationUpdates();
    return res.status(200).json(result);
  } catch (error: any) {
    console.error('Regulation update check failed:', error);
    return res.status(500).json({ 
      error: 'Failed to check for updates',
      details: error.message 
    });
  }
}
