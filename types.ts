
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
