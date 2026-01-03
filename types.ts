
export enum Severity {
  CRITICAL = 'CRITICAL',
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW'
}

export enum ScanStatus {
  IDLE = 'IDLE',
  SCANNING = 'SCANNING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

export interface Finding {
  id: string;
  title: string;
  severity: Severity;
  category: string;
  description: string;
  file?: string;
  line?: number;
  recommendation: string;
  codeExample: string;
  regulation?: string; // CFR reference like "45 CFR §164.312(a)(1)"
  penaltyTier?: string; // Penalty tier: "Tier 1", "Tier 2", "Tier 3", "Tier 4"
}

export interface ScanResult {
  id: string;
  timestamp: number;
  source: 'github' | 'upload';
  sourceName: string;
  status: ScanStatus;
  findings: Finding[];
  summary: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  lastCommitHash?: string;
  filesScanned?: number; // Add file count tracking
}

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}
