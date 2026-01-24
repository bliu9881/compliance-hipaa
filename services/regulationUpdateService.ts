import hipaaConfig from '../config/hipaa-regulations.json';

export interface RegulationUpdate {
  version: string;
  lastUpdated: string;
  hasUpdates: boolean;
  updateSummary?: string[];
  lastChecked?: string;
}

/**
 * Service to check for HIPAA regulation updates and ensure compliance audits use latest rules
 * Fetches from official HHS sources weekly and updates the regulations JSON
 */
export class RegulationUpdateService {
  private static instance: RegulationUpdateService;
  private lastCheckDate: Date;
  private currentVersion: string;
  private readonly STORAGE_KEY = 'hipaa_last_regulation_check';
  private readonly CHECK_INTERVAL_DAYS = 7;

  private constructor() {
    // Load last check date from localStorage if available
    const stored = typeof window !== 'undefined' ? localStorage.getItem(this.STORAGE_KEY) : null;
    this.lastCheckDate = stored ? new Date(stored) : new Date(0);
    this.currentVersion = hipaaConfig.version;
  }

  public static getInstance(): RegulationUpdateService {
    if (!RegulationUpdateService.instance) {
      RegulationUpdateService.instance = new RegulationUpdateService();
    }
    return RegulationUpdateService.instance;
  }

  /**
   * Check if we need to update our HIPAA regulation knowledge from official HHS sources
   * Performs weekly checks against HHS.gov cybersecurity guidance
   */
  public async checkForUpdates(): Promise<RegulationUpdate> {
    const now = new Date();
    const daysSinceLastCheck = Math.floor((now.getTime() - this.lastCheckDate.getTime()) / (1000 * 60 * 60 * 24));
    
    // Only check weekly to avoid excessive API calls
    if (daysSinceLastCheck < this.CHECK_INTERVAL_DAYS) {
      console.log(`📋 Regulation check skipped (last checked ${daysSinceLastCheck} days ago)`);
      return {
        version: this.currentVersion,
        lastUpdated: hipaaConfig.lastUpdated,
        hasUpdates: false,
        lastChecked: this.lastCheckDate.toISOString()
      };
    }

    try {
      console.log('🔍 Checking HHS.gov for HIPAA regulation updates...');
      
      // Call our backend API to check for updates
      const response = await fetch('/api/regulations-update');
      
      if (!response.ok) {
        throw new Error(`Update check failed: ${response.status}`);
      }

      const result = await response.json();
      
      // Update last check date
      this.lastCheckDate = now;
      if (typeof window !== 'undefined') {
        localStorage.setItem(this.STORAGE_KEY, now.toISOString());
      }
      
      if (result.hasUpdates) {
        console.log('✅ Regulation updates found:', result.changes);
        this.currentVersion = result.newVersion;
        
        return {
          version: result.newVersion,
          lastUpdated: hipaaConfig.lastUpdated,
          hasUpdates: true,
          updateSummary: result.changes,
          lastChecked: result.lastChecked
        };
      }
      
      console.log('✓ Regulations are current');
      return {
        version: this.currentVersion,
        lastUpdated: hipaaConfig.lastUpdated,
        hasUpdates: false,
        lastChecked: result.lastChecked
      };
    } catch (error) {
      console.warn('⚠️ Failed to check for regulation updates:', error);
      
      // Update last check date even on error to avoid hammering the API
      this.lastCheckDate = now;
      if (typeof window !== 'undefined') {
        localStorage.setItem(this.STORAGE_KEY, now.toISOString());
      }
      
      return {
        version: this.currentVersion,
        lastUpdated: hipaaConfig.lastUpdated,
        hasUpdates: false,
        lastChecked: now.toISOString()
      };
    }
  }

  /**
   * Get current HIPAA regulation version and metadata
   */
  public getCurrentRegulationInfo() {
    return {
      version: hipaaConfig.version,
      lastUpdated: hipaaConfig.lastUpdated,
      regulations: hipaaConfig.regulations,
      penaltyTiers: hipaaConfig.penaltyTiers,
      modernRequirements: hipaaConfig.modernRequirements
    };
  }

  /**
   * Get the audit prompt enhancement based on latest regulations
   */
  public getAuditEnhancements(): string {
    const info = this.getCurrentRegulationInfo();
    
    return `
REGULATION VERSION: ${info.version} (Updated: ${info.lastUpdated})

CURRENT PENALTY TIERS (2024):
- Tier 1: $${info.penaltyTiers.tier1.minPenalty.toLocaleString()}-$${info.penaltyTiers.tier1.maxPenalty.toLocaleString()} (${info.penaltyTiers.tier1.description})
- Tier 2: $${info.penaltyTiers.tier2.minPenalty.toLocaleString()}-$${info.penaltyTiers.tier2.maxPenalty.toLocaleString()} (${info.penaltyTiers.tier2.description})
- Tier 3: $${info.penaltyTiers.tier3.minPenalty.toLocaleString()}-$${info.penaltyTiers.tier3.maxPenalty.toLocaleString()} (${info.penaltyTiers.tier3.description})
- Tier 4: $${info.penaltyTiers.tier4.minPenalty.toLocaleString()}-$${info.penaltyTiers.tier4.maxPenalty.toLocaleString()} (${info.penaltyTiers.tier4.description})

MODERN CYBERSECURITY REQUIREMENTS:
${info.modernRequirements.cybersecurity.map(req => `- ${req}`).join('\n')}

TECHNICAL SAFEGUARDS UPDATES:
${info.modernRequirements.technicalSafeguards.map(req => `- ${req}`).join('\n')}
    `.trim();
  }



  /**
   * Get official sources for HIPAA regulations
   */
  public getOfficialSources(): string[] {
    return hipaaConfig.sources;
  }
}

export const regulationUpdateService = RegulationUpdateService.getInstance();