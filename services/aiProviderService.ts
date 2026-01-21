import { Finding } from '../types';
import { analyzeCodeForHIPAA as analyzeWithBedrock } from './bedrockService';

/**
 * Analyze code using AWS Bedrock (Claude)
 */
export const analyzeCodeForHIPAA = async (
  code: string,
  fileName: string
): Promise<Finding[]> => {
  console.log(`🤖 Using AI Provider: Bedrock (Claude)`);
  return analyzeWithBedrock(code, fileName);
};
