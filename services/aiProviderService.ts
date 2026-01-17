import { Finding } from '../types';
import { analyzeCodeForHIPAA as analyzeWithBedrock } from './bedrockService';
import { analyzeCodeForHIPAA as analyzeWithGemini } from './geminiService';
import { supabase } from './supabase';

export type AIProvider = 'bedrock' | 'gemini';

const DEFAULT_PROVIDER: AIProvider = 'bedrock';
const STORAGE_KEY = 'guardphi_ai_provider';

/**
 * Get the currently selected AI provider from Supabase or localStorage fallback
 */
export const getSelectedProvider = async (): Promise<AIProvider> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      // Try to fetch from Supabase
      const { data, error } = await supabase
        .from('user_preferences')
        .select('ai_provider')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!error && data?.ai_provider) {
        return data.ai_provider as AIProvider;
      }
    }
  } catch (error) {
    console.warn('Failed to fetch AI provider from Supabase:', error);
  }

  // Fallback to localStorage
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return (stored as AIProvider);
  }

  return DEFAULT_PROVIDER;
};

/**
 * Set the AI provider preference in Supabase and localStorage
 */
export const setSelectedProvider = async (provider: AIProvider): Promise<void> => {
  // Save to localStorage immediately
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, provider);
  }

  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      // Upsert to Supabase
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          ai_provider: provider,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (error) {
        console.error('Failed to save AI provider to Supabase:', error);
      } else {
        console.log(`✅ AI Provider saved: ${provider}`);
      }
    }
  } catch (error) {
    console.error('Error saving AI provider:', error);
  }
};

/**
 * Analyze code using the selected AI provider
 */
export const analyzeCodeForHIPAA = async (
  code: string,
  fileName: string,
  provider?: AIProvider
): Promise<Finding[]> => {
  const selectedProvider = provider || (await getSelectedProvider());
  
  console.log(`🤖 Using AI Provider: ${selectedProvider}`);
  
  if (selectedProvider === 'gemini') {
    return analyzeWithGemini(code, fileName);
  } else {
    return analyzeWithBedrock(code, fileName);
  }
};
