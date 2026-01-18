export interface BAATemplate {
  id: string;
  name: string;
  description: string;
  sections: BAASection[];
}

export interface BAASection {
  title: string;
  content: string;
  required: boolean;
  customizable: boolean;
}

export interface BAAGenerationOptions {
  coveredEntityName: string;
  businessAssociateName: string;
  effectiveDate: string;
  servicesDescription: string;
  includeSubcontractors: boolean;
  includeCloudServices: boolean;
  includeAIProcessing: boolean;
  customClauses?: string[];
}

export interface GeneratedBAA {
  id: string;
  timestamp: number;
  options: BAAGenerationOptions;
  content: string;
  sections: BAASection[];
}

/**
 * Service for generating HIPAA Business Associate Agreements
 */
export class BAAService {
  private static instance: BAAService;

  private constructor() {}

  public static getInstance(): BAAService {
    if (!BAAService.instance) {
      BAAService.instance = new BAAService();
    }
    return BAAService.instance;
  }

  /**
   * Get available BAA templates
   */
  public getTemplates(): BAATemplate[] {
    return [
      {
        id: 'standard-2024',
        name: 'Standard BAA (2024)',
        description: 'Comprehensive BAA template compliant with current HIPAA regulations',
        sections: this.getStandardSections()
      },
      {
        id: 'cloud-services-2024',
        name: 'Cloud Services BAA (2024)',
        description: 'Specialized template for cloud service providers and SaaS platforms',
        sections: this.getCloudServicesSections()
      },
      {
        id: 'ai-ml-2024',
        name: 'AI/ML Processing BAA (2024)',
        description: 'Template for AI/ML services that process PHI data',
        sections: this.getAIMLSections()
      }
    ];
  }

  /**
   * Generate a BAA document based on provided options
   */
  public async generateBAA(options: BAAGenerationOptions, templateId: string = 'standard-2024'): Promise<GeneratedBAA> {
    const template = this.getTemplates().find(t => t.id === templateId);
    if (!template) {
      throw new Error('Template not found');
    }

    const sections = template.sections.map(section => ({
      ...section,
      content: this.populateTemplate(section.content, options)
    }));

    const content = this.generateFullDocument(sections, options);

    return {
      id: Date.now().toString(),
      timestamp: Date.now(),
      options,
      content,
      sections
    };
  }

