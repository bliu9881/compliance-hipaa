# AuroScan - HIPAA Compliance Sentinel

AuroScan is a professional-grade HIPAA compliance auditing tool designed for healthcare applications. The platform provides automated security scanning and compliance verification for codebases handling Protected Health Information (PHI).

## Core Features

- **GitHub Repository Analysis**: Automated scanning of public repositories with incremental change detection
- **File Upload Scanning**: Direct analysis of local code files and projects
- **AI-Powered Analysis**: Uses AWS Bedrock (Claude models) and Google Gemini for intelligent HIPAA compliance detection
- **Compliance Reporting**: Detailed findings with severity levels (Critical, High, Medium, Low), regulatory references, and actionable remediation guidance
- **Business Associate Agreement (BAA) Generation**: Automated generation of HIPAA-compliant BAA documents
- **Historical Tracking**: Persistent scan history with cloud synchronization via Supabase

## Compliance Focus

The tool specifically targets HIPAA regulations including:
- Security Rule (45 CFR §164.302-318)
- Privacy Rule (45 CFR §164.500-534)
- Breach Notification Rule (45 CFR §164.400-414)

Findings are categorized by severity and include penalty tier assessments based on current HIPAA enforcement guidelines.

## Target Users

Healthcare technology teams, compliance officers, and developers building applications that handle PHI data.
