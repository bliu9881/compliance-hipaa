import hipaaConfig from '../config/hipaa-regulations.json';

export interface RegulationUpdate {
  version: string;
  lastUpdated: string;
  hasUpdates: boolean;
  updateSummary?: string[];
}

/**
 * Service to check for HIPAA regulation updates and ensure compliance audits use latest rules
 */
export class RegulationUpdateService {
  private static instance: RegulationUpdateService;
  private lastCheckDate: Date;
  private currentVersion: string;

  private constructor() {
    this.lastCheckDate = new Date();
    this.currentVersion = hipaaConfig.version;
  }

  public static getInstance(): RegulationUpdateService {
    if (!RegulationUpdateService.instance) {
      RegulationUpdateService.instance = new RegulationUpdateService();
    }
    return RegulationUpdateService.instance;
  }

  /**
   * Check if we need to update our HIPAA regulation knowledge
   */
  public async checkForUpdates(): Promise<RegulationUpdate> {
    const now = new Date();
    const daysSinceLastCheck = Math.floor((now.getTime() - this.lastCheckDate.getTime()) / (1000 * 60 * 60 * 24));
    
    // Check for updates weekly
    if (daysSinceLastCheck < 7) {
      return {
        version: this.currentVersion,
        lastUpdated: hipaaConfig.lastUpdated,
        hasUpdates: false
      };
    }

    try {
      // In a real implementation, this would check HHS.gov APIs or RSS feeds
      // For now, we'll simulate checking against our config
      const hasUpdates = await this.simulateUpdateCheck();
      
      this.lastCheckDate = now;
      
      return {
        version: this.currentVersion,
        lastUpdated: hipaaConfig.lastUpdated,
        hasUpdates,
        updateSummary: hasUpdates ? [
          'New cybersecurity guidance from OCR',
          'Updated penalty amounts for 2024',
          'Enhanced cloud security requirements'
        ] : undefined
      };
    } catch (error) {
      console.warn('Failed to check for regulation updates:', error);
      return {
        version: this.currentVersion,
        lastUpdated: hipaaConfig.lastUpdated,
        hasUpdates: false
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
   * Simulate checking for regulation updates
   * In production, this would check official sources
   */
  private async simulateUpdateCheck(): Promise<boolean> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Randomly return true 10% of the time to simulate updates
    return Math.random() < 0.1;
  }

  /**
   * Get official sources for HIPAA regulations
   */
  public getOfficialSources(): string[] {
    return hipaaConfig.sources;
  }
}

export const regulationUpdateService = RegulationUpdateService.getInstance();