  /**
   * Get standard BAA sections
   */
  private getStandardSections(): BAASection[] {
    return [
      {
        title: 'Definitions',
        content: `For purposes of this Agreement, the following terms shall have the following meanings:

a) "Business Associate" shall mean {{businessAssociateName}}.
b) "Covered Entity" shall mean {{coveredEntityName}}.
c) "Protected Health Information" or "PHI" shall have the same meaning as set forth in 45 CFR § 164.501.
d) "Required by Law" shall have the same meaning as set forth in 45 CFR § 164.501.
e) "Secretary" shall mean the Secretary of the Department of Health and Human Services or his/her designee.`,
        required: true,
        customizable: false
      },
      {
        title: 'Permitted Uses and Disclosures',
        content: `Business Associate may use or disclose PHI only as permitted or required by this Agreement or as Required by Law. Business Associate may use or disclose PHI for the proper management and administration of Business Associate or to carry out the legal responsibilities of Business Associate, provided the disclosures are Required by Law, or Business Associate obtains reasonable assurances from the person to whom the information is disclosed that the information will remain confidential and used or further disclosed only as Required by Law or for the purposes for which it was disclosed to the person, and the person notifies Business Associate of any instances of which it is aware in which the confidentiality of the information has been breached.

Services Description: {{servicesDescription}}`,
        required: true,
        customizable: true
      },
      {
        title: 'Prohibited Uses and Disclosures',
        content: `Business Associate shall not use or disclose PHI other than as permitted or required by this Agreement or as Required by Law. Business Associate shall not use or disclose PHI in a manner that would violate Subpart E of 45 CFR Part 164 if done by Covered Entity.`,
        required: true,
        customizable: false
      },
      {
        title: 'Safeguards',
        content: `Business Associate shall use appropriate safeguards, and shall comply with Subpart C of 45 CFR Part 164 with respect to electronic PHI, to prevent use or disclosure of PHI other than as provided for by this Agreement.

Required Technical Safeguards:
• Access Control (45 CFR § 164.312(a))
• Audit Controls (45 CFR § 164.312(b))
• Integrity (45 CFR § 164.312(c))
• Person or Entity Authentication (45 CFR § 164.312(d))
• Transmission Security (45 CFR § 164.312(e))

Required Administrative Safeguards:
• Security Officer (45 CFR § 164.308(a)(2))
• Workforce Training (45 CFR § 164.308(a)(5))
• Information Access Management (45 CFR § 164.308(a)(4))
• Security Incident Procedures (45 CFR § 164.308(a)(6))`,
        required: true,
        customizable: true
      },
      {
        title: 'Breach Notification',
        content: `Business Associate shall, following the discovery of a breach of unsecured PHI, notify Covered Entity of such breach without unreasonable delay and in no case later than 60 calendar days after discovery of the breach. Such notice shall include, to the extent possible:

a) A brief description of what happened, including the date of the breach and the date of the discovery of the breach, if known;
b) A description of the types of unsecured PHI that were involved in the breach;
c) Any steps individuals should take to protect themselves from potential harm resulting from the breach;
d) A brief description of what Business Associate is doing to investigate the breach, to mitigate harm to individuals, and to protect against any further breaches; and
e) Contact procedures for Covered Entity to ask questions or learn additional information.`,
        required: true,
        customizable: false
      },
      {
        title: 'Individual Rights',
        content: `Business Associate shall provide access to PHI in a Designated Record Set to Covered Entity or, as directed by Covered Entity, to an Individual in order to meet the requirements under 45 CFR § 164.524.

Business Associate shall make any amendment(s) to PHI in a Designated Record Set as directed or agreed to by Covered Entity pursuant to 45 CFR § 164.526, or take other measures as necessary to satisfy Covered Entity's obligations under 45 CFR § 164.526.

Business Associate shall make internal practices, books, and records relating to the use and disclosure of PHI received from, or created or received by Business Associate on behalf of, Covered Entity available to Covered Entity, or at the request of Covered Entity to the Secretary, in a time and manner designated by Covered Entity or the Secretary, for purposes of the Secretary determining Covered Entity's compliance with the Privacy Rule.`,
        required: true,
        customizable: false
      },
      {
        title: 'Minimum Necessary',
        content: `Business Associate shall, to the extent practicable, limit its use, disclosure, or request of PHI to the minimum necessary to accomplish the intended purpose of the use, disclosure, or request.`,
        required: true,
        customizable: false
      },
      {
        title: 'Term and Termination',
        content: `This Agreement shall be effective as of {{effectiveDate}} and shall terminate when all of the PHI provided by Covered Entity to Business Associate, or created or received by Business Associate on behalf of Covered Entity, is destroyed or returned to Covered Entity, or, if it is infeasible to return or destroy PHI, protections are extended to such information, in accordance with the termination provisions in this Section.

Upon termination of this Agreement, for any reason, Business Associate shall return or destroy all PHI received from Covered Entity, or created or received by Business Associate on behalf of Covered Entity. This provision shall apply to PHI that is in the possession of subcontractors or agents of Business Associate. Business Associate shall retain no copies of the PHI.`,
        required: true,
        customizable: true
      }
    ];
  }

  /**
   * Get cloud services specific sections
   */
  private getCloudServicesSections(): BAASection[] {
    const standardSections = this.getStandardSections();
    
    // Add cloud-specific sections
    const cloudSections: BAASection[] = [
      {
        title: 'Cloud Infrastructure Security',
        content: `Business Associate warrants that its cloud infrastructure meets or exceeds the following security standards:

• SOC 2 Type II certification
• ISO 27001 certification
• FedRAMP authorization (if applicable)
• Encryption at rest using AES-256 or equivalent
• Encryption in transit using TLS 1.3 or higher
• Multi-factor authentication for administrative access
• Regular security assessments and penetration testing
• 24/7 security monitoring and incident response

Data Location: Business Associate shall ensure that all PHI is stored and processed within the United States unless explicitly authorized in writing by Covered Entity.`,
        required: true,
        customizable: true
      },
      {
        title: 'Subcontractors and Third-Party Services',
        content: `Business Associate may engage subcontractors to perform services on behalf of Covered Entity, provided that Business Associate enters into a written agreement with each subcontractor that contains terms substantially similar to this Agreement.

Current subcontractors include:
• Cloud infrastructure providers (AWS, Azure, GCP)
• Monitoring and logging services
• Backup and disaster recovery services

Business Associate shall provide Covered Entity with a current list of all subcontractors upon request and notify Covered Entity of any changes to subcontractors within 30 days.`,
        required: true,
        customizable: true
      }
    ];

    return [...standardSections, ...cloudSections];
  }

  /**
   * Get AI/ML specific sections
   */
  private getAIMLSections(): BAASection[] {
    const standardSections = this.getStandardSections();
    
    // Add AI/ML-specific sections
    const aiSections: BAASection[] = [
      {
        title: 'AI/ML Processing Safeguards',
        content: `Business Associate warrants that all AI/ML processing of PHI shall comply with the following requirements:

• Model training shall not retain or memorize PHI
• PHI shall be de-identified or anonymized before model training when possible
• All AI/ML models shall be regularly audited for bias and fairness
• Model outputs shall be reviewed for potential PHI disclosure
• AI/ML processing logs shall be maintained and made available for audit

Algorithmic Transparency: Business Associate shall provide Covered Entity with documentation describing:
• The purpose and functionality of AI/ML models processing PHI
• Data inputs and processing methods
• Model validation and testing procedures
• Bias mitigation strategies`,
        required: true,
        customizable: true
      },
      {
        title: 'Human Oversight Requirements',
        content: `Business Associate shall ensure that all AI/ML decisions involving PHI are subject to meaningful human review when:

• The decision significantly affects individual care or treatment
• The AI/ML system confidence score falls below established thresholds
• The decision involves sensitive or high-risk determinations
• Required by applicable law or regulation

Human reviewers shall be appropriately trained and qualified to understand both the clinical/business context and the AI/ML system limitations.`,
        required: true,
        customizable: true
      }
    ];

    return [...standardSections, ...aiSections];
  }

  /**
   * Populate template with provided options
   */
  private populateTemplate(template: string, options: BAAGenerationOptions): string {
    return template
      .replace(/{{coveredEntityName}}/g, options.coveredEntityName)
      .replace(/{{businessAssociateName}}/g, options.businessAssociateName)
      .replace(/{{effectiveDate}}/g, options.effectiveDate)
      .replace(/{{servicesDescription}}/g, options.servicesDescription);
  }

  /**
   * Generate full BAA document
   */
  private generateFullDocument(sections: BAASection[], options: BAAGenerationOptions): string {
    const header = `BUSINESS ASSOCIATE AGREEMENT

This Business Associate Agreement ("Agreement") is entered into on ${options.effectiveDate} between ${options.coveredEntityName} ("Covered Entity") and ${options.businessAssociateName} ("Business Associate").

RECITALS

WHEREAS, Covered Entity is a covered entity under the Health Insurance Portability and Accountability Act of 1996 ("HIPAA");

WHEREAS, Business Associate provides services to Covered Entity that may involve the use or disclosure of Protected Health Information ("PHI");

WHEREAS, the parties desire to enter into this Agreement to ensure compliance with HIPAA and its implementing regulations;

NOW, THEREFORE, in consideration of the mutual covenants contained herein, the parties agree as follows:

`;

    const body = sections.map((section, index) => 
      `${index + 1}. ${section.title.toUpperCase()}

${section.content}

`
    ).join('');

    const footer = `

SIGNATURES

Covered Entity: ${options.coveredEntityName}

By: _________________________    Date: _____________
Name: 
Title: 


Business Associate: ${options.businessAssociateName}

By: _________________________    Date: _____________
Name: 
Title: 

Generated on ${new Date().toLocaleDateString()} by AuroScan HIPAA Compliance System
This document is a template and should be reviewed by legal counsel before execution.`;

    return header + body + footer;
  }

  /**
   * Save generated BAA (in a real app, this would save to database)
   */
  public async saveBAA(baa: GeneratedBAA): Promise<void> {
    // In a real implementation, save to database
    const savedBAAs = this.getSavedBAAs();
    savedBAAs.push(baa);
    localStorage.setItem('auroscan_baas', JSON.stringify(savedBAAs));
  }

  /**
   * Get saved BAAs
   */
  public getSavedBAAs(): GeneratedBAA[] {
    const saved = localStorage.getItem('auroscan_baas');
    return saved ? JSON.parse(saved) : [];
  }

  /**
   * Download BAA as text file
   */
  public downloadBAA(baa: GeneratedBAA): void {
    const blob = new Blob([baa.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BAA_${baa.options.businessAssociateName.replace(/\s+/g, '_')}_${new Date(baa.timestamp).toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

export const baaService = BAAService.getInstance